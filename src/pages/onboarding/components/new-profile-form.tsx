import { ProfileNameFieldControl } from "@features/profiles/components/profile-name-field";
import { useCreateProfileForm } from "@features/profiles/hooks";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@shared/components/ui/alert";
import { Button } from "@shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
} from "@shared/components/ui/field";
import { Form } from "@shared/components/ui/form";
import { ChevronRightIcon, CircleAlertIcon, RotateCcwIcon } from "lucide-react";

export const NewProfileForm = () => {
  const { errors, handleSubmit, mutation } = useCreateProfileForm();
  const { isError, error, isPending } = mutation;

  return (
    <Form
      errors={errors}
      onFormSubmit={handleSubmit}
      className="mx-auto w-full max-w-80"
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

        <Button
          disabled={isPending}
          className="group w-full"
          type="submit"
        >
          Get Started
          {isPending ? (
            <RotateCcwIcon className="animate-spin" />
          ) : (
            <ChevronRightIcon className="-translate-x-1 transition-all duration-200 ease-in-out group-hover:translate-x-0" />
          )}
        </Button>

        <FieldDescription className="w-full text-center">
          You can always change this later
        </FieldDescription>
      </Field>
    </Form>
  );
};
