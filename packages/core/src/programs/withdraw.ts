import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import BN from "bn.js";

import type BigNumber from "bignumber.js";

import HermesClient, { type TwoWayPegReserveSetting } from "@/clients/hermes";
import CoreConfig from "@/config/core";
import ReserveSettingModel from "@/models/reserve-setting";
import { type SolanaSigner } from "@/types";
import { btcToSatoshi, getReceiverXOnlyPubkey } from "@/utils";
import { assertsSolanaSigner } from "@/utils";

interface WithdrawProgramParams {
  coreConfig?: CoreConfig;
  hermesClient?: HermesClient;
  reserveSettingModel?: ReserveSettingModel;
}

export default class WithdrawProgram {
  private readonly core: CoreConfig;
  private readonly reserveSettingModel: ReserveSettingModel;

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
    reserveSettingModel = new ReserveSettingModel({
      coreConfig,
      hermesClient,
    }),
  }: WithdrawProgramParams = {}) {
    this.core = coreConfig;
    this.reserveSettingModel = reserveSettingModel;
  }

  public async signWithdraw(
    solanaSigner: SolanaSigner,
    payloads: {
      bitcoinAddress: string;
      amount: number | bigint | BigNumber;
    }
  ) {
    try {
      assertsSolanaSigner(solanaSigner);
      const amountBN = new BN(btcToSatoshi(payloads.amount).toString());
      const reserveSettings = await this.reserveSettingModel.findMany();

      const reserveSettingsWithQuota = await Promise.all(
        reserveSettings.map(async (reserveSetting) => {
          const remainingQuota = await this.reserveSettingModel.getQuota(
            reserveSetting
          );

          return { ...reserveSetting, remainingQuota };
        })
      );

      const xonlyReceiverPubkey = getReceiverXOnlyPubkey(
        payloads.bitcoinAddress
      );

      reserveSettingsWithQuota.sort((a, b) =>
        b.remainingQuota.cmp(a.remainingQuota)
      ); // Sort by remaining quota in descending order

      let remainingAmount = amountBN.clone();
      const ixs: TransactionInstruction[] = [];

      for (const reserveSetting of reserveSettingsWithQuota) {
        const amountToWithdraw = BN.min(
          reserveSetting.remainingQuota,
          remainingAmount
        );

        ixs.push(
          ...(await this.createWithdrawInstructions(solanaSigner, {
            xonlyReceiverPubkey,
            reserveSetting,
            amountToWithdraw,
          }))
        );
        remainingAmount = remainingAmount.sub(amountToWithdraw);

        if (remainingAmount.eq(new BN(0))) break;
      }

      const { blockhash } =
        await this.core.solanaConnection.getLatestBlockhash();

      const msg = new TransactionMessage({
        payerKey: solanaSigner.publicKey,
        recentBlockhash: blockhash,
        instructions: ixs,
      }).compileToV0Message([]);

      const tx = new VersionedTransaction(msg);

      const signedTx = await solanaSigner.signTransaction(tx);

      const signature = await this.core.solanaConnection.sendRawTransaction(
        signedTx.serialize(),
        { preflightCommitment: "confirmed" }
      );

      return { signature };
    } catch (error) {
      throw new Error(`Withdraw failed: ${error}`);
    }
  }

  // --- PRIVATES ---

  private async createWithdrawInstructions(
    solanaSigner: Required<SolanaSigner>,
    payloads: {
      xonlyReceiverPubkey: Buffer;
      reserveSetting: TwoWayPegReserveSetting;
      amountToWithdraw: BN;
    }
  ) {
    assertsSolanaSigner(solanaSigner);
    const { xonlyReceiverPubkey, reserveSetting, amountToWithdraw } = payloads;

    const { assetMint } = await this.core.accounts.reserveSetting();
    const { liquidityManagementProgramId } = await this.core.accounts.zpl();

    const twoWayPegClient = await this.core.getTwoWayPegClient();
    const liquidityManagementClient =
      await this.core.getLiquidityManagementClient();

    const twoWayPegConfiguration =
      await twoWayPegClient.accounts.getConfiguration();

    const vaultAta = liquidityManagementClient.pdas.deriveVaultSettingAddress(
      new PublicKey(reserveSetting.address)
    );

    const storeIx = liquidityManagementClient.instructions.buildStoreIx(
      amountToWithdraw,
      solanaSigner.publicKey,
      new PublicKey(assetMint),
      new PublicKey(reserveSetting.address)
    );

    const withdrawalRequestIx =
      twoWayPegClient.instructions.buildAddWithdrawalRequestIx(
        amountToWithdraw,
        new BN(Date.now() / 1000),
        xonlyReceiverPubkey,
        solanaSigner.publicKey,
        twoWayPegConfiguration.layerFeeCollector,
        new PublicKey(reserveSetting.address),
        new PublicKey(liquidityManagementProgramId),
        liquidityManagementClient.pdas.deriveConfigurationAddress(),
        vaultAta,
        liquidityManagementClient.pdas.derivePositionAddress(
          vaultAta,
          solanaSigner.publicKey
        )
      );

    return [storeIx, withdrawalRequestIx];
  }
}
