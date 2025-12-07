import { AppSettings } from "@features/configs/services";
import { Profiles } from "@shared/lib/db";
import { TypedStore } from "@shared/lib/stores";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Insertable } from "kysely";
import { ProfileRepository } from "./repository";

export class ProfileServices {
  private config: TypedStore<AppSettings>;
  private repository: ProfileRepository;

  constructor(config: TypedStore<AppSettings>, repository: ProfileRepository) {
    this.config = config;
    this.repository = repository;
  }

  getProfiles = async () => {
    return await this.repository.findAll.execute();
  };

  createProfile = async ({ name, timezone }: Insertable<Profiles>) => {
    const result = await this.repository
      .create({ name, timezone })
      .executeTakeFirstOrThrow();

    await this.config.set("active_profile", result.id);

    return result;
  };

  get query() {
    return {
      getProfiles: queryOptions({
        queryKey: ["profiles"],
        queryFn: this.getProfiles,
      }),
    };
  }

  get mutation() {
    return {
      insertProfile: mutationOptions({
        mutationFn: this.createProfile,
      }),
    };
  }
}
