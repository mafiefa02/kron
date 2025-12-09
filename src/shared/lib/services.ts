import { AppSettings, ConfigServices } from "@features/configs/services";
import { ProfileServices } from "@features/profiles/services";
import { ScheduleServices } from "@features/schedules/services";
import { repositories } from "@shared/lib/repositories";
import { stores, TypedStore } from "@shared/lib/stores";

const config = new TypedStore<AppSettings>(stores.config);

const configServices = new ConfigServices(config);
const profileServices = new ProfileServices(config, repositories.profile);
const scheduleServices = new ScheduleServices(config, repositories.schedule);

export const services = {
  config: configServices,
  profile: profileServices,
  schedule: scheduleServices,
};
