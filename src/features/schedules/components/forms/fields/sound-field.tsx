import { Field, FieldLabel } from "@shared/components/ui/field";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { services } from "@shared/lib/services";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { scheduleFormContext } from "../context";

interface SoundFieldProps {
  label: string;
}

export const SoundField = ({ label }: SoundFieldProps) => {
  const field = scheduleFormContext.useFieldContext<number | null>();
  const { data, isPending, isError, error } = useQuery({
    ...services.sound.query.getProfiles,
    select: (sounds) => [
      { label: "Default", value: null },
      ...sounds.map((sound) => ({
        label: sound.name,
        value: String(sound.id),
      })),
    ],
  });

  const handleChange = useCallback(
    (v: string | null) => {
      if (v === null || isNaN(Number(v))) {
        field.setValue(null);
      } else {
        field.handleChange(Number(v));
      }
    },
    [field],
  );

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <Field
      name={field.name}
      invalid={field.state.meta.errors.length > 0}
    >
      <FieldLabel>{label}</FieldLabel>
      <Select
        items={data}
        value={field.state.value ? String(field.state.value) : null}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {data.map((sound) => (
            <SelectItem
              key={sound.value}
              value={sound.value}
            >
              {sound.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
};
