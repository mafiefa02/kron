import { BackgroundBeams } from "@shared/components/background-beams";
import { BrandText } from "@shared/components/brand-text";
import { Spotlight } from "@shared/components/spotlight";
import { WindowControls } from "@shared/components/window-controls";
import { Outlet } from "react-router";

export const SetupLayout = () => {
  return (
    <div className="relative flex h-dvh flex-1 flex-col items-center justify-center gap-6 overflow-hidden p-8">
      <div
        data-tauri-drag-region
        className="absolute inset-0 size-full"
      />
      <BackgroundBeams className="pointer-events-none" />
      <div className="pointer-events-none absolute size-full max-w-2xl">
        <Spotlight />
      </div>
      <div className="pointer-events-none absolute top-0 flex w-full items-center justify-between px-8 py-6 text-muted-foreground">
        <BrandText withIcon={false} />
        <WindowControls className="pointer-events-auto" />
      </div>
      <Outlet />
    </div>
  );
};
