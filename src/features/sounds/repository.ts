import { FeatureRepository } from "@models/repository";
import { Sounds } from "@shared/lib/db";
import { Insertable } from "kysely";

export class SoundRepository extends FeatureRepository<"sounds"> {
  protected readonly table = "sounds";

  get findAll() {
    return this.db.selectFrom(this.table).selectAll();
  }

  public insert(value: Insertable<Sounds>) {
    return this.db.insertInto(this.table).values(value).returning("id");
  }

  public update(id: number, value: Partial<Insertable<Sounds>>) {
    return this.db
      .updateTable(this.table)
      .set(value)
      .where("id", "=", id)
      .returning("id");
  }

  public delete(id: number) {
    return this.db.deleteFrom(this.table).where("id", "=", id).returning("id");
  }
}
