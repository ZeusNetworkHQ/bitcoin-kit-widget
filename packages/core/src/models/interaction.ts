import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";
import { BN } from "bn.js";
import { differenceWith } from "lodash";

import HermesClient, { type Interaction } from "@/clients/hermes";
import CoreConfig from "@/config/core";
import { DEPOSIT_SERVICE_FEE_BTC } from "@/constants";
import Cache from "@/lib/cache";
import { Chain, InteractionStatus, InteractionType } from "@/types";
import { btcToSatoshi } from "@/utils";

export default class InteractionModel {
  private readonly core: CoreConfig;
  private readonly hermesClient: HermesClient;
  public readonly cache = new Cache<Record<string, Interaction[]>>(
    "zeus:interactions",
  );

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
  } = {}) {
    this.core = coreConfig;
    this.hermesClient = hermesClient;
  }

  public async findMany(payload: { size: number; solanaAddress: string }) {
    const { items: interactions } =
      await this.hermesClient.findManyInteractions(payload);

    const cachedInteractions = this.cache.get(payload.solanaAddress, []);
    const initialInteractions = differenceWith(
      cachedInteractions,
      interactions,
      (a, b) => a.interactionId === b.interactionId,
    );

    if (cachedInteractions.length !== initialInteractions.length) {
      this.cache.set(
        payload.solanaAddress,
        initialInteractions.length ? initialInteractions : undefined,
      );
    }

    return [...initialInteractions, ...interactions]
      .sort((a, b) => b.initiatedAt - a.initiatedAt)
      .slice(0, payload.size);
  }

  /**
   * Creates a new interaction in the cache as placeholder for a deposit interaction.
   * The cache will be replaced with the actual interaction once the deposit is ready on hermes.
   */
  public async createDepositInteraction(data: {
    transactionId: string;
    solanaAddress: string;
    bitcoinAddress: string;
    amount: number;
  }) {
    const createdAt = Math.floor(Date.now() / 1000);
    const twoWayPegClient = await this.core.getTwoWayPegClient();

    const interactionId = twoWayPegClient.pdas
      .deriveInteraction(Buffer.from(data.transactionId, "hex"), new BN(0))
      .toBase58();

    const interaction: Interaction = {
      interactionId: interactionId,
      destination: data.solanaAddress,
      amount: data.amount.toString(),
      source: toXOnly(Buffer.from(data.bitcoinAddress, "hex")).toString("hex"),
      steps: [
        {
          chain: Chain.Bitcoin,
          action: "DepositToEntityDerivedReserve",
          transaction: data.transactionId,
          timestamp: createdAt,
        },
      ],
      initiatedAt: createdAt,
      currentStepAt: createdAt,
      status: InteractionStatus.BitcoinDepositToHotReserve,
      interactionType: InteractionType.Deposit,
      appDeveloper: "ZeusStack",
      minerFee: "0",
      serviceFee: btcToSatoshi(DEPOSIT_SERVICE_FEE_BTC).toString(),
      swapInfo: null,
    };

    const cachedInteractions = this.cache.get(data.solanaAddress, []);
    this.cache.set(data.solanaAddress, [interaction, ...cachedInteractions]);
  }
}
