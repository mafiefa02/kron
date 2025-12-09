import { cn } from "@shared/lib/utils";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";
import { useCallback } from "react";
import { Button } from "./ui/button";

export const WindowControls = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const appWindow = getCurrentWindow();

  const handleMinimize = useCallback(
    async () => await appWindow.minimize(),
    [appWindow],
  );

  const handleMaximize = useCallback(
    async () => await appWindow.toggleMaximize(),
    [appWindow],
  );

  const handleClose = useCallback(
    async () => await appWindow.close(),
    [appWindow],
  );

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={handleMinimize}
      >
        <Minus className="size-4" />
      </Button>

      <Button
        size="icon-sm"
        variant="ghost"
        onClick={handleMaximize}
      >
        <Square className="size-3" />
      </Button>

      <Button
        size="icon-sm"
        variant="ghost"
        onClick={handleClose}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
};
