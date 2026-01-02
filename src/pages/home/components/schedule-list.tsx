import { NoDataIllustration } from "@shared/components/illustrations/no-data";
import { WarningIllustration } from "@shared/components/illustrations/warning";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import { Checkbox } from "@shared/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@shared/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@shared/components/ui/field";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Radio, RadioGroup } from "@shared/components/ui/radio-group";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Separator } from "@shared/components/ui/separator";
import { Skeleton } from "@shared/components/ui/skeleton";
import { Schedules } from "@shared/lib/db";
import { useDebounce } from "@shared/lib/hooks";
import { services } from "@shared/lib/services";
import {
  cn,
  formatDate,
  minutesToTime,
  timeToMinutes,
} from "@shared/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Selectable } from "kysely";
import { EditIcon, RepeatIcon, TrashIcon, Volume2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDateContext } from "../contexts/date-context";
import { useSearchContext } from "../contexts/search-context";

export const ScheduleList = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { date } = useDateContext();
  const { search } = useSearchContext();
  const debouncedSearch = useDebounce(search, 250);

  const { data, isPending, isError, error } = useQuery(
    services.schedule.query.getSchedules({
      profileId: "currentProfile",
      date: formatDate(date),
      search: debouncedSearch,
    }),
  );

  if (isPending) return <ScheduleListPending />;
  if (isError) return <ScheduleListError error={error.message} />;
  if (data.length === 0) return <ScheduleListEmpty />;

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {data.map((schedule) => (
        <ScheduleListItem
          key={schedule.id}
          id={schedule.id}
          time={schedule.final_time}
          name={schedule.name}
          soundName={schedule.sound_name}
          soundId={schedule.final_sound_id}
          repeat={schedule.repeat}
        />
      ))}
    </div>
  );
};

const ScheduleListItem = ({
  id,
  time,
  name,
  soundName,
  soundId,
  repeat,
}: {
  id: number;
  time: number;
  name: string;
  soundName: string;
  soundId: number | null;
  repeat: Selectable<Schedules>["repeat"];
}) => {
  return (
    <Card className="group">
      <CardContent className="relative flex items-center gap-4">
        <h1 className="text-lg font-semibold tabular-nums">
          {minutesToTime(time)}
        </h1>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">{name}</h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <ScheduleInfo>
              <Volume2Icon className="size-3.5" />
              <p>{soundName ?? "Default"}</p>
            </ScheduleInfo>
            <ScheduleInfo>
              <RepeatIcon className="size-3.5" />
              <p className="capitalize">{repeat}</p>
            </ScheduleInfo>
          </div>
        </div>
        <div className="absolute right-0 hidden h-full items-center gap-3 bg-card mask-[linear-gradient(to_right,transparent,theme(--color-card)_2rem)] pr-4 pl-10 group-hover:flex [&_svg]:size-4!">
          <ScheduleEditButton
            id={id}
            repeat={repeat}
            initialData={{ name, time, soundId }}
          />
          <ScheduleDeleteButton
            id={id}
            repeat={repeat}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ScheduleEditButton = ({
  id,
  repeat,
  initialData,
}: {
  id: Selectable<Schedules>["id"];
  repeat: Selectable<Schedules>["repeat"];
  initialData: {
    name: string;
    time: number;
    soundId: number | null;
  };
}) => {
  const { date } = useDateContext();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    name: initialData.name,
    time: minutesToTime(initialData.time),
    soundId: initialData.soundId,
    isSkipped: false,
  });

  const [updateType, setUpdateType] = useState<"only" | "all" | "afterward">(
    "all",
  );

  const { data: sounds } = useQuery({
    ...services.sound.query.getSounds,
    select: (sounds) => [
      { label: "Default", value: null },
      ...sounds.map((s) => ({ label: s.name, value: String(s.id) })),
    ],
  });

  const { mutate } = useMutation(
    services.schedule.mutation.updateSchedule({
      id,
      date: format(date, "yyyy-MM-dd"),
    }),
  );

  const handleSave = useCallback(() => {
    mutate(
      {
        updateType: repeat === "once" ? "only" : updateType,
        values: {
          name: formState.name,
          time: timeToMinutes(formState.time) || 0,
          sound_id: formState.soundId,
          is_cancelled: formState.isSkipped,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
      },
    );
  }, [mutate, repeat, updateType, formState, queryClient]);

  const handleChange = useCallback(
    (v: unknown) => setUpdateType(v as "only" | "all" | "afterward"),
    [],
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
          />
        }
      >
        <EditIcon />
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>
            Make changes to the schedule&apos;s information.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Time</FieldLabel>
            <Input
              type="time"
              value={formState.time}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, time: e.target.value }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>Sound</FieldLabel>
            <Select
              value={
                formState.soundId === null ? "null" : String(formState.soundId)
              }
              onValueChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  soundId: val === "null" ? null : Number(val),
                }))
              }
              items={
                sounds?.map((s) => ({
                  ...s,
                  value: s.value === null ? "null" : s.value,
                })) ?? []
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {sounds?.map((sound) => (
                  <SelectItem
                    key={sound.value ?? "null"}
                    value={sound.value ?? "null"}
                  >
                    {sound.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
          <Field className="flex flex-row items-start justify-between gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:bg-accent/50">
            <div className="pointer-events-none flex flex-col gap-1">
              <FieldLabel>Skip this schedule?</FieldLabel>
              <FieldDescription>
                Whether to skip this schedule from playing on this selected
                date.
              </FieldDescription>
            </div>
            <Checkbox
              checked={formState.isSkipped}
              onCheckedChange={(pressed) =>
                setFormState((prev) => ({ ...prev, isSkipped: pressed }))
              }
            />
          </Field>
        </DialogPanel>
        <DialogFooter>
          {repeat === "once" ? (
            <>
              <DialogClose render={<Button variant="ghost" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button onClick={handleSave} />}>
                Save Changes
              </DialogClose>
            </>
          ) : (
            <>
              <DialogClose render={<Button variant="ghost" />}>
                Cancel
              </DialogClose>
              <Dialog>
                <DialogTrigger render={<Button />}>Next</DialogTrigger>
                <DialogPopup>
                  <DialogHeader>
                    <DialogTitle>Apply changes to?</DialogTitle>
                    <DialogDescription>
                      Where should we apply your changes on the schedule?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogPanel>
                    <RadioGroup
                      onValueChange={handleChange}
                      value={updateType}
                    >
                      <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                        <Radio
                          id="only"
                          value="only"
                        />
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="only">Only for this date</Label>
                          <p className="text-xs text-muted-foreground">
                            Update this schedule only for the selected date
                          </p>
                        </div>
                      </Label>
                      <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                        <Radio
                          id="afterward"
                          value="afterward"
                        />
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="afterward">This date and after</Label>
                          <p className="text-xs text-muted-foreground">
                            Update this schedule for the selected date and after
                          </p>
                        </div>
                      </Label>
                      <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                        <Radio
                          id="all"
                          value="all"
                        />
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="all">Every schedule</Label>
                          <p className="text-xs text-muted-foreground">
                            Update this schedule entirely, including past and
                            future schedule.
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </DialogPanel>
                  <DialogFooter>
                    <DialogClose render={<Button variant="ghost" />}>
                      Cancel
                    </DialogClose>
                    <DialogClose render={<Button onClick={handleSave} />}>
                      Save Changes
                    </DialogClose>
                  </DialogFooter>
                </DialogPopup>
              </Dialog>
            </>
          )}
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};

const ScheduleDeleteButton = ({
  id,
  repeat,
}: {
  id: Selectable<Schedules>["id"];
  repeat: Selectable<Schedules>["repeat"];
}) => {
  const { date } = useDateContext();
  const queryClient = useQueryClient();

  const [deleteType, setDeleteType] = useState<"only" | "all" | "afterward">(
    "all",
  );

  const { mutate } = useMutation(
    services.schedule.mutation.deleteSchedule({
      id,
      date: format(date, "yyyy-MM-dd"),
    }),
  );

  const handleChange = useCallback(
    (v: unknown) => setDeleteType(v as "only" | "all" | "afterward"),
    [],
  );

  const handleDelete = useCallback(
    () =>
      mutate(deleteType, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
      }),
    [mutate, deleteType, queryClient],
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="destructive-outline"
            size="icon"
          />
        }
      >
        <TrashIcon />
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete this schedule.
          </DialogDescription>
        </DialogHeader>
        {repeat !== "once" && (
          <DialogPanel>
            <RadioGroup
              onValueChange={handleChange}
              value={deleteType}
            >
              <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <Radio
                  id="only"
                  value="only"
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="only">Only for this date</Label>
                  <p className="text-xs text-muted-foreground">
                    Delete this schedule only for the selected date
                  </p>
                </div>
              </Label>
              <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <Radio
                  id="afterward"
                  value="afterward"
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="afterward">This date and after</Label>
                  <p className="text-xs text-muted-foreground">
                    Delete this schedule for the selected date and after
                  </p>
                </div>
              </Label>
              <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <Radio
                  id="all"
                  value="all"
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="all">Every schedule</Label>
                  <p className="text-xs text-muted-foreground">
                    Delete this schedule entirely, including past and future
                    schedule.
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </DialogPanel>
        )}
        <DialogFooter>
          <DialogClose render={<Button />}>Cancel</DialogClose>
          <DialogClose
            render={
              <Button
                onClick={handleDelete}
                variant="destructive"
              />
            }
          >
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};

const ScheduleInfo = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
};

const ScheduleListPending = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [skeletonCount] = useState(() => Math.floor(Math.random() * 4) + 3);
  return (
    <div
      className={cn("flex flex-1 flex-col gap-3", className)}
      {...props}
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-24 w-full rounded-2xl"
        />
      ))}
    </div>
  );
};

const ScheduleListError = ({
  className,
  error,
  ...props
}: React.ComponentProps<"div"> & { error: string }) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 px-8",
        className,
      )}
      {...props}
    >
      <WarningIllustration className="size-40" />
      <div className="flex max-w-[60ch] flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold">Oops! Something went wrong</h1>
        <h3 className="text-balance text-muted-foreground">{error}</h3>
      </div>
    </div>
  );
};

const ScheduleListEmpty = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 px-8",
        className,
      )}
      {...props}
    >
      <NoDataIllustration className="size-40" />
      <div className="flex max-w-[60ch] flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold">No Data Found</h1>
        <h3 className="text-balance text-muted-foreground">
          Looks like we couldn&apos;t find what you&apos;re looking for.
        </h3>
      </div>
    </div>
  );
};
