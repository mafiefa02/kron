import { appDataDir } from "@tauri-apps/api/path";
import Database from "@tauri-apps/plugin-sql";
import { Kysely } from "kysely";
import { TauriSqliteDialect } from "kysely-dialect-tauri";
import { DatabaseTables } from "./types";

export const db = new Kysely<DatabaseTables>({
  dialect: new TauriSqliteDialect({
    database: async (prefix) =>
      Database.load(`${prefix}${await appDataDir()}/kron.db`),
  }),
});
