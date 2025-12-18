import { ProfileRepository } from "@features/profiles/repository";
import { ScheduleRepository } from "@features/schedules/repository";
import { SoundRepository } from "@features/sounds/repository";
import { db } from "@shared/lib/db";

const profileRepository = new ProfileRepository(db);
const scheduleRepository = new ScheduleRepository(db);
const soundRepository = new SoundRepository(db);

export const repositories = {
  profile: profileRepository,
  schedule: scheduleRepository,
  sound: soundRepository,
};
