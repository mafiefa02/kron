import { ProfileNameFieldControl } from "../../profile-name-field";
import { FormFieldError } from "@shared/components/form-field-error";
import { Field } from "@shared/components/ui/field";
import { profileFormContext } from "../context";
import { InputProps } from "@shared/components/ui/input";

export const ProfileNameField = (props: InputProps) => {
  const field = profileFormContext.useFieldContext<string>();
  return (
    <Field
      name={field.name}
      invalid={field.state.meta.errors.length > 0}
    >
      <ProfileNameFieldControl
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        {...props}
      />
      <FormFieldError
        name={field.name}
        meta={field.state.meta}
      />
    </Field>
  );
};