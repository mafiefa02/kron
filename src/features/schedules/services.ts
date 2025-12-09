import { FeatureServices } from "@models/service";
import { ScheduleOverrides, Schedules } from "@shared/lib/db";
import { handleError } from "@shared/lib/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Insertable, Selectable } from "kysely";
import { ScheduleRepository } from "./repository";

export class ScheduleServices extends FeatureServices<ScheduleRepository> {
  getSchedules = async (params: {
    profileId: Selectable<Schedules>["profile_id"];
    date: Selectable<ScheduleOverrides>["original_date"];
    search?: Selectable<Schedules>["name"];
  }) => {
    const query = this.repository.findAll(params);
    try {
      return await query.execute();
    } catch (e) {
      return handleError(e);
    }
  };

  createSchedule = async (values: Insertable<Schedules>) => {
    const query = this.repository.insert(values);
    try {
      return await query.executeTakeFirstOrThrow();
    } catch (e) {
      return handleError(e);
    }
  };

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
              return handleError(e);
            }
          },
        });
      },
    };
  }

  get mutation() {
    return {
      insertSchedule: mutationOptions({
        mutationKey: ["create-schedule"],
        mutationFn: this.createSchedule,
      }),
    };
  }
}
