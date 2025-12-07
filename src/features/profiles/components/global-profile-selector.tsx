import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Skeleton } from "@shared/components/ui/skeleton";
import { repositories } from "@shared/lib/repositories";
import { services } from "@shared/lib/services";
import { useMutation, useQueries } from "@tanstack/react-query";
import { InferResult } from "kysely";
import { useCallback } from "react";

const LoadingState = () => <Skeleton className="h-8 w-full max-w-32" />;

export const GlobalProfileSelector = () => {
  const [
    {
      data: profiles,
      isPending: isProfilePending,
      isError: isProfileError,
      error: profileError,
    },
    {
      data: currentActiveProfile,
      isPending: isCurrentPending,
      isError: isCurrentError,
      error: currentError,
    },
  ] = useQueries({
    queries: [
      {
        ...services.profile.query.getProfiles,
        select: (data: InferResult<typeof repositories.profile.findAll>) =>
          data.map((profile) => ({ label: profile.name, value: profile.id })),
      },
      services.config.get("active_profile"),
    ],
  });

  const { mutate: changeProfile } = useMutation(
    services.config.set("active_profile"),
  );

  const handleChange = useCallback(
    (value: number | null) => {
      if (value) return changeProfile(value);
    },
    [changeProfile],
  );

  if (isProfilePending || isCurrentPending) return <LoadingState />;

  if (isProfileError) return <p>{profileError.message}</p>;
  if (isCurrentError) return <p>{currentError.message}</p>;

  return (
    <Select
      items={profiles}
      onValueChange={handleChange}
      defaultValue={currentActiveProfile}
    >
      <SelectTrigger className="w-auto">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        <SelectGroup>
          <SelectGroupLabel>Profiles</SelectGroupLabel>
          {profiles.map((profile) => (
            <SelectItem
              key={profile.value}
              value={profile.value}
            >
              {profile.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectPopup>
    </Select>
  );
};
