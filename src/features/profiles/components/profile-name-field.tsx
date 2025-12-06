import { InputProps } from "@shared/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shared/components/ui/input-group";
import { WorkflowIcon } from "lucide-react";

export const ProfileNameFieldControl = ({
  autoFocus = true,
  placeholder = "Enter new profile name here...",
  ...props
}: InputProps) => {
  return (
    <InputGroup>
      <InputGroupAddon>
        <WorkflowIcon />
      </InputGroupAddon>
      <InputGroupInput
        autoFocus={autoFocus}
        placeholder={placeholder}
        {...props}
      />
    </InputGroup>
  );
};
