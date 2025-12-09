import { AppSettings } from "@features/configs/services";
import { TypedStore } from "@shared/lib/stores";

export abstract class FeatureServices<R> {
  constructor(
    protected readonly config: TypedStore<AppSettings>,
    protected readonly repository: R,
  ) {}
}
