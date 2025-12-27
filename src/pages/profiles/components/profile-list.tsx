import { NoDataIllustration } from "@shared/components/illustrations/no-data";
import { WarningIllustration } from "@shared/components/illustrations/warning";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@shared/components/ui/dialog";
import { Skeleton } from "@shared/components/ui/skeleton";
import { useDebounce } from "@shared/lib/hooks";
import { services } from "@shared/lib/services";
import { cn } from "@shared/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchContext } from "../contexts/search-context";
import { ProfileEditButton } from "./profile-edit-button";

export const ProfileList = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { search } = useSearchContext();
  const debouncedSearch = useDebounce(search, 250);

  const { data, isPending, isError, error } = useQuery(
    services.profile.query.getProfiles({
      search: debouncedSearch,
    }),
  );

  const activeProfile = useQuery(services.config.get("active_profile"));

  if (isPending || activeProfile.isPending) return <ProfileListPending />;
  if (isError) return <ProfileListError error={error.message} />;
  if (data.length === 0) return <ProfileListEmpty />;

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {data.map((profile) => (
        <ProfileListItem
          key={profile.id}
          id={profile.id}
          name={profile.name}
          scheduleCount={Number(profile.schedule_count)}
          isActive={profile.id === activeProfile.data}
        />
      ))}
    </div>
  );
};

const ProfileListItem = ({
  id,
  name,
  scheduleCount,
  isActive,
}: {
  id: number;
  name: string;
  scheduleCount: number;
  isActive: boolean;
}) => {
  return (
    <Card className="group">
      <CardContent className="relative flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">{name}</h1>
            {isActive && (
              <Badge
                variant="info"
                size="sm"
              >
                Active
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {scheduleCount} {scheduleCount === 1 ? "schedule" : "schedules"}
          </p>
        </div>
        <div className="absolute right-0 hidden h-full items-center gap-3 bg-card mask-[linear-gradient(to_right,transparent,theme(--color-card)_2rem)] pr-4 pl-10 group-hover:flex [&_svg]:size-4!">
          <ProfileEditButton
            id={id}
            initialName={name}
          />
          <ProfileDeleteButton
            id={id}
            scheduleCount={scheduleCount}
            isActive={isActive}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileDeleteButton = ({
  id,
  scheduleCount,
  isActive,
}: {
  id: number;
  scheduleCount: number;
  isActive: boolean;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...services.profile.mutation.deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  const handleDelete = useCallback(() => {
    mutation.mutate(id);
  }, [mutation, id]);

  if (isActive) return null;

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
            You are about to delete this profile. This will also delete{" "}
            <strong className="text-foreground">{scheduleCount}</strong>{" "}
            schedule
            {scheduleCount === 1 ? "" : "s"} tied to it.
          </DialogDescription>
        </DialogHeader>
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

const ProfileListPending = ({
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

const ProfileListError = ({
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

const ProfileListEmpty = ({
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
