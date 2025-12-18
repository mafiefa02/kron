import { scheduleFormHook } from "@features/schedules/components/forms/hook";
import { FormFieldError } from "@shared/components/form-field-error";
import { scheduleFormOpts } from "./add-new-form-options";

export const AddNewScheduleForm = scheduleFormHook.withForm({
  ...scheduleFormOpts,
  render: ({ form }) => {
    return (
      <div className="flex flex-col gap-4">
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Schedule Name"
              placeholder="Enter the schedule name here..."
            />
          )}
        />
        <form.AppField
          name="repeat"
          listeners={{
            onChange: ({ value, fieldApi }) => {
              if (value === "daily") {
                fieldApi.form.setFieldValue("days", [1, 2, 3, 4, 5, 6, 7]);
              } else {
                fieldApi.form.resetField("days");
              }
            },
          }}
          children={(field) => <field.RepeatField label="Repeat Type" />}
        />
        <form.Subscribe
          selector={(field) => field.values.repeat}
          children={(repeat) => {
            if (repeat !== "weekly") return null;
            return (
              <>
                {repeat === "weekly" && (
                  <form.AppField
                    name="days"
                    listeners={{
                      onChange: ({ value, fieldApi }) => {
                        const repeatVal = fieldApi.form.getFieldValue("repeat");
                        if (value.length === 7 && repeatVal !== "daily") {
                          fieldApi.form.setFieldValue("repeat", "daily");
                        }
                      },
                    }}
                    children={(field) => <field.DaysField label="Days" />}
                  />
                )}
              </>
            );
          }}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <form.AppField
              name="startDate"
              listeners={{
                onChange: ({ fieldApi, value }) => {
                  const endDate = fieldApi.form.getFieldValue("endDate");
                  if (endDate && value > endDate) {
                    fieldApi.form.resetField("endDate");
                  }
                },
              }}
              children={(field) => (
                <field.DatePickerField
                  withError={false}
                  componentProps={{
                    popover: { side: "top", align: "start" },
                    label: { label: "Start Date" },
                    calendar: { mode: "single" },
                    trigger: { className: "w-full justify-start" },
                  }}
                />
              )}
            />
            <form.Subscribe
              selector={(state) => ({
                startDate: state.values.startDate,
                repeat: state.values.repeat,
              })}
              children={(values) =>
                values.repeat !== "once" && (
                  <form.AppField
                    name="endDate"
                    children={(field) => (
                      <field.DatePickerField
                        componentProps={{
                          popover: { side: "top", align: "start" },
                          label: { label: "End Date" },
                          calendar: {
                            mode: "single",
                            disabled: {
                              before: values.startDate,
                            },
                          },
                          trigger: {
                            className: "w-full justify-start",
                            disabled: !values.startDate,
                          },
                        }}
                        withError={false}
                      />
                    )}
                  />
                )
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Set when this reminder should start and end.
          </p>
          <form.Subscribe
            selector={(state) => state.fieldMeta.startDate}
            children={(fieldMeta) => {
              if (!fieldMeta) return null;
              return (
                <FormFieldError
                  name="startDate"
                  meta={fieldMeta}
                />
              );
            }}
          />
          <form.Subscribe
            selector={(state) => state.fieldMeta.endDate}
            children={(fieldMeta) => {
              if (!fieldMeta) return null;
              return (
                <FormFieldError
                  name="endDate"
                  meta={fieldMeta}
                />
              );
            }}
          />
        </div>
        <form.AppField
          name="time"
          children={(field) => <field.TimeField label="Time" />}
        />
        <form.AppField
          name="sound"
          children={(field) => <field.SoundField label="Sound" />}
        />
      </div>
    );
  },
});
