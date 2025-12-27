import { profileFormHook } from "@features/profiles/components/forms/hook";
import { profileFormOpts } from "./add-new-profile-form-options";

export const EditProfileForm = profileFormHook.withForm({
  ...profileFormOpts,
  render: ({ form }) => {
    return (
      <form.AppField
        name="profile-name"
        children={(field) => <field.ProfileNameField />}
      />
    );
  },
});
