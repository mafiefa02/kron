import { DatabaseTables } from "@shared/lib/db";
import { Kysely } from "kysely";

export abstract class FeatureRepository<T extends keyof DatabaseTables> {
  protected abstract readonly table: T;
  constructor(protected readonly db: Kysely<DatabaseTables>) {}
}
