import { FormPrimitive } from "@shared/components/ui/form";
import { db } from "@shared/lib/db";
import { useValidateForm } from "@shared/lib/hooks";
import { store } from "@shared/lib/store";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { createProfileSchema } from "./schemas";

export const useCreateProfile = () => {
  const navigate = useNavigate();
  const { timeZone: timezone } = Intl.DateTimeFormat().resolvedOptions();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!name) throw new Error("Name can't be empty!");

      const query = db
        .insertInto("profiles")
        .values({ name, timezone })
        .returning("id");

      const result = await query.executeTakeFirstOrThrow();
      return await store.set("active_profile", result.id);
    },
    onSuccess: () => navigate("/"),
  });
};

export const useCreateProfileForm = () => {
  const { errors, validateForm } = useValidateForm(createProfileSchema);
  const mutation = useCreateProfile();

  const handleSubmit = useCallback(
    (values: FormPrimitive.Values) => {
      const validated = validateForm(values);
      if (validated.success) {
        return mutation.mutate(validated.data["profile-name"]);
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
