import { PublicKey } from "@solana/web3.js";
import {
  buildDepositTransaction,
  type UTXO,
} from "@zeus-network/zeus-stack-sdk/bitcoin";
import { AddressType, getAddressInfo } from "bitcoin-address-validation";
import * as bitcoin from "bitcoinjs-lib";

import AresApi, { type AresUtxo } from "@/apis/ares";
import {
  DepositError,
  SupportWalletError,
  WalletConnectionError,
} from "@/errors";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import { EntityDerivedReserveAddressModel } from "@/models";
import InteractionModel from "@/models/interaction";
import UtxoModel from "@/models/utxo";
import ZplProgram from "@/programs/zpl";
import { type BitcoinSigner } from "@/types";
import {
  btcToSatoshi,
  snakify,
  getInternalXOnlyPubkey,
  camelize,
} from "@/utils";

export default class DepositService extends ZeusService {
  private readonly aresApi: AresApi;
  private readonly utxoModel: UtxoModel;
  private readonly edraModel: EntityDerivedReserveAddressModel;
  private readonly interactionModel: InteractionModel;
  private readonly zplProgram: ZplProgram;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.utxoModel = this.core.getOrInstall(UtxoModel);
    this.edraModel = this.core.getOrInstall(EntityDerivedReserveAddressModel);
    this.aresApi = this.core.getOrInstall(AresApi);
    this.interactionModel = this.core.getOrInstall(InteractionModel);
    this.zplProgram = this.core.getOrInstall(ZplProgram);
  }

  public async signAndBroadcastDeposit(
    bitcoinSigner: BitcoinSigner,
    payloads: {
      solanaPublicKey: string | PublicKey;
      amount: number;
    },
  ) {
    try {
      if (!bitcoinSigner.pubkey || !bitcoinSigner.address)
        throw new WalletConnectionError();

      if (getAddressInfo(bitcoinSigner.address).type !== AddressType.p2tr) {
        throw new SupportWalletError(
          "Only Taproot (P2TR) Bitcoin addresses are supported. Please use a compatible address and try again.",
        );
      }

      const { amount } = payloads;
      const solanaPublicKey = new PublicKey(payloads.solanaPublicKey);
      const twoWayPeg = await this.zplProgram.twoWayPegClient();

      const [reserveAddress, { minerFeeRate: feeRate }, utxos] =
        await Promise.all([
          this.getEntityDerivedReserveAddress(solanaPublicKey),
          twoWayPeg.accounts.getConfiguration(),
          this.utxoModel.findMany({
            bitcoinAddress: bitcoinSigner.address,
            ordinal: false,
          }),
        ]);

      if (!reserveAddress) throw new Error("Reserve address not found");

      if (!utxos || utxos.length === 0)
        throw new Error("No UTXOs available for deposit");

      const userXOnlyPublicKey = getInternalXOnlyPubkey(bitcoinSigner.pubkey);
      if (!userXOnlyPublicKey) throw new Error("User XOnly pubkey not found");

      const { psbt: depositPsbt, usedUTXOs } = buildDepositTransaction(
        snakify<UTXO[]>(utxos),
        reserveAddress,
        btcToSatoshi(amount).toNumber(),
        userXOnlyPublicKey,
        feeRate,
        bitcoin.networks[this.core.bitcoinNetwork],
      );

      const signedTx = await bitcoinSigner.signPsbt(depositPsbt);
      const transactionId = await this.aresApi.broadcastTransaction({
        transactionHex: signedTx,
      });

      await this.interactionModel.createDepositInteraction({
        transactionId,
        bitcoinAddress: bitcoinSigner.pubkey,
        solanaAddress: solanaPublicKey.toBase58(),
        amount: btcToSatoshi(amount).toNumber(),
      });

      await this.utxoModel.blockUtxos(
        transactionId,
        camelize<AresUtxo[]>(usedUTXOs),
      );
    } catch (error) {
      throw new DepositError(error as Error);
    }
  }

  private async getEntityDerivedReserveAddress(
    solanaPublicKey: string | PublicKey,
  ) {
    const edraList = await this.edraModel.findMany({
      solanaPublicKey: new PublicKey(solanaPublicKey),
    });

    if (edraList.length === 0) return null;
    return await this.edraModel.getP2trAddress(edraList[0]);
  }
}
