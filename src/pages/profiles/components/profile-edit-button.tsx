import { profileFormHook } from "@features/profiles/components/forms/hook";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@shared/components/ui/dialog";
import { services } from "@shared/lib/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { profileFormOpts } from "./add-new-profile-form-options";
import { EditProfileForm } from "./edit-profile-form";

export const ProfileEditButton = ({
  id,
  initialName,
}: {
  id: number;
  initialName: string;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate } = useMutation(services.profile.mutation.updateProfile);

  const profileForm = profileFormHook.useAppForm({
    ...profileFormOpts,
    defaultValues: {
      "profile-name": initialName,
    },
    onSubmit: ({ value }) => {
      mutate(
        {
          id,
          name: value["profile-name"],
        },
        {
          onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
          },
        },
      );
    },
  });

  const handleFormReset = useCallback(
    (open: boolean) => {
      if (!open) {
        profileForm.reset();
      }
    },
    [profileForm],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={handleFormReset}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
          />
        }
      >
        <EditIcon />
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to the profile's information.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <EditProfileForm form={profileForm} />
        </DialogPanel>
        <DialogFooter className="flex items-center gap-2">
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <profileForm.AppForm>
            <profileForm.SubmitButton>Save</profileForm.SubmitButton>
          </profileForm.AppForm>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};
