import { FormFieldError } from "@shared/components/form-field-error";
import { Button, ButtonProps } from "@shared/components/ui/button";
import { Calendar } from "@shared/components/ui/calendar";
import { Field, FieldLabel } from "@shared/components/ui/field";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { DayPickerProps, PropsSingle } from "react-day-picker";
import { scheduleFormContext } from "../context";

interface DatePickerLabelProps {
  label: string;
}

interface DatePickerTriggerProps extends ButtonProps {
  placeholder?: string;
}

type DatePickerCalendarProps = DayPickerProps & PropsSingle;

interface DatePickerFieldProps {
  componentProps: {
    trigger: DatePickerTriggerProps;
    label: DatePickerLabelProps;
    calendar: DatePickerCalendarProps;
  };
  withError?: boolean;
}

export const DatePickerField = ({
  componentProps,
  withError = true,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const field = scheduleFormContext.useFieldContext<Date | null>();
  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        field.handleChange(date);
      } else {
        field.form.resetField(field.name);
      }
      setOpen(false);
    },
    [field],
  );

  return (
    <Field
      name={field.name}
      invalid={field.state.meta.errors.length > 0}
      className="w-full"
    >
      <FieldLabel>{componentProps.label.label}</FieldLabel>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              {...componentProps.trigger}
            />
          }
        >
          <CalendarIcon className="size-4" />
          {field.state.value ? (
            format(field.state.value, "PP")
          ) : (
            <span className="text-muted-foreground/72">
              {componentProps.trigger.placeholder ?? "Select date"}
            </span>
          )}
        </PopoverTrigger>
        <PopoverPopup>
          <Calendar
            className="bg-popover p-0"
            selected={field.state.value ?? undefined}
            onSelect={handleSelect}
            {...componentProps.calendar}
          />
        </PopoverPopup>
      </Popover>
      {withError && (
        <FormFieldError
          name={field.name}
          meta={field.state.meta}
        />
      )}
    </Field>
  );
};
