import { appDataDir } from "@tauri-apps/api/path";
import Database from "@tauri-apps/plugin-sql";
import { Kysely } from "kysely";
import type { ColumnType } from "kysely";
import { TauriSqliteDialect } from "kysely-dialect-tauri";

type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface Profiles {
  id: Generated<number>;
  name: string;
  timezone: string;
}

export interface Extensions {
  id: Generated<number>;
  name: string;
  data_url: string;
}

export interface ProfilesExtensions {
  id: Generated<number>;
  profile_id: Generated<number>;
  extension_id: Generated<number>;
  created_at: Generated<Date>;
  updated_at: Date | null;
  settings: string | null;
  is_enabled: boolean;
}

export interface Schedules {
  id: Generated<number>;
  sound_id: Generated<number>;
  profile_id: Generated<number>;
  name: string;
  time: number;
  created_at: Generated<Date>;
  updated_at: Date | null;
  is_active: boolean;
}

export interface ScheduleDays {
  schedule_id: Generated<number>;
  day_of_week: number;
}

export interface ScheduleOverrides {
  id: Generated<number>;
  schedule_id: Generated<number>;
  original_date: Date;
  new_sound_id: Generated<number> | null;
  new_date: Date | null;
  new_time: Date | null;
  created_at: Generated<Date>;
  updated_at: Date | null;
}

export interface DatabaseTables {
  profiles: Profiles;
  extensions: Extensions;
  profilesExtensions: ProfilesExtensions;
  schedules: Schedules;
  scheduleDays: ScheduleDays;
  scheduleOverrides: ScheduleOverrides;
}

export const db = new Kysely<DatabaseTables>({
  dialect: new TauriSqliteDialect({
    database: async (prefix) =>
      Database.load(`${prefix}${await appDataDir()}/kron.db`),
  }),
});
