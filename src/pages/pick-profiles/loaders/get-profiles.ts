import { db } from "@shared/lib/db";

export type GetProfiles = typeof getProfiles;
export const getProfiles = async () => {
  const query = db.selectFrom("profiles").selectAll();
  return query.execute();
};
