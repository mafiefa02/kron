import { FeatureRepository } from "@models/repository";
import { Profiles } from "@shared/lib/db";
import { Insertable } from "kysely";

export class ProfileRepository extends FeatureRepository<"profiles"> {
  protected readonly table = "profiles";

  public get findAll() {
    return this.db.selectFrom(this.table).selectAll();
  }

  public insert(profile: Insertable<Profiles>) {
    return this.db.insertInto(this.table).values(profile).returning("id");
  }
}
