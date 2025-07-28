import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

import HermesClient, { type TwoWayPegReserveSetting } from "@/clients/hermes";
import CoreConfig from "@/config/core";
import { SolanaNetwork } from "@/types";

interface ReserveSettingModelParams {
  coreConfig?: CoreConfig;
  hermesClient?: HermesClient;
}

export default class ReserveSettingModel {
  private readonly core: CoreConfig;
  private readonly hermesClient: HermesClient;

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
  }: ReserveSettingModelParams) {
    this.core = coreConfig;
    this.hermesClient = hermesClient;
  }

  async findMany() {
    const response = await this.hermesClient.getTwoWayPegReserveSettings();

    const twoWayPegReserveSetting = response.data.items;

    if (this.core.solanaNetwork !== SolanaNetwork.Mainnet) {
      return twoWayPegReserveSetting.filter(
        (setting) =>
          setting.address === "7hDRd3Y4X7U7BQ6ZPeLwVtjMY7hChdq1N6xdpv59QEdU" // Zeus Foundation Setting (Playground - TwoWayPeg ReserveSetting PDA)
      );
    }

    return twoWayPegReserveSetting.filter(
      (setting) =>
        ![
          "qfwSyZGUcoNLiEwBWy3xNdNdV6z4o7c5UySXsUngA94", // Solv Protocol (Production External)
          "E7qaFxt5evLDdRcu79kMXZXV1Peyt9q6kMwRV4BLyA9d", // Solv Protocol (Production Internal)
          "6ZHTBozu5Yr7E8zyF87XcyqkA932KaeDWwhL4NW4GzTe", // Solv Protocol (External Reserve - Production Internal-2)
        ].includes(setting.address)
    );
  }

  async getQuota(reserveSetting: TwoWayPegReserveSetting) {
    const liquidityManagementClient =
      await this.core.getLiquidityManagementClient();

    try {
      const totalSplTokenMinted = new BN(reserveSetting.totalAmountPegged);

      const vaultAta = getAssociatedTokenAddressSync(
        new PublicKey(reserveSetting.assetMint),
        liquidityManagementClient.pdas.deriveSplTokenVaultAuthorityAddress(
          new PublicKey(reserveSetting.address)
        ),
        true
      );

      const tokenAccountData = await getAccount(
        this.core.solanaConnection,
        vaultAta
      );
      return totalSplTokenMinted.sub(
        new BN(tokenAccountData.amount.toString())
      );
    } catch (error) {
      console.error(
        "[ReserveSetting Warning] Error getting token account data",
        error
      );
      return new BN(0);
    }
  }
}
