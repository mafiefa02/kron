import { AnyFieldMeta } from "@tanstack/react-form";

export const FormFieldError = ({
  name,
  meta,
}: {
  name: string;
  meta: AnyFieldMeta;
}) => {
  if (!meta.isTouched) return null;

  return meta.errors.map((e, i) => (
    <p
      className="text-sm text-destructive"
      key={`${name}errors-${i}`}
    >
      {e.message}
    </p>
  ));
};
