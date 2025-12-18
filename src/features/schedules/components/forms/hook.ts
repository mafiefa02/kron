import { createFormHook } from "@tanstack/react-form";
import { SubmitButton } from "./components/submit-button";
import { scheduleFormContext as context } from "./context";
import { DatePickerField } from "./fields/date-field";
import { DaysField } from "./fields/days-field";
import { RepeatField } from "./fields/repeat-field";
import { SoundField } from "./fields/sound-field";
import { TextField } from "./fields/text-field";
import { TimeField } from "./fields/time-field";

export const scheduleFormHook = createFormHook({
  fieldContext: context.fieldContext,
  formContext: context.formContext,
  fieldComponents: {
    TextField,
    DatePickerField,
    TimeField,
    RepeatField,
    DaysField,
    SoundField,
  },
  formComponents: {
    SubmitButton,
  },
});
