import { FeatureServices } from "@models/service";
import { Profiles } from "@shared/lib/db";
import { handleThrowError } from "@shared/lib/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Insertable } from "kysely";
import { ProfileRepository } from "./repository";

export class ProfileServices extends FeatureServices<ProfileRepository> {
  private getProfiles = async () => {
    try {
      return await this.repository.findAll.execute();
    } catch (e) {
      return handleThrowError(e);
    }
  };

  private createProfile = async ({ name, timezone }: Insertable<Profiles>) => {
    try {
      const result = await this.repository
        .insert({ name, timezone })
        .executeTakeFirstOrThrow();

      await this.config.set("active_profile", result.id);

      return result;
    } catch (e) {
      return handleThrowError(e);
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
        mutationKey: ["create-profile"],
        mutationFn: this.createProfile,
      }),
    };
  }
}
