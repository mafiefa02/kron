import { GlobalProfileSelector } from "@features/profiles/components/global-profile-selector";
import { CalendarIcon, TimerIcon, Volume2Icon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { buttonVariants } from "../ui/button/variants";

const MENUS = [
  { label: "Schedules", to: "/", icon: <TimerIcon /> },
  { label: "Profiles", to: "/profiles", icon: <CalendarIcon /> },
  { label: "Sounds", to: "/sounds", icon: <Volume2Icon /> },
];

interface SidebarItemProps {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const SidebarItem = ({ label, to, icon }: SidebarItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  return (
    <Link to={to}>
      <Button
        className="w-full justify-start"
        variant={isActive ? "outline" : "ghost"}
      >
        {icon}
        <p>{label}</p>
      </Button>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside
      data-tauri-drag-region
      className="flex h-full min-w-52 flex-col justify-between px-4 pt-2 pb-3"
    >
      <div className="flex flex-col gap-2">
        {MENUS.map((menu) => (
          <SidebarItem
            key={menu.to}
            {...menu}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <GlobalProfileSelector />
        <div
          className={buttonVariants({
            className: "justify-between! px-3!",
            variant: "outline",
            size: "xs",
          })}
        >
          <p>Status</p>
          <p className="inline-flex items-center gap-1 text-muted-foreground">
            <div className="size-2 rounded-full bg-success" /> Online
          </p>
        </div>
      </div>
    </aside>
  );
};
