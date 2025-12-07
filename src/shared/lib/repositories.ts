import { ProfileRepository } from "@features/profiles/repository";
import { db } from "@shared/lib/db";

const profileRepository = new ProfileRepository(db);

export const repositories = {
  profile: profileRepository,
};
