import { Field, FieldLabel } from "@shared/components/ui/field";
import {
  Toggle,
  ToggleGroup,
  ToggleGroupSeparator,
} from "@shared/components/ui/toggle-group";
import { useCallback } from "react";
import { scheduleFormContext } from "../context";

type RepeatType = "once" | "daily" | "weekly";

interface RepeatFieldProps {
  label: string;
}

export const RepeatField = ({ label }: RepeatFieldProps) => {
  const field = scheduleFormContext.useFieldContext<RepeatType>();
  const handleChange = useCallback(
    (value: RepeatType[]) =>
      value.length > 0
        ? field.handleChange(value[0])
        : field.form.resetField(field.name),
    [field],
  );

  return (
    <Field
      name={field.name}
      invalid={field.state.meta.errors.length > 0}
      className="w-full"
    >
      <FieldLabel>{label}</FieldLabel>
      <ToggleGroup
        value={[field.state.value]}
        onValueChange={handleChange}
        onBlur={field.handleBlur}
        variant="outline"
        className="w-full"
      >
        <Toggle
          className="flex-1"
          value="once"
        >
          Once
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="daily"
        >
          Daily
        </Toggle>
        <ToggleGroupSeparator />
        <Toggle
          className="flex-1"
          value="weekly"
        >
          Weekly
        </Toggle>
      </ToggleGroup>
    </Field>
  );
};
