import { Button, ButtonProps } from "@shared/components/ui/button";
import { Profiles } from "@shared/lib/db";
import { store } from "@shared/lib/store";
import { cn } from "@shared/lib/utils";
import { Selectable } from "kysely";
import { useCallback } from "react";
import { useNavigate } from "react-router";

interface ProfileCardProps extends ButtonProps {
  profile: Selectable<Profiles>;
}

export const ProfileCard = ({
  profile,
  className,
  ...props
}: ProfileCardProps) => {
  const navigate = useNavigate();
  const handleSelect = useCallback(() => {
    store.set("active_profile", profile.id);
    navigate("/");
  }, [navigate, profile.id]);

  return (
    <Button
      variant="outline"
      className={cn("flex flex-col items-start p-6", className)}
      onClick={handleSelect}
      {...props}
    >
      <h1 className="text-lg leading-none font-semibold">{profile.name}</h1>
      <h3 className="text-sm text-muted-foreground">{profile.timezone}</h3>
    </Button>
  );
};
