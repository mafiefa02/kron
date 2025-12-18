import { Field, FieldLabel } from "@shared/components/ui/field";
import {
  Toggle,
  ToggleGroup,
  ToggleGroupSeparator,
} from "@shared/components/ui/toggle-group";
import { useCallback } from "react";
import { scheduleFormContext } from "../context";

interface DaysFieldProps {
  label: string;
}

export const DaysField = ({ label }: DaysFieldProps) => {
  const field = scheduleFormContext.useFieldContext<number[]>();
  const value = field.state.value.map(String);
  const handleChange = useCallback(
    (value: string[]) => {
      const mapped = value.map(Number);
      return value.length > 0 && mapped.every((v) => !isNaN(v))
        ? field.handleChange(mapped)
        : field.form.resetField(field.name);
    },
    [field],
  );

  return (
    <Field
      name={field.name}
      invalid={field.state.meta.errors.length > 0}
    >
      <FieldLabel>{label}</FieldLabel>
      <ToggleGroup
        value={value}
        onValueChange={handleChange}
        onBlur={field.handleBlur}
        variant="outline"
        className="w-full"
        multiple
      >
        <Toggle
          className="flex-1"
          value="1"
        >
          Mon
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="2"
        >
          Tue
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="3"
        >
          Wed
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="4"
        >
          Thu
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="5"
        >
          Fri
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="6"
        >
          Sat
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="7"
        >
          Sun
        </Toggle>
      </ToggleGroup>
    </Field>
  );
};
