import { NoDataIllustration } from "@shared/components/illustrations/no-data";
import { WarningIllustration } from "@shared/components/illustrations/warning";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
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
import { Label } from "@shared/components/ui/label";
import { Radio, RadioGroup } from "@shared/components/ui/radio-group";
import { Separator } from "@shared/components/ui/separator";
import { Skeleton } from "@shared/components/ui/skeleton";
import { Schedules } from "@shared/lib/db";
import { useDebounce } from "@shared/lib/hooks";
import { services } from "@shared/lib/services";
import { cn, formatDate, minutesToTime } from "@shared/lib/utils";
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
  repeat,
}: {
  id: number;
  time: number;
  name: string;
  soundName: string;
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
          <Button
            variant="outline"
            size="icon"
          >
            <EditIcon />
          </Button>
          <ScheduleDeleteButton id={id} />
        </div>
      </CardContent>
    </Card>
  );
};

const ScheduleDeleteButton = ({ id }: { id: Selectable<Schedules>["id"] }) => {
  const { date } = useDateContext();
  const queryClient = useQueryClient();

  const [deleteType, setDeleteType] = useState<"only" | "all" | "afterward">(
    "only",
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
