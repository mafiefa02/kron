import { cn } from "@shared/lib/utils";
import { BellBrand } from "./illustrations/bell-brand";

interface BrandTextProps extends React.ComponentProps<"p"> {
  withIcon?: boolean;
}

export const BrandText = ({
  className,
  withIcon = true,
  ...props
}: BrandTextProps) => {
  return (
    <p
      className={cn(
        "pointer-events-none inline-flex items-center justify-center gap-1.5 text-lg font-bold",
        className,
      )}
      {...props}
    >
      {withIcon && <BellBrand className="size-5 stroke-3" />}
      <span>Genta</span>
    </p>
  );
};
