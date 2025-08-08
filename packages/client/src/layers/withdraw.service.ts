import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { getAddressInfo } from "bitcoin-address-validation";
import BN from "bn.js";

import type BigNumber from "bignumber.js";

import { type TwoWayPegReserveSetting } from "@/apis/hermes";
import { WITHDRAW_INFRASTRUCTURE_FEE_SOL } from "@/constants";
import { WithdrawError } from "@/errors";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import ReserveSettingModel from "@/models/reserve-setting";
import ZplApi from "@/programs/zpl";
import { type SolanaSigner } from "@/types";
import {
  addressTypeToBitcoinAddressType,
  btcToSatoshi,
  bitcoinAddressToBytes,
  lamportsToSol,
} from "@/utils";
import { assertsSolanaSigner } from "@/utils";

export default class WithdrawService extends ZeusService {
  private readonly reserveSettingModel: ReserveSettingModel;
  private readonly zplApi: ZplApi;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.reserveSettingModel = this.core.getOrInstall(ReserveSettingModel);
    this.zplApi = this.core.getOrInstall(ZplApi);
  }

  public async signWithdraw(
    solanaSigner: SolanaSigner,
    payloads: {
      bitcoinAddress: string;
      amount: number | bigint | BigNumber;
    },
  ) {
    try {
      assertsSolanaSigner(solanaSigner);

      const solBalance = lamportsToSol(
        await this.core.solanaConnection.getBalance(solanaSigner.publicKey),
      );

      if (solBalance.lt(WITHDRAW_INFRASTRUCTURE_FEE_SOL)) {
        throw new Error(
          `Insufficient SOL balance. Required: ${WITHDRAW_INFRASTRUCTURE_FEE_SOL} SOL, Available: ${solBalance} SOL`,
        );
      }

      const amountBN = new BN(btcToSatoshi(payloads.amount).toString());
      const reserveSettings = await this.reserveSettingModel.findMany();

      const reserveSettingsWithQuota = await Promise.all(
        reserveSettings.map(async (reserveSetting) => {
          const remainingQuota =
            await this.reserveSettingModel.getQuota(reserveSetting);

          return { ...reserveSetting, remainingQuota };
        }),
      );

      reserveSettingsWithQuota.sort((a, b) =>
        b.remainingQuota.cmp(a.remainingQuota),
      ); // Sort by remaining quota in descending order

      let remainingAmount = amountBN.clone();
      const ixs: TransactionInstruction[] = [];

      for (const reserveSetting of reserveSettingsWithQuota) {
        const amountToWithdraw = BN.min(
          reserveSetting.remainingQuota,
          remainingAmount,
        );

        ixs.push(
          ...(await this.createWithdrawInstructions(solanaSigner, {
            bitcoinAddress: payloads.bitcoinAddress,
            reserveSetting,
            amountToWithdraw,
          })),
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
        { preflightCommitment: "confirmed" },
      );

      return { signature };
    } catch (error) {
      throw new WithdrawError(error as Error);
    }
  }

  // --- PRIVATES ---

  private async createWithdrawInstructions(
    solanaSigner: Required<SolanaSigner>,
    payloads: {
      bitcoinAddress: string;
      reserveSetting: TwoWayPegReserveSetting;
      amountToWithdraw: BN;
    },
  ) {
    assertsSolanaSigner(solanaSigner);
    const { bitcoinAddress, reserveSetting, amountToWithdraw } = payloads;

    const bitcoinAddressInfo = getAddressInfo(bitcoinAddress);
    const receiverBitcoinAddressBytes = bitcoinAddressToBytes(
      bitcoinAddress,
      bitcoinAddressInfo.type,
    );

    const { assetMint } = await this.zplApi.reserveSetting();
    const { liquidityManagementProgramId } = await this.zplApi.accounts();

    const twoWayPegClient = await this.zplApi.twoWayPegClient();
    const liquidityManagementClient =
      await this.zplApi.liquidityManagementClient();

    const twoWayPegConfiguration =
      await twoWayPegClient.accounts.getConfiguration();

    const vaultAta = liquidityManagementClient.pdas.deriveVaultSettingAddress(
      new PublicKey(reserveSetting.address),
    );

    const storeIx = liquidityManagementClient.instructions.buildStoreIx(
      amountToWithdraw,
      solanaSigner.publicKey,
      new PublicKey(assetMint),
      new PublicKey(reserveSetting.address),
    );

    const withdrawalRequestIx =
      twoWayPegClient.instructions.buildAddWithdrawalRequestWithAddressTypeIx(
        amountToWithdraw,
        new BN(Date.now() / 1000),
        receiverBitcoinAddressBytes,
        addressTypeToBitcoinAddressType(bitcoinAddressInfo.type),
        solanaSigner.publicKey,
        twoWayPegConfiguration.layerFeeCollector,
        new PublicKey(reserveSetting.address),
        new PublicKey(liquidityManagementProgramId),
        liquidityManagementClient.pdas.deriveConfigurationAddress(),
        vaultAta,
        liquidityManagementClient.pdas.derivePositionAddress(
          vaultAta,
          solanaSigner.publicKey,
        ),
      );

    return [storeIx, withdrawalRequestIx];
  }
}
