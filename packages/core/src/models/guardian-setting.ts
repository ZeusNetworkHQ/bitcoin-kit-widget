import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

import HermesClient, { type TwoWayPegGuardianSetting } from "@/clients/hermes";
import CoreConfig from "@/config/core";
import { SolanaNetwork } from "@/types";

interface GuardianSettingModelParams {
  coreConfig?: CoreConfig;
  hermesClient?: HermesClient;
}

export default class GuardianSettingModel {
  private readonly core: CoreConfig;
  private readonly hermesClient: HermesClient;

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
  }: GuardianSettingModelParams) {
    this.core = coreConfig;
    this.hermesClient = hermesClient;
  }

  public twoWayPeg = {
    findMany: async () => {
      const response = await this.hermesClient.getTwoWayPegGuardianSettings();

      const twoWayPegGuardianSettings = response.data.items;

      if (this.core.solanaNetwork !== SolanaNetwork.Mainnet) {
        return twoWayPegGuardianSettings.filter(
          (setting) =>
            setting.address === "7hDRd3Y4X7U7BQ6ZPeLwVtjMY7hChdq1N6xdpv59QEdU" // Zeus Foundation Setting (Playground - TwoWayPeg ReserveSetting PDA)
        );
      }

      return twoWayPegGuardianSettings.filter(
        (setting) =>
          ![
            "qfwSyZGUcoNLiEwBWy3xNdNdV6z4o7c5UySXsUngA94", // Solv Protocol (Production External)
            "E7qaFxt5evLDdRcu79kMXZXV1Peyt9q6kMwRV4BLyA9d", // Solv Protocol (Production Internal)
            "6ZHTBozu5Yr7E8zyF87XcyqkA932KaeDWwhL4NW4GzTe", // Solv Protocol (External Reserve - Production Internal-2)
          ].includes(setting.address)
      );
    },

    getQuota: async (guardianSetting: TwoWayPegGuardianSetting) => {
      const liquidityManagementClient =
        await this.core.getLiquidityManagementClient();

      try {
        const totalSplTokenMinted = new BN(guardianSetting.totalAmountPegged);

        const vaultAta = getAssociatedTokenAddressSync(
          new PublicKey(guardianSetting.assetMint),
          liquidityManagementClient.pdas.deriveSplTokenVaultAuthorityAddress(
            new PublicKey(guardianSetting.address)
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
          "[Guardian Warning] Error getting token account data",
          error
        );
        return new BN(0);
      }
    },
  };

  public delegator = {
    findMany: async () => {
      const response = await this.hermesClient.getDelegatorGuardianSettings();
      return response.data.items;
    },
  };
}
