import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { BitcoinAddressType } from "@zeus-network/zpl-sdk/two-way-peg/types";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import GuardianSettingModel from "./guardian-setting";

import HermesClient from "@/clients/hermes";
import CoreConfig from "@/config/core";
import { type SolanaSigner } from "@/types";
import { assertsSolanaSigner, satoshiToBtc } from "@/utils";

dayjs.extend(utc);

const REMAINING_STORE_QUOTA_PERCENTAGE_THRESHOLD = 0.9;
const SAFETY_RATIO = 20000;

export default class EntityDerivedReserveAddressModel {
  private readonly core: CoreConfig;
  private readonly guardianSettingModel: GuardianSettingModel;

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
    guardianSettingModel = new GuardianSettingModel({
      coreConfig,
      hermesClient,
    }),
  } = {}) {
    this.core = coreConfig;
    this.guardianSettingModel = guardianSettingModel;
  }

  public async findMany(payload: { solanaPublicKey: PublicKey }) {
    try {
      const twoWayPegClient = await this.core.getTwoWayPegClient();
      return await twoWayPegClient.accounts.getEntityDerivedReserveAddressesBySolanaPubkey(
        payload.solanaPublicKey
      );
    } catch {
      return [];
    }
  }

  public async create(signer: SolanaSigner) {
    assertsSolanaSigner(signer);

    const twoWayPegClient = await this.core.getTwoWayPegClient();

    const twoWayPegGuardianSettings =
      await this.guardianSettingModel.twoWayPeg.findMany();

    const delegatorGuardianSettings =
      await this.guardianSettingModel.delegator.findMany();

    const twoWayPegGuardiansWithQuota = twoWayPegGuardianSettings
      .map((twoWayPegGuardianSetting) => {
        const zeusEscrowBalance = new BigNumber(
          delegatorGuardianSettings.find(
            (delegatorGuardianSetting) =>
              delegatorGuardianSetting.guardianCertificate ===
              twoWayPegGuardianSetting.guardianCertificate
          )?.escrowBalance ?? 0
        );

        const maxBtcQuota =
          satoshiToBtc(zeusEscrowBalance).dividedBy(SAFETY_RATIO);

        const totalBtcLocked = satoshiToBtc(
          twoWayPegGuardianSetting.totalAmountLocked
        );

        const remainingBtcQuota = maxBtcQuota.minus(totalBtcLocked);

        return {
          address: twoWayPegGuardianSetting.address,
          guardianCertificate: twoWayPegGuardianSetting.guardianCertificate,
          remainingBtcQuota,
          remainingBtcQuotaPercentage: remainingBtcQuota.dividedBy(maxBtcQuota),
        };
      })
      .filter(({ remainingBtcQuotaPercentage }) =>
        remainingBtcQuotaPercentage.lt(
          REMAINING_STORE_QUOTA_PERCENTAGE_THRESHOLD
        )
      );

    if (twoWayPegGuardiansWithQuota.length === 0) {
      throw new Error("No suitable guardians found after quota filtering.");
    }

    const startDate = dayjs.utc("2025-03-28");
    const diffDays = dayjs.utc().diff(startDate, "day");
    const guardianIndex = diffDays % twoWayPegGuardiansWithQuota.length;
    const selectedGuardian = twoWayPegGuardiansWithQuota[guardianIndex];

    const edrList = await twoWayPegClient.accounts.getEntityDerivedReserves();
    const edr = edrList.find(
      (edr) => edr.reserveSetting.toBase58() === selectedGuardian.address
    );

    if (!edr)
      throw new Error(
        "Entity Derived Reserve not found for the selected guardian setting"
      );

    const twoWayPegConfiguration =
      await twoWayPegClient.accounts.getConfiguration();

    const ix =
      twoWayPegClient.instructions.buildCreateEntityDerivedReserveAddressIx(
        signer.publicKey,
        edr.reserveSetting,
        new PublicKey(selectedGuardian.guardianCertificate),
        twoWayPegConfiguration.layerFeeCollector,
        edr.publicKey,
        BitcoinAddressType.P2tr
      );

    const { blockhash } = await this.core.solanaConnection.getLatestBlockhash();

    const msg = new TransactionMessage({
      payerKey: signer.publicKey,
      recentBlockhash: blockhash,
      instructions: [ix],
    }).compileToV0Message([]);

    const tx = new VersionedTransaction(msg);

    const signedTx = await signer.signTransaction(tx);

    const signature = await this.core.solanaConnection.sendRawTransaction(
      signedTx.serialize(),
      { preflightCommitment: "confirmed" }
    );

    return { signature };
  }
}
