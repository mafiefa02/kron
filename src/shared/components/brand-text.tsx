import { cn } from "@shared/lib/utils";
import { TimerIcon } from "lucide-react";

export const BrandText = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      className={cn(
        "pointer-events-none flex items-center justify-center gap-1.5 text-lg font-bold",
        className,
      )}
      {...props}
    >
      <TimerIcon className="size-5 stroke-3" /> Kron
    </p>
  );
};
