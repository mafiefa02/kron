import { GithubIcon, GlobeIcon, LinkedinIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const SOCIALS = [
  { label: "GitHub", to: "https://github.com/mafiefa02", icon: <GithubIcon /> },
  {
    label: "LinkedIn",
    to: "https://linkedin.com/in/mafiefa",
    icon: <LinkedinIcon />,
  },
  { label: "Afief's Web", to: "https://afiefabd.com", icon: <GlobeIcon /> },
];

interface SocialButtonProps extends React.ComponentProps<"button"> {
  to: string;
}

const SocialButton = ({ to, ...props }: SocialButtonProps) => {
  return (
    <Link
      key={to}
      to={to}
      target="_blank"
    >
      <Button
        size="icon-xs"
        className="hover:bg-transparent"
        variant="ghost"
        {...props}
      />
    </Link>
  );
};

export const Footer = () => {
  return (
    <footer
      data-tauri-drag-region
      className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground"
    >
      <p className="pointer-events-none">
        <span className="font-medium">&copy; 2025 Kron</span> | Afief
        Abdurrahman
      </p>
      <div className="space-x-3">
        <TooltipProvider>
          {SOCIALS.map((social) => (
            <Tooltip key={social.to}>
              <TooltipTrigger render={<SocialButton to={social.to} />}>
                {social.icon}
              </TooltipTrigger>
              <TooltipPopup>{social.label}</TooltipPopup>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </footer>
  );
};
