import { queryClient } from "@shared/lib/query-client";
import { TypedStore } from "@shared/lib/stores";
import { handleError } from "@shared/lib/utils";
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

  public get<K extends ConfigKey>(
    key: K,
    options?: Partial<UseQueryOptions<AppSettings[K]>>,
  ): UseQueryOptions<AppSettings[K]> {
    return {
      queryKey: ["config", key],
      queryFn: async () => {
        try {
          const value = await this.store.get(key);
          if (value === null || value === undefined) {
            throw new Error(`Config key '${key}' not found`);
          }
          return value;
        } catch (e) {
          return handleError(e);
        }
      },
      ...options,
    };
  }

  public set<K extends ConfigKey>(
    key: K,
    options?: Partial<UseMutationOptions<void, Error, AppSettings[K]>>,
  ): UseMutationOptions<void, Error, AppSettings[K]> {
    return {
      mutationFn: async (value: AppSettings[K]) => {
        try {
          await this.store.set(key, value);
        } catch (e) {
          return handleError(e);
        }
      },
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: ["config", key] });
        options?.onSuccess?.(...args);
      },
    };
  }
}
