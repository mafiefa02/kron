import { ProfileRepository } from "@features/profiles/repository";
import { ScheduleRepository } from "@features/schedules/repository";
import { db } from "@shared/lib/db";

const profileRepository = new ProfileRepository(db);
const scheduleRepository = new ScheduleRepository(db);

export const repositories = {
  profile: profileRepository,
  schedule: scheduleRepository,
};
