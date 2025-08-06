import ZeusCore, { type CreateZeusCoreParams } from "./core";

export type CreateZeusServiceParams<T = Record<string, unknown>> = {
  core?: ZeusCore | CreateZeusCoreParams;
} & T;

class ZeusService {
  protected core: ZeusCore;

  constructor({ core }: CreateZeusServiceParams) {
    this.core = ZeusCore.create(core);
  }
}

export default ZeusService;
