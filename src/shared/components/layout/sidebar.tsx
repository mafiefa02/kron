import { HouseIcon, UserIcon, Volume2Icon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";

const MENUS = [
  { label: "Home", to: "/", icon: <HouseIcon /> },
  { label: "Profiles", to: "/profiles", icon: <UserIcon /> },
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
        variant={isActive ? "secondary" : "ghost"}
      >
        {icon}
        <p>{label}</p>
      </Button>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <aside className="h-full min-w-52 p-4">
      <div className="flex flex-col gap-2">
        {MENUS.map((menu) => (
          <SidebarItem
            key={menu.to}
            {...menu}
          />
        ))}
      </div>
    </aside>
  );
};
