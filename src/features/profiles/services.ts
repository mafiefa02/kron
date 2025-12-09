import { FeatureServices } from "@models/service";
import { Profiles } from "@shared/lib/db";
import { handleError } from "@shared/lib/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Insertable } from "kysely";
import { ProfileRepository } from "./repository";

export class ProfileServices extends FeatureServices<ProfileRepository> {
  getProfiles = async () => {
    try {
      return await this.repository.findAll.execute();
    } catch (e) {
      return handleError(e);
    }
  };

  createProfile = async ({ name, timezone }: Insertable<Profiles>) => {
    try {
      const result = await this.repository
        .insert({ name, timezone })
        .executeTakeFirstOrThrow();

      await this.config.set("active_profile", result.id);

      return result;
    } catch (e) {
      return handleError(e);
    }
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
