import { profileFormHook } from "@features/profiles/components/forms/hook";
import { AddNewProfileForm } from "@pages/profiles/components/add-new-profile-form";
import { profileFormOpts } from "@pages/profiles/components/add-new-profile-form-options";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@shared/components/ui/alert";
import { services } from "@shared/lib/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRightIcon, CircleAlertIcon, RotateCcwIcon } from "lucide-react";
import { useNavigate } from "react-router";

export const NewProfileForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isError, error, isPending } = useMutation(
    services.profile.mutation.insertProfile,
  );

  const form = profileFormHook.useAppForm({
    ...profileFormOpts,
    onSubmit: async ({ value }) => {
      await new Promise<void>((resolve, reject) => {
        mutate(
          {
            name: value["profile-name"],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["profiles"] });
              navigate("/");
              resolve();
            },
            onError: (err) => {
              reject(err);
            },
          },
        );
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-80">
      <form.AppForm>
        <div className="flex flex-col gap-4">
          {isError && (
            <Alert
              className="text-xs"
              variant="error"
            >
              <CircleAlertIcon />
              <AlertTitle>Something went wrong!</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <AddNewProfileForm form={form} />

          <form.SubmitButton
            disabled={isPending}
            className="group w-full"
          >
            Get Started
            {isPending ? (
              <RotateCcwIcon className="animate-spin" />
            ) : (
              <ChevronRightIcon className="-translate-x-1 transition-all duration-200 ease-in-out group-hover:translate-x-0" />
            )}
          </form.SubmitButton>

          <p className="w-full text-center text-sm text-muted-foreground">
            You can always change this later
          </p>
        </div>
      </form.AppForm>
    </div>
  );
};
