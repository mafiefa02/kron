import { Form } from "@base-ui-components/react/form";
import { useCallback, useState } from "react";
import { z } from "zod";

type Errors = Record<string, string | string[]>;

export const useValidateForm = <T>(schema: z.Schema<T>) => {
  const [errors, setErrors] = useState<Errors | undefined>(undefined);

  const validateForm = useCallback(
    (formValues: Form.Values) => {
      const validate = schema.safeParse(formValues);

      if (!validate.success) {
        const errors = z.flattenError(validate.error).fieldErrors as Errors;
        setErrors(errors);
        return validate;
      }

      setErrors(undefined);
      return validate;
    },
    [schema],
  );

  return { errors, validateForm };
};
