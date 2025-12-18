import { FormFieldError } from "@shared/components/form-field-error";
import { Field, FieldLabel } from "@shared/components/ui/field";
import { Input, InputProps } from "@shared/components/ui/input";
import { scheduleFormContext } from "../context";

interface TextFieldProps extends InputProps {
  label: string;
  withError?: boolean;
}

export const TextField = ({
  label,
  withError = true,
  ...props
}: TextFieldProps) => {
  const field = scheduleFormContext.useFieldContext<string>();
  return (
    <Field
      name={field.name}
      invalid={field.state.meta.errors.length > 0}
    >
      <FieldLabel>{label}</FieldLabel>
      <Input
        {...props}
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
      />
      {withError && (
        <FormFieldError
          name={field.name}
          meta={field.state.meta}
        />
      )}
    </Field>
  );
};
