import { createFormHook } from "@tanstack/react-form";
import { SubmitButton } from "./components/submit-button";
import { profileFormContext as context } from "./context";
import { ProfileNameField } from "./fields/profile-name-field";

export const profileFormHook = createFormHook({
  fieldContext: context.fieldContext,
  formContext: context.formContext,
  fieldComponents: {
    ProfileNameField,
  },
  formComponents: {
    SubmitButton,
  },
});
