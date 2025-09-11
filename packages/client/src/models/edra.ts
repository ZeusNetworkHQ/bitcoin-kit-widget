import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  BitcoinAddressType,
  type EntityDerivedReserve,
  type EntityDerivedReserveAddress,
  type HotReserveBucket,
} from "@zeus-network/zeus-stack-sdk/two-way-peg/types";
import BigNumber from "bignumber.js";
import * as bitcoin from "bitcoinjs-lib";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import EmissionSettingModel from "./emission-setting";
import HotReserveBucketModel from "./hot-reserve-bucket";
import ReserveSettingModel from "./reserve-setting";

import { AegleApi } from "@/apis";
import { EDRA_CREATE_FEE_SOL } from "@/constants";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import ZplProgram from "@/programs/zpl";
import { type SolanaSigner } from "@/types";
import { assertsSolanaSigner, lamportsToSol, satoshiToBtc } from "@/utils";

dayjs.extend(utc);

const REMAINING_STORE_QUOTA_PERCENTAGE_THRESHOLD = 0.9;
const SAFETY_RATIO = 20000;

export type { EntityDerivedReserveAddress };

export default class EntityDerivedReserveAddressModel extends ZeusService {
  private readonly reserveSettingModel: ReserveSettingModel;
  private readonly emissionSettingModel: EmissionSettingModel;
  private readonly hrbModel: HotReserveBucketModel;
  private readonly zplProgram: ZplProgram;
  private readonly aegleApi: AegleApi;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.zplProgram = this.core.getOrInstall(ZplProgram);
    this.reserveSettingModel = this.core.getOrInstall(ReserveSettingModel);
    this.emissionSettingModel = this.core.getOrInstall(EmissionSettingModel);
    this.hrbModel = this.core.getOrInstall(HotReserveBucketModel);
    this.aegleApi = this.core.getOrInstall(AegleApi);
  }

  public async findMany(payload: { solanaPublicKey: PublicKey }) {
    try {
      const twoWayPegClient = await this.zplProgram.twoWayPegClient();
      return await twoWayPegClient.accounts.getEntityDerivedReserveAddressesBySolanaPubkey(
        payload.solanaPublicKey,
      );
    } catch {
      return [];
    }
  }

  public async create(signer: SolanaSigner) {
    assertsSolanaSigner(signer);

    // [NOTE] v1 to v2 migration:
    // If the user has a Hot Reserve Bucket, we migrate it to an Entity Derived Reserve Address
    const hrbList = await this.hrbModel.findMany({
      solanaPublicKey: signer.publicKey,
    });
    if (hrbList.length > 0) {
      const hrb = hrbList[0];
      await this.migrateFromHotReserveBucket(signer, { hotReserveBucket: hrb });
      return;
    }

    const twoWayPegClient = await this.zplProgram.twoWayPegClient();
    const twoWayPegReserveSettings = await this.reserveSettingModel.findMany();
    const emissionSettingModel = await this.emissionSettingModel.findMany();

    const solBalance = lamportsToSol(
      await this.core.solanaConnection.getBalance(signer.publicKey),
    );

    if (solBalance.lt(EDRA_CREATE_FEE_SOL)) {
      throw new Error(
        `Insufficient SOL balance. Required: ${EDRA_CREATE_FEE_SOL} SOL, Available: ${solBalance} SOL`,
      );
    }

    const reserveSettingsWithQuota = twoWayPegReserveSettings
      .map((reserveSetting) => {
        const zeusEscrowBalance = new BigNumber(
          emissionSettingModel.find(
            (emissionSetting) =>
              emissionSetting.guardianCertificate ===
              reserveSetting.guardianCertificate,
          )?.escrowBalance ?? 0,
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
          REMAINING_STORE_QUOTA_PERCENTAGE_THRESHOLD,
        ),
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
      (edr) => edr.reserveSetting.toBase58() === selectedReserveSetting.address,
    );

    if (!edr)
      throw new Error(
        "Entity Derived Reserve not found for the selected guardian setting",
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
        BitcoinAddressType.P2tr,
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
      { preflightCommitment: "confirmed" },
    );

    await this.announceCreation({ solanaPublicKey: signer.publicKey, edr });
    return { signature };
  }

  public async getP2trAddress(edra: EntityDerivedReserveAddress) {
    const reserveAddress = bitcoin.payments.p2tr({
      pubkey: Buffer.from(edra.addressBytes),
      network: bitcoin.networks[this.core.bitcoinNetwork],
    })?.address;

    return reserveAddress || null;
  }

  // --- INTERNAL ---

  private async migrateFromHotReserveBucket(
    signer: SolanaSigner,
    payload: {
      hotReserveBucket: HotReserveBucket;
    },
  ) {
    assertsSolanaSigner(signer);
    const { hotReserveBucket } = payload;
    const twoWayPegClient = await this.zplProgram.twoWayPegClient();
    const edrList = await twoWayPegClient.accounts.getEntityDerivedReserves();

    const edr = edrList.find(
      ({ reserveSetting }) =>
        reserveSetting.toBase58() ===
        hotReserveBucket.reserveSetting.toBase58(),
    );

    if (!edr)
      throw Error(
        "Entity Derived Reserve not found for the selected reserve setting",
      );

    const ix =
      twoWayPegClient.instructions.buildMigrateHotReserveBucketToEntityDerivedReserveAddressIx(
        signer.publicKey,
        hotReserveBucket.publicKey,
        edr.publicKey,
      );

    const { blockhash } = await this.core.solanaConnection.getLatestBlockhash();

    const msg = new TransactionMessage({
      payerKey: signer.publicKey,
      recentBlockhash: blockhash,
      instructions: [ix],
    }).compileToV0Message();

    const tx = new VersionedTransaction(msg);

    const signedTx = await signer.signTransaction(tx);

    const signature = await this.core.solanaConnection.sendRawTransaction(
      signedTx.serialize(),
      { preflightCommitment: "confirmed" },
    );

    await this.announceCreation({ solanaPublicKey: signer.publicKey, edr });
    return { signature };
  }

  private async announceCreation(payload: {
    solanaPublicKey: PublicKey;
    edr: EntityDerivedReserve;
  }) {
    const twoWayPegClient = await this.zplProgram.twoWayPegClient();
    const entityDerivedReserveAddressPda = twoWayPegClient.pdas
      .deriveEntityDerivedReserveAddress(
        payload.solanaPublicKey,
        payload.edr.publicKey,
        BitcoinAddressType.P2tr,
      )
      .toBase58();

    await this.aegleApi.postCoboAddress({
      type: "entityDerivedReserveAddress",
      entityDerivedReserveAddressPda,
    });
  }
}
