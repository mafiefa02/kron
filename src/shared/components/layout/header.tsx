import { GlobalProfileSelector } from "@features/profiles/components/global-profile-selector";
import { useTime } from "@shared/lib/hooks";
import { format } from "date-fns";
import { PanelLeftCloseIcon } from "lucide-react";
import { BrandText } from "../brand-text";
import { Button } from "../ui/button";
import { buttonVariants } from "../ui/button/variants";

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
    <header className="px-4 py-3">
      <div className="flex items-center gap-8">
        <div
          className={buttonVariants({
            variant: "ghost",
            className:
              "flex w-full max-w-44 items-center justify-center hover:bg-transparent",
          })}
        >
          <BrandText className="items-center text-2xl leading-0 [&_svg]:size-6" />
        </div>
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
            >
              <PanelLeftCloseIcon />
            </Button>
            <CurrentTime />
          </div>
          <GlobalProfileSelector />
        </div>
      </div>
    </header>
  );
};
