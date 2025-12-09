import { useTime } from "@shared/lib/hooks";
import { cn } from "@shared/lib/utils";
import { format } from "date-fns";
import { BrandText } from "../brand-text";
import { WindowControls } from "../window-controls";
import { SidebarControlButton } from "./sidebar";
import { useSidebar } from "./sidebar/context";

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

const HeaderLogo = () => {
  const { isExpanded } = useSidebar();
  if (!isExpanded) return null;
  return (
    <div className="flex w-full max-w-44 items-center justify-center">
      <BrandText className="items-center text-2xl leading-0 [&_svg]:size-6" />
    </div>
  );
};

const HeaderInfo = () => {
  const { isExpanded } = useSidebar();
  return (
    <div className={cn("flex items-center", isExpanded ? "gap-2" : "gap-8")}>
      <SidebarControlButton />
      <CurrentTime />
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
      <div className="pointer-events-none relative z-10 flex items-center gap-4">
        <HeaderLogo />
        <div className="flex w-full items-center justify-between">
          <HeaderInfo />
          <div className="pointer-events-auto">
            <WindowControls />
          </div>
        </div>
      </div>
    </header>
  );
};
