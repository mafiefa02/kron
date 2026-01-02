import { FeatureServices } from "@models/service";
import { Sounds } from "@shared/lib/db";
import { handleThrowError } from "@shared/lib/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Insertable } from "kysely";
import { SoundRepository } from "./repository";

export class SoundServices extends FeatureServices<SoundRepository> {
  private getSounds = async () => {
    try {
      return await this.repository.findAll.execute();
    } catch (e) {
      return handleThrowError(e);
    }
  };

  private createSound = async (values: Insertable<Sounds>) => {
    try {
      return await this.repository.insert(values).executeTakeFirstOrThrow();
    } catch (e) {
      return handleThrowError(e);
    }
  };

  private updateSound = async ({
    id,
    ...values
  }: Partial<Insertable<Sounds>> & { id: number }) => {
    try {
      return await this.repository.update(id, values).executeTakeFirstOrThrow();
    } catch (e) {
      return handleThrowError(e);
    }
  };

  private deleteSound = async (id: number) => {
    try {
      return await this.repository.delete(id).executeTakeFirstOrThrow();
    } catch (e) {
      return handleThrowError(e);
    }
  };

  get query() {
    return {
      getSounds: queryOptions({
        queryKey: ["sounds"],
        queryFn: this.getSounds,
      }),
    };
  }

  get mutation() {
    return {
      createSound: mutationOptions({
        mutationKey: ["create-sound"],
        mutationFn: this.createSound,
      }),
      updateSound: mutationOptions({
        mutationKey: ["update-sound"],
        mutationFn: this.updateSound,
      }),
      deleteSound: mutationOptions({
        mutationKey: ["delete-sound"],
        mutationFn: this.deleteSound,
      }),
    };
  }
}
