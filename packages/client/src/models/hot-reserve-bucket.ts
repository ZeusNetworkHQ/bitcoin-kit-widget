import { PublicKey } from "@solana/web3.js";
import { type HotReserveBucket } from "@zeus-network/zeus-stack-sdk/two-way-peg/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import ZplProgram from "@/programs/zpl";

dayjs.extend(utc);

export type { HotReserveBucket };

export default class HotReserveBucketModel extends ZeusService {
  private readonly zplProgram: ZplProgram;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.zplProgram = this.core.getOrInstall(ZplProgram);
  }

  public async findMany(payload: { solanaPublicKey: PublicKey }) {
    try {
      const twoWayPegClient = await this.zplProgram.twoWayPegClient();
      return twoWayPegClient.accounts.getHotReserveBucketsBySolanaPubkey(
        payload.solanaPublicKey,
      );
    } catch {
      return [];
    }
  }
}
