import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import ZplProgram from "@/programs/zpl";

export default class TokenAccountModel extends ZeusService {
  private readonly zplProgram: ZplProgram;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.zplProgram = this.core.getOrInstall(ZplProgram);
  }

  public async find(payload: { publicKey: string | PublicKey }) {
    const { assetMint } = await this.zplProgram.reserveSetting();
    const ata = await getAssociatedTokenAddress(
      new PublicKey(assetMint),
      new PublicKey(payload.publicKey),
      true,
    );
    return await getAccount(this.core.solanaConnection, ata);
  }
}
