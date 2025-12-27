import { createProfileSchema } from "@features/profiles/schemas";
import { formOptions } from "@tanstack/react-form";

export const profileFormOpts = formOptions({
  defaultValues: {
    "profile-name": "",
  },
  validators: {
    onSubmit: createProfileSchema,
  },
});
