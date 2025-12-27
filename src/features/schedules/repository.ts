import { FeatureRepository } from "@models/repository";
import { ScheduleOverrides, Schedules } from "@shared/lib/db";
import { formatDate, parseDate } from "@shared/lib/utils";
import { subDays } from "date-fns";
import { Insertable, Selectable, sql } from "kysely";

export class ScheduleRepository extends FeatureRepository<"schedules"> {
  protected readonly table = "schedules";

  public findAll(params: {
    profileId: Selectable<Schedules>["profile_id"];
    date: Selectable<ScheduleOverrides>["original_date"];
    search?: Selectable<Schedules>["name"];
  }) {
    return this.db
      .selectFrom("schedules")
      .leftJoin("sounds", "schedules.sound_id", "sounds.id")
      .leftJoin("schedule_overrides", (join) =>
        join
          .onRef("schedules.id", "=", "schedule_overrides.schedule_id")
          .on("schedule_overrides.original_date", "=", params.date),
      )
      .leftJoin(
        "sounds as override_sounds",
        "schedule_overrides.new_sound_id",
        "override_sounds.id",
      )
      .select([
        "schedules.id",
        sql<string>`COALESCE(schedule_overrides.new_name, schedules.name)`.as(
          "name",
        ),
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
      .where(
        sql`COALESCE(schedules.end_date, ${params.date})`,
        ">=",
        params.date,
      )
      .where(sql`COALESCE(schedule_overrides.is_cancelled, 0)`, "=", 0)
      .where(
        sql`COALESCE(schedule_overrides.new_date, ${params.date})`,
        "=",
        params.date,
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
      .$if(!!params.search, (qb) =>
        qb.where("schedules.name", "like", `%${params.search}%`),
      )
      .orderBy("final_time", "asc");
  }

  public insert(value: Insertable<Schedules> & { days?: number[] }) {
    return this.db.transaction().execute(async (trx) => {
      const { days, ...rest } = value;
      const result = await trx
        .insertInto(this.table)
        .values(rest)
        .returning("id")
        .executeTakeFirstOrThrow();

      if (rest.repeat === "weekly" && days && days.length > 0) {
        await trx
          .insertInto("schedule_days")
          .values(
            days.map((day) => ({
              schedule_id: result.id,
              day_of_week: day,
            })),
          )
          .execute();
      }

      return result;
    });
  }

  public delete(params: {
    id: Selectable<Schedules>["id"];
    profileId: Selectable<Schedules>["profile_id"];
    deleteType: "only" | "afterward" | "all";
    date: Selectable<ScheduleOverrides>["original_date"];
  }) {
    if (params.deleteType === "only") {
      return this.db
        .insertInto("schedule_overrides")
        .values({
          schedule_id: params.id,
          original_date: params.date,
          is_cancelled: 1,
        })
        .returning("schedule_id")
        .executeTakeFirstOrThrow();
    }

    if (params.deleteType === "afterward") {
      const prevDay = subDays(parseDate(params.date), 1);
      const endDate = formatDate(prevDay);
      return this.db
        .updateTable(this.table)
        .set({ end_date: endDate })
        .where((eb) =>
          eb.and([
            eb("id", "=", params.id),
            eb("profile_id", "=", params.profileId),
          ]),
        )
        .returning("id")
        .executeTakeFirstOrThrow();
    }

    return this.db
      .deleteFrom(this.table)
      .where((eb) =>
        eb.and([
          eb("id", "=", params.id),
          eb("profile_id", "=", params.profileId),
        ]),
      )
      .returning("id")
      .executeTakeFirstOrThrow();
  }
}
