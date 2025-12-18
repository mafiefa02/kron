import { FormFieldError } from "@shared/components/form-field-error";
import { Field, FieldLabel } from "@shared/components/ui/field";
import { InputProps } from "@shared/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shared/components/ui/input-group";
import { minutesToTime, timeToMinutes } from "@shared/lib/utils";
import { useCallback } from "react";
import { scheduleFormContext } from "../context";

interface TimeFieldProps extends InputProps {
  label: string;
  withError?: boolean;
}

export const TimeField = ({ label, withError, ...props }: TimeFieldProps) => {
  const field = scheduleFormContext.useFieldContext<number>();
  const value = minutesToTime(field.state.value);
  const handleChange = useCallback(
    (value: string | undefined) => {
      const newVal = value ? timeToMinutes(value) : undefined;
      if (newVal) {
        field.handleChange(newVal);
      }
    },
    [field],
  );

  return (
    <Field
      name={field.name}
      invalid={field.state.meta.errors.length > 0}
    >
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          {...props}
          type="time"
          value={value}
          onValueChange={handleChange}
          onBlur={field.handleBlur}
          className="tabular-nums"
        />
        <InputGroupAddon
          className="text-xs text-muted-foreground"
          align="inline-end"
        >
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </InputGroupAddon>
      </InputGroup>
      {withError && (
        <FormFieldError
          name={field.name}
          meta={field.state.meta}
        />
      )}
    </Field>
  );
};
