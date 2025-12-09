import { useTime } from "@shared/lib/hooks";
import { format } from "date-fns";
import { PanelLeftClose } from "lucide-react";
import { BrandText } from "../brand-text";
import { Button } from "../ui/button";
import { WindowControls } from "../window-controls";

const CurrentTime = () => {
  const time = useTime();
  return (
    <div className="flex flex-col gap-0">
      <div className="inline-flex gap-1 text-sm font-medium">
        <p className="tabular-nums">{format(time, "HH:mm:ss")}</p>
        <p>{format(time, "EEEE")}</p>
      </div>
      <p className="text-xs font-light text-muted-foreground">
        {format(time, "PPP")}
      </p>
    </div>
  );
};

export const Header = () => {
  return (
    <header className="relative px-4 py-3">
      <div
        data-tauri-drag-region
        className="absolute inset-0"
      />
      <div className="pointer-events-none relative z-10 flex items-center gap-8">
        <div className="flex w-full max-w-44 items-center justify-center">
          <BrandText className="items-center text-2xl leading-0 [&_svg]:size-6" />
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="pointer-events-auto"
            >
              <PanelLeftClose />
            </Button>
            <CurrentTime />
          </div>

          <div className="pointer-events-auto">
            <WindowControls />
          </div>
        </div>
      </div>
    </header>
  );
};
