import { NoDataIllustration } from "@shared/components/illustrations/no-data";
import { WarningIllustration } from "@shared/components/illustrations/warning";
import { Card, CardContent } from "@shared/components/ui/card";
import { Separator } from "@shared/components/ui/separator";
import { Skeleton } from "@shared/components/ui/skeleton";
import { Schedules } from "@shared/lib/db";
import { useDebounce } from "@shared/lib/hooks";
import { services } from "@shared/lib/services";
import { cn, formatDate, minutesToTime } from "@shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Selectable } from "kysely";
import { RepeatIcon, Volume2Icon } from "lucide-react";
import { useState } from "react";
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
  time,
  name,
  soundName,
  repeat,
}: {
  time: number;
  name: string;
  soundName: string;
  repeat: Selectable<Schedules>["repeat"];
}) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
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
      </CardContent>
    </Card>
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
