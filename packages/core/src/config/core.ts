import { PublicKey, type Connection } from "@solana/web3.js";
import {
  LiquidityManagementClient,
  TwoWayPegClient,
} from "@zeus-network/zpl-sdk";
import BigNumber from "bignumber.js";

import AccountsConfig from "./accounts";
import { getDefaultConnection } from "./helpers";

import { BitcoinNetwork, SolanaNetwork } from "@/types";

export interface CoreConfigParams {
  solanaNetwork?: SolanaNetwork;
  solanaConnection?: Connection;
  bitcoinNetwork?: BitcoinNetwork;
}

export default class CoreConfig {
  public readonly solanaNetwork: SolanaNetwork;
  public readonly bitcoinNetwork: BitcoinNetwork;
  public readonly solanaConnection: Connection;
  public readonly accounts: AccountsConfig;

  constructor({
    bitcoinNetwork = BitcoinNetwork.Regtest,
    solanaNetwork = SolanaNetwork.Devnet,
    solanaConnection = getDefaultConnection(solanaNetwork),
  }: CoreConfigParams = {}) {
    this.bitcoinNetwork = bitcoinNetwork;
    this.solanaNetwork = solanaNetwork;
    this.solanaConnection = solanaConnection;
    this.accounts = new AccountsConfig({ coreConfig: this });
  }

  public async getTwoWayPegClient() {
    const { twoWayPegProgramId } = await this.accounts.zpl();
    return new TwoWayPegClient(
      this.solanaConnection,
      new PublicKey(twoWayPegProgramId)
    );
  }

  public async getLiquidityManagementClient() {
    const { liquidityManagementProgramId } = await this.accounts.zpl();
    return new LiquidityManagementClient(
      this.solanaConnection,
      new PublicKey(liquidityManagementProgramId)
    );
  }
}
