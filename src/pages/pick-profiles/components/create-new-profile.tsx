import { ProfileNameFieldControl } from "@features/profiles/components/profile-name-field";
import { useCreateProfileForm } from "@features/profiles/hooks";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@shared/components/ui/alert";
import { Button, ButtonProps } from "@shared/components/ui/button";
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
import { Field, FieldError } from "@shared/components/ui/field";
import { Form } from "@shared/components/ui/form";
import { cn } from "@shared/lib/utils";
import { CircleAlertIcon, Loader2Icon, PlusIcon } from "lucide-react";

export const CreateNewProfile = ({ className, ...props }: ButtonProps) => {
  const { errors, handleSubmit, mutation } = useCreateProfileForm();
  const { isPending, isError, error } = mutation;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full text-center text-muted-foreground transition-colors hover:text-foreground",
              className,
            )}
            {...props}
          />
        }
      >
        <PlusIcon />
        <p>Create new profile</p>
      </DialogTrigger>

      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create a new profile</DialogTitle>
          <DialogDescription>
            This profile will be used to determine your schedules.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <Form
            id="create-profile"
            errors={errors}
            onFormSubmit={handleSubmit}
          >
            <Field name="profile-name">
              <ProfileNameFieldControl />

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

              <FieldError
                render={({ children }) => (
                  <Alert
                    className="text-xs"
                    variant="error"
                  >
                    <CircleAlertIcon />
                    <AlertDescription>{children}</AlertDescription>
                  </Alert>
                )}
              />
            </Field>
          </Form>
        </DialogPanel>

        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button
            form="create-profile"
            type="submit"
            size={isPending ? "icon" : "default"}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <p>Create</p>
            )}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};
