import { UnlistenFn } from "@tauri-apps/api/event";
import { load, Store } from "@tauri-apps/plugin-store";

export class TypedStore<T extends object> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  async get<K extends keyof T>(key: K): Promise<T[K] | undefined> {
    return this.store.get<T[K]>(key as string);
  }

  async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    return this.store.set(key as string, value);
  }

  async has(key: keyof T): Promise<boolean> {
    return this.store.has(key as string);
  }

  async delete(key: keyof T): Promise<boolean> {
    return this.store.delete(key as string);
  }

  async onKeyChange<K extends keyof T>(
    key: K,
    cb: (value: T[K] | undefined) => void,
  ): Promise<UnlistenFn> {
    return this.store.onKeyChange(key as string, cb);
  }

  async onChange(
    cb: (key: keyof T, value: T[keyof T] | undefined) => void,
  ): Promise<UnlistenFn> {
    return this.store.onChange((k, v) => {
      cb(k as keyof T, v as T[keyof T]);
    });
  }

  async save(): Promise<void> {
    return this.store.save();
  }

  async clear(): Promise<void> {
    return this.store.clear();
  }

  async reset(): Promise<void> {
    return this.store.reset();
  }
}

const config = await load("config.json");
export const stores = { config };
