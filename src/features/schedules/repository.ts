import { FeatureRepository } from "@models/repository";
import { ScheduleDays, ScheduleOverrides, Schedules } from "@shared/lib/db";
import { Insertable, Selectable, sql } from "kysely";

export class ScheduleRepository extends FeatureRepository<"schedules"> {
  protected readonly table = "schedules";

  public findAll(params: {
    profileId: Selectable<Schedules>["profile_id"];
    date: Selectable<ScheduleOverrides>["original_date"];
    search?: Selectable<Schedules>["name"];
  }) {
    let query = this.db
      .selectFrom("schedules")
      .leftJoin("sounds", "schedules.sound_id", "sounds.id")
      .leftJoin("schedule_overrides", (join) =>
        join
          .onRef("schedules.id", "=", "schedule_overrides.schedule_id")
          .on((eb) => eb("schedule_overrides.original_date", "=", params.date)),
      )
      .leftJoin(
        "sounds as override_sounds",
        "schedule_overrides.new_sound_id",
        "override_sounds.id",
      )
      .select([
        "schedules.id",
        "schedules.name",
        "schedules.repeat",
        sql<number>`COALESCE(schedule_overrides.new_time, schedules.time)`.as(
          "final_time",
        ),
        sql<string>`COALESCE(override_sounds.name, sounds.name)`.as(
          "sound_name",
        ),
        sql<string>`COALESCE(override_sounds.file_name, sounds.file_name)`.as(
          "sound_file",
        ),
        "schedule_overrides.new_date",
        "schedule_overrides.is_cancelled",
      ])
      .where("schedules.profile_id", "=", params.profileId)
      .where("schedules.is_active", "=", 1)
      .where("schedules.start_date", "<=", params.date)
      .where((eb) =>
        eb.or([
          eb("schedules.end_date", ">=", params.date),
          eb("schedules.end_date", "is", null),
        ]),
      )
      .where((eb) =>
        eb.or([
          eb("schedules.repeat", "=", "daily"),
          eb.and([
            eb("schedules.repeat", "=", "once"),
            eb("schedules.start_date", "=", params.date),
          ]),
          eb.and([
            eb("schedules.repeat", "=", "weekly"),
            eb.exists(
              eb
                .selectFrom("schedule_days")
                .select("schedule_days.schedule_id")
                .whereRef("schedule_days.schedule_id", "=", "schedules.id")
                .where(
                  "schedule_days.day_of_week",
                  "=",
                  sql<number>`CAST(strftime('%u', ${params.date}) AS INTEGER)`,
                ),
            ),
          ]),
        ]),
      )
      .where((eb) =>
        eb.and([
          eb.or([
            eb("schedule_overrides.is_cancelled", "is", null),
            eb("schedule_overrides.is_cancelled", "=", 0),
          ]),
          eb.or([
            eb("schedule_overrides.new_date", "is", null),
            eb("schedule_overrides.new_date", "=", params.date),
          ]),
        ]),
      );

    if (params.search) {
      query = query.where("schedules.name", "like", `%${params.search}%`);
    }

    return query.orderBy("final_time", "asc");
  }

  public insert(value: Insertable<Schedules>) {
    return this.db.insertInto(this.table).values(value).returning("id");
  }

  public insertDays(values: Insertable<ScheduleDays>[]) {
    return this.db.insertInto("schedule_days").values(values);
  }
}
