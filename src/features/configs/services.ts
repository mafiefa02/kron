import { TypedStore } from "@shared/lib/stores";
import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

export interface AppSettings {
  active_profile: number;
}

type ConfigKey = keyof AppSettings;

export class ConfigServices {
  private store: TypedStore<AppSettings>;

  constructor(config: TypedStore<AppSettings>) {
    this.store = config;
  }

  public get<K extends ConfigKey>(key: K): UseQueryOptions<AppSettings[K]> {
    return {
      queryKey: ["config", key],
      queryFn: async () => {
        const value = await this.store.get(key);
        if (value === null || value === undefined) {
          throw new Error(`Config key '${key}' not found`);
        }
        return value;
      },
    };
  }

  public set<K extends ConfigKey>(
    key: K,
  ): UseMutationOptions<void, Error, AppSettings[K]> {
    return {
      mutationFn: async (value: AppSettings[K]) =>
        await this.store.set(key, value),
    };
  }
}
