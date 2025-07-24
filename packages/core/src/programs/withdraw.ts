import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import BN from "bn.js";

import type BigNumber from "bignumber.js";

import HermesClient, { type TwoWayPegGuardianSetting } from "@/clients/hermes";
import CoreConfig from "@/config/core";
import GuardianSettingModel from "@/models/guardian-setting";
import { type SolanaSigner } from "@/types";
import { btcToSatoshi, getReceiverXOnlyPubkey } from "@/utils";
import { assertsSolanaSigner } from "@/utils";

interface WithdrawProgramParams {
  coreConfig?: CoreConfig;
  hermesClient?: HermesClient;
  guardianSettingModel?: GuardianSettingModel;
}

export default class WithdrawProgram {
  private readonly core: CoreConfig;
  private readonly guardianSettingModel: GuardianSettingModel;

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
    guardianSettingModel = new GuardianSettingModel({
      coreConfig,
      hermesClient,
    }),
  }: WithdrawProgramParams = {}) {
    this.core = coreConfig;
    this.guardianSettingModel = guardianSettingModel;
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
      const guardianSettings =
        await this.guardianSettingModel.twoWayPeg.findMany();

      const guardianSettingsWithQuota = await Promise.all(
        guardianSettings.map(async (guardianSetting) => {
          const remainingQuota =
            await this.guardianSettingModel.twoWayPeg.getQuota(guardianSetting);

          return { ...guardianSetting, remainingQuota };
        })
      );

      const xonlyReceiverPubkey = getReceiverXOnlyPubkey(
        payloads.bitcoinAddress
      );

      guardianSettingsWithQuota.sort((a, b) =>
        b.remainingQuota.cmp(a.remainingQuota)
      ); // Sort by remaining quota in descending order

      let remainingAmount = amountBN.clone();
      const ixs: TransactionInstruction[] = [];

      for (const guardian of guardianSettingsWithQuota) {
        const amountToWithdraw = BN.min(
          guardian.remainingQuota,
          remainingAmount
        );

        ixs.push(
          ...(await this.createWithdrawInstructions(solanaSigner, {
            xonlyReceiverPubkey,
            guardian,
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
      guardian: TwoWayPegGuardianSetting;
      amountToWithdraw: BN;
    }
  ) {
    assertsSolanaSigner(solanaSigner);
    const { xonlyReceiverPubkey, guardian, amountToWithdraw } = payloads;

    const { assetMint } = await this.core.accounts.guardian();
    const { liquidityManagementProgramId } = await this.core.accounts.zpl();

    const twoWayPegClient = await this.core.getTwoWayPegClient();
    const liquidityManagementClient =
      await this.core.getLiquidityManagementClient();

    const twoWayPegConfiguration =
      await twoWayPegClient.accounts.getConfiguration();

    const vaultAta = liquidityManagementClient.pdas.deriveVaultSettingAddress(
      new PublicKey(guardian.address)
    );

    const storeIx = liquidityManagementClient.instructions.buildStoreIx(
      amountToWithdraw,
      solanaSigner.publicKey,
      new PublicKey(assetMint),
      new PublicKey(guardian.address)
    );

    const withdrawalRequestIx =
      twoWayPegClient.instructions.buildAddWithdrawalRequestIx(
        amountToWithdraw,
        new BN(Date.now() / 1000),
        xonlyReceiverPubkey,
        solanaSigner.publicKey,
        twoWayPegConfiguration.layerFeeCollector,
        new PublicKey(guardian.address),
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
