import { FeatureServices } from "@models/service";
import { ScheduleOverrides, Schedules } from "@shared/lib/db";
import { handleThrowError } from "@shared/lib/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Insertable, Selectable } from "kysely";
import { ScheduleRepository } from "./repository";

export class ScheduleServices extends FeatureServices<ScheduleRepository> {
  private async getSchedules(params: {
    profileId: Selectable<Schedules>["profile_id"];
    date: Selectable<ScheduleOverrides>["original_date"];
    search?: Selectable<Schedules>["name"];
  }) {
    const query = this.repository.findAll(params);
    try {
      return await query.execute();
    } catch (e) {
      return handleThrowError(e);
    }
  }

  private async createSchedule(
    params: { profileId: Schedules["profile_id"] | "currentProfile" },
    values: Omit<Insertable<Schedules>, "profile_id"> & { days: number[] },
  ) {
    try {
      const pid =
        params.profileId === "currentProfile"
          ? await this.config.get("active_profile")
          : params.profileId;

      if (!pid) throw new Error("No profile specified!");

      const { days, ...rest } = values;

      const query = this.repository.insert({
        ...rest,
        profile_id: pid,
      });

      const schedule = await query.executeTakeFirstOrThrow();

      if (days.length > 0) {
        await this.repository
          .insertDays(
            days.map((day) => ({
              schedule_id: schedule.id,
              day_of_week: day,
            })),
          )
          .execute();
      }

      return schedule;
    } catch (e) {
      return handleThrowError(e);
    }
  }

  private async deleteSchedule(
    params: Omit<Parameters<ScheduleRepository["delete"]>[0], "profileId">,
    profileId: Selectable<Schedules>["profile_id"] | "currentProfile",
  ) {
    try {
      const pid =
        profileId === "currentProfile"
          ? await this.config.get("active_profile")
          : profileId;

      if (!pid) throw new Error("No profile specified!");

      return await this.repository.delete({
        ...params,
        profileId: pid,
      });
    } catch (e) {
      return handleThrowError(e);
    }
  }

  get query() {
    return {
      getSchedules: (params: {
        profileId: Selectable<Schedules>["profile_id"] | "currentProfile";
        date: Selectable<ScheduleOverrides>["original_date"];
        search?: Selectable<Schedules>["name"];
      }) => {
        return queryOptions({
          queryKey: ["schedules", params],
          queryFn: async () => {
            try {
              const pid =
                params.profileId === "currentProfile"
                  ? await this.config.get("active_profile")
                  : params.profileId;

              if (!pid) throw new Error("No profile specified!");

              const result = await this.getSchedules({
                ...params,
                profileId: pid,
              });

              return result;
            } catch (e) {
              return handleThrowError(e);
            }
          },
        });
      },
    };
  }

  get mutation() {
    return {
      insertSchedule: (params: {
        profileId: Schedules["profile_id"] | "currentProfile";
      }) =>
        mutationOptions({
          mutationKey: ["create-schedule", params],
          mutationFn: async (
            values: Omit<Insertable<Schedules>, "profile_id"> & {
              days: number[];
            },
          ) => this.createSchedule(params, values),
        }),
      deleteSchedule: (
        params: Omit<
          Parameters<ScheduleRepository["delete"]>[0],
          "profileId" | "deleteType"
        >,
        profileId:
          | Selectable<Schedules>["profile_id"]
          | "currentProfile" = "currentProfile",
      ) =>
        mutationOptions({
          mutationKey: ["delete-schedule", params],
          mutationFn: async (
            deleteType: Parameters<
              ScheduleRepository["delete"]
            >[0]["deleteType"],
          ) => this.deleteSchedule({ ...params, deleteType }, profileId),
        }),
    };
  }
}
