import { AddSoundButton } from "./components/add-sound-button";
import { SearchProvider } from "./components/search-provider";
import { SearchSounds } from "./components/search-sounds";
import { SoundList } from "./components/sound-list";

export const Sounds = () => {
  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <h1 className="text-2xl font-semibold">Sounds</h1>
        </div>
      </div>

      <SearchProvider>
        <div className="flex items-center gap-2">
          <SearchSounds />
          <AddSoundButton />
        </div>

        <SoundList />
      </SearchProvider>
    </div>
  );
};
