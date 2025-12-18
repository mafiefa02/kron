import { Button, ButtonProps } from "@shared/components/ui/button";
import { scheduleFormContext } from "../context";

export const SubmitButton = (props: ButtonProps) => {
  const form = scheduleFormContext.useFormContext();
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
