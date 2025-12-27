import { Button, ButtonProps } from "@shared/components/ui/button";
import { profileFormContext } from "../context";

export const SubmitButton = (props: ButtonProps) => {
  const form = profileFormContext.useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          disabled={isSubmitting}
          onClick={form.handleSubmit}
          type="submit"
          {...props}
        />
      )}
    </form.Subscribe>
  );
};
