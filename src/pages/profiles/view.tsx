import { AddProfileButton } from "./components/add-profile-button";
import { ProfileList } from "./components/profile-list";
import { SearchProfiles } from "./components/search-profiles";
import { SearchProvider } from "./components/search-provider";

export const Profiles = () => {
  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-semibold">Profiles</h1>
        </div>
      </div>

      <SearchProvider>
        <div className="flex items-center gap-2">
          <SearchProfiles />
          <AddProfileButton />
        </div>

        <ProfileList />
      </SearchProvider>
    </div>
  );
};