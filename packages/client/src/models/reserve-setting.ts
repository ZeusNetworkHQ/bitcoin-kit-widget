import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import dayjs from "dayjs";

import HermesApi, { type TwoWayPegReserveSetting } from "@/apis/hermes";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import ZplProgram from "@/programs/zpl";
import { SolanaNetwork } from "@/types";
import { btcToSatoshi } from "@/utils";

export default class ReserveSettingModel extends ZeusService {
  private readonly hermesApi: HermesApi;
  private readonly zplProgram: ZplProgram;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.hermesApi = this.core.getOrInstall(HermesApi);
    this.zplProgram = this.core.getOrInstall(ZplProgram);
  }

  async findMany() {
    const response = await this.hermesApi.getTwoWayPegReserveSettings();

    const twoWayPegReserveSetting = response.data.items;

    if (this.core.solanaNetwork !== SolanaNetwork.Mainnet) {
      return twoWayPegReserveSetting.filter(
        (setting) =>
          setting.address === "7hDRd3Y4X7U7BQ6ZPeLwVtjMY7hChdq1N6xdpv59QEdU", // Zeus Foundation Setting (Playground - TwoWayPeg ReserveSetting PDA)
      );
    }

    return twoWayPegReserveSetting.filter(
      (setting) =>
        ![
          "qfwSyZGUcoNLiEwBWy3xNdNdV6z4o7c5UySXsUngA94", // Solv Protocol (Production External)
          "E7qaFxt5evLDdRcu79kMXZXV1Peyt9q6kMwRV4BLyA9d", // Solv Protocol (Production Internal)
          "6ZHTBozu5Yr7E8zyF87XcyqkA932KaeDWwhL4NW4GzTe", // Solv Protocol (External Reserve - Production Internal-2)
        ].includes(setting.address),
    );
  }

  async getQuota(reserveSetting: TwoWayPegReserveSetting) {
    const liquidityManagementClient =
      await this.zplProgram.liquidityManagementClient();

    try {
      const totalSplTokenMinted = new BN(reserveSetting.totalAmountPegged);

      const vaultAta = getAssociatedTokenAddressSync(
        new PublicKey(reserveSetting.assetMint),
        liquidityManagementClient.pdas.deriveSplTokenVaultAuthorityAddress(
          new PublicKey(reserveSetting.address),
        ),
        true,
      );

      const tokenAccountData = await getAccount(
        this.core.solanaConnection,
        vaultAta,
      );
      let remainingStoreQuota = totalSplTokenMinted.sub(
        new BN(tokenAccountData.amount.toString()),
      );

      // [NOTE]: If guardian is zeus-foundation, subtract 80 btc from remainingStoreQuota because it has 80 btc in external reserve, and we can't withdraw from external reserve
      if (
        reserveSetting.address ===
        "B8eCvQSjAtDCXc59fWZo4aL6w9KfSKwr9KXkotSkDDSg"
      ) {
        remainingStoreQuota = remainingStoreQuota.sub(
          new BN(btcToSatoshi(80).toNumber()),
        );
      }

      const withdrawalWindow = new BN(
        reserveSetting.withdrawalWindow,
      ).toNumber();

      const windowStartedAt = new BN(
        reserveSetting.withdrawalWindowStartedAt,
      ).toNumber();

      const accumulatedWithdrawal = new BN(
        reserveSetting.accumulatedWithdrawalAmount,
      );
      const maxReserveWithdrawalQuota = new BN(
        reserveSetting.maxReserveWithdrawalQuota,
      );

      const windowEndTime = dayjs
        .unix(windowStartedAt)
        .add(withdrawalWindow, "seconds");

      return BN.min(
        remainingStoreQuota,
        dayjs().isBefore(windowEndTime)
          ? maxReserveWithdrawalQuota.sub(accumulatedWithdrawal)
          : maxReserveWithdrawalQuota,
      );
    } catch (error) {
      console.error(
        "[ReserveSetting Warning] Error getting token account data",
        error,
      );
      return new BN(0);
    }
  }
}
