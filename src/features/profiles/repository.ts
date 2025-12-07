import { DatabaseTables, Profiles } from "@shared/lib/db";
import { Insertable, Kysely } from "kysely";

export class ProfileRepository {
  private db: Kysely<DatabaseTables>;

  constructor(database: Kysely<DatabaseTables>) {
    this.db = database;
  }

  public get findAll() {
    return this.db.selectFrom("profiles").selectAll();
  }

  public create(profile: Insertable<Profiles>) {
    return this.db.insertInto("profiles").values(profile).returning("id");
  }
}
