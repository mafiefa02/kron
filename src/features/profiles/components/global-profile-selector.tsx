import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { db, store } from "@shared/lib";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useCallback } from "react";

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
        queryKey: ["profiles"],
        queryFn: async () => {
          const query = db
            .selectFrom("profiles")
            .select(["name as label", "id as value"]);
          const result = await query.execute();
          return result;
        },
      },
      {
        queryKey: ["current-active-profile"],
        queryFn: async () => await store.get("active_profile"),
      },
    ],
  });

  const { mutate: changeProfile } = useMutation({
    mutationFn: async (value: number) => store.set("active_profile", value),
  });

  const handleChange = useCallback(
    (value: number | null) => {
      if (value) return changeProfile(value);
    },
    [changeProfile],
  );

  if (isProfilePending || isCurrentPending) return <p>Loading...</p>;

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
