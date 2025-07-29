import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import CoreConfig from "@/config/core";

export default class TokenAccountModel {
  private readonly core: CoreConfig;

  constructor({ coreConfig = new CoreConfig() } = {}) {
    this.core = coreConfig;
  }

  public async find(payload: { publicKey: string | PublicKey }) {
    const { assetMint } = await this.core.accounts.reserveSetting();
    const ata = await getAssociatedTokenAddress(
      new PublicKey(assetMint),
      new PublicKey(payload.publicKey),
      true
    );
    return await getAccount(this.core.solanaConnection, ata);
  }
}
