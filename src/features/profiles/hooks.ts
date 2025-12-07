import { FormPrimitive } from "@shared/components/ui/form";
import { useValidateForm } from "@shared/lib/hooks";
import { services } from "@shared/lib/services";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { createProfileSchema } from "./schemas";

export const useCreateProfileForm = () => {
  const { errors, validateForm } = useValidateForm(createProfileSchema);
  const navigate = useNavigate();
  const mutation = useMutation({
    ...services.profile.mutation.insertProfile,
    onSuccess: () => navigate("/"),
  });

  const handleSubmit = useCallback(
    (values: FormPrimitive.Values) => {
      const validated = validateForm(values);
      if (validated.success) {
        return mutation.mutate({
          name: validated.data["profile-name"],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    },
    [validateForm, mutation],
  );

  return {
    errors,
    handleSubmit,
    mutation,
  };
};
