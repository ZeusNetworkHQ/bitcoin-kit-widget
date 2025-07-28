import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { BitcoinAddressType } from "@zeus-network/zpl-sdk/two-way-peg/types";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import EmissionSettingModel from "./emission-setting";
import ReserveSettingModel from "./reserve-setting";

import HermesClient from "@/clients/hermes";
import CoreConfig from "@/config/core";
import { type SolanaSigner } from "@/types";
import { assertsSolanaSigner, satoshiToBtc } from "@/utils";

dayjs.extend(utc);

const REMAINING_STORE_QUOTA_PERCENTAGE_THRESHOLD = 0.9;
const SAFETY_RATIO = 20000;

export default class EntityDerivedReserveAddressModel {
  private readonly core: CoreConfig;
  private readonly reserveSettingModel: ReserveSettingModel;
  private readonly emissionSettingModel: EmissionSettingModel;

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
    reserveSettingModel = new ReserveSettingModel({
      coreConfig,
      hermesClient,
    }),
    emissionSettingModel = new EmissionSettingModel({
      coreConfig,
      hermesClient,
    }),
  } = {}) {
    this.core = coreConfig;
    this.reserveSettingModel = reserveSettingModel;
    this.emissionSettingModel = emissionSettingModel;
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

    const twoWayPegReserveSettings = await this.reserveSettingModel.findMany();

    const emissionSettingModel = await this.emissionSettingModel.findMany();

    const reserveSettingsWithQuota = twoWayPegReserveSettings
      .map((reserveSetting) => {
        const zeusEscrowBalance = new BigNumber(
          emissionSettingModel.find(
            (emissionSetting) =>
              emissionSetting.guardianCertificate ===
              reserveSetting.guardianCertificate
          )?.escrowBalance ?? 0
        );

        const maxBtcQuota =
          satoshiToBtc(zeusEscrowBalance).dividedBy(SAFETY_RATIO);

        const totalBtcLocked = satoshiToBtc(reserveSetting.totalAmountLocked);

        const remainingBtcQuota = maxBtcQuota.minus(totalBtcLocked);

        return {
          address: reserveSetting.address,
          guardianCertificate: reserveSetting.guardianCertificate,
          remainingBtcQuota,
          remainingBtcQuotaPercentage: remainingBtcQuota.dividedBy(maxBtcQuota),
        };
      })
      .filter(({ remainingBtcQuotaPercentage }) =>
        remainingBtcQuotaPercentage.lt(
          REMAINING_STORE_QUOTA_PERCENTAGE_THRESHOLD
        )
      );

    if (reserveSettingsWithQuota.length === 0) {
      throw new Error("No suitable guardians found after quota filtering.");
    }

    const startDate = dayjs.utc("2025-03-28");
    const diffDays = dayjs.utc().diff(startDate, "day");
    const reserveIndex = diffDays % reserveSettingsWithQuota.length;
    const selectedReserveSetting = reserveSettingsWithQuota[reserveIndex];

    const edrList = await twoWayPegClient.accounts.getEntityDerivedReserves();
    const edr = edrList.find(
      (edr) => edr.reserveSetting.toBase58() === selectedReserveSetting.address
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
        new PublicKey(selectedReserveSetting.guardianCertificate),
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
