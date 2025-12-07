import { repositories } from "@shared/lib/repositories";

export type GetProfiles = typeof getProfiles;
export const getProfiles = async () =>
  await repositories.profile.findAll.execute();
