import { PublicKey } from "@solana/web3.js";
import {
  buildDepositTransaction,
  type UTXO,
} from "@zeus-network/zpl-sdk/bitcoin";
import * as bitcoin from "bitcoinjs-lib";

import AresClient, { type AresUtxo } from "@/clients/ares";
import HermesClient from "@/clients/hermes";
import UnisatClient from "@/clients/unisat";
import CoreConfig from "@/config/core";
import InteractionModel from "@/models/interaction";
import UtxoModel from "@/models/utxo";
import { type BitcoinSigner } from "@/types";
import {
  btcToSatoshi,
  snakify,
  getInternalXOnlyPubkey,
  getP2trAddress,
  camelize,
} from "@/utils";

interface DepositParams {
  coreConfig?: CoreConfig;
  utxoModel?: UtxoModel;
  aresClient?: AresClient;
  unisatClient?: UnisatClient;
  hermesClient?: HermesClient;
  interactionModel?: InteractionModel;
}

export default class DepositProgram {
  private readonly core: CoreConfig;
  private readonly aresClient: AresClient;
  private readonly utxoModel: UtxoModel;
  private readonly interactionModel: InteractionModel;

  constructor({
    coreConfig = new CoreConfig(),
    aresClient = new AresClient({ coreConfig }),
    unisatClient = new UnisatClient({ coreConfig }),
    hermesClient = new HermesClient({ coreConfig }),
    utxoModel = new UtxoModel({ coreConfig, unisatClient, aresClient }),
    interactionModel = new InteractionModel({ coreConfig, hermesClient }),
  }: DepositParams) {
    this.core = coreConfig;
    this.utxoModel = utxoModel;
    this.aresClient = aresClient;
    this.interactionModel = interactionModel;
  }

  public async signAndBroadcastDeposit(
    bitcoinSigner: BitcoinSigner,
    payloads: {
      solanaPublicKey: string | PublicKey;
      bitcoinPublicKey: string;
      amount: number;
    }
  ) {
    try {
      const { bitcoinPublicKey, amount } = payloads;
      const solanaPublicKey = new PublicKey(payloads.solanaPublicKey);
      const bitcoinP2trAddress = getP2trAddress(bitcoinPublicKey, this.core);
      const twoWayPeg = await this.core.getTwoWayPegClient();

      const [reserveAddress, { minerFeeRate: feeRate }, utxos] =
        await Promise.all([
          this.getEntityDerivedReserveAddress(solanaPublicKey),
          twoWayPeg.accounts.getConfiguration(),
          this.utxoModel.findMany({
            bitcoinAddress: bitcoinP2trAddress,
            ordinal: false,
          }),
        ]);

      if (!utxos || utxos.length === 0)
        throw new Error("No UTXOs available for deposit");

      const userXOnlyPublicKey = getInternalXOnlyPubkey(bitcoinPublicKey);
      if (!userXOnlyPublicKey) throw new Error("User XOnly pubkey not found");

      const { psbt: depositPsbt, usedUTXOs } = buildDepositTransaction(
        snakify<UTXO[]>(utxos),
        reserveAddress,
        btcToSatoshi(amount).toNumber(),
        userXOnlyPublicKey,
        feeRate,
        bitcoin.networks[this.core.bitcoinNetwork]
      );

      const signedTx = await bitcoinSigner.signPsbt(depositPsbt);
      const transactionId = await this.aresClient.broadcastTransaction({
        transactionHex: signedTx,
      });

      await this.interactionModel.createDepositInteraction({
        transactionId,
        bitcoinAddress: bitcoinPublicKey,
        solanaAddress: solanaPublicKey.toBase58(),
        amount: btcToSatoshi(amount).toNumber(),
      });

      await this.utxoModel.blockUtxos(
        transactionId,
        camelize<AresUtxo[]>(usedUTXOs)
      );
    } catch (error) {
      throw new Error(`DepositProgram failed: ${error}`);
    }
  }

  public async getEntityDerivedReserveAddress(
    solanaPublicKey: string | PublicKey
  ) {
    const twoWayPeg = await this.core.getTwoWayPegClient();
    const edraAddresses =
      await twoWayPeg.accounts.getEntityDerivedReserveAddressesBySolanaPubkey(
        new PublicKey(solanaPublicKey)
      );

    if (!edraAddresses || edraAddresses.length === 0)
      throw new Error(
        "No EDRA addresses found for the provided Solana address"
      );

    const reserveAddress = bitcoin.payments.p2tr({
      pubkey: Buffer.from(edraAddresses[0].addressBytes),
      network: bitcoin.networks[this.core.bitcoinNetwork],
    })?.address;

    if (!reserveAddress) throw new Error("Reserve address not found");
    return reserveAddress;
  }
}
