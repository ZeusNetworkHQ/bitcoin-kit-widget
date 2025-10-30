import axios, { type AxiosInstance } from "axios";
import z from "zod";

import { aresTransactionSchema, aresUtxoSchema } from "./ares.schema";

import { ClientRequestError } from "@/errors";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import { BitcoinNetwork, SolanaNetwork } from "@/types";
import { camelize } from "@/utils";

export type { AresUtxo, AresTransaction } from "./ares.schema";

export default class AresApi extends ZeusService {
  private readonly api: AxiosInstance;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.api = this.getInitializedApi();
  }

  // --- PUBLIC ---

  public async findManyUtxos(payload: { bitcoinAddress: string }) {
    return this.get(
      `api/v1/address/${payload.bitcoinAddress}/utxos`,
      {},
      z.array(aresUtxoSchema),
    );
  }

  public async broadcastTransaction(payload: { transactionHex: string }) {
    return this.post(
      "/api/v1/transaction/broadcast",
      payload.transactionHex,
      z.string(),
    );
  }

  public async getTransactionDetail(payload: { transactionId: string }) {
    return this.get(
      `/api/v1/transaction/${payload.transactionId}/detail`,
      {},
      aresTransactionSchema,
    );
  }

  // --- INTERNAL ---

  private getInitializedApi() {
    const { solanaNetwork, bitcoinNetwork } = this.core;

    const getBaseURL = () => {
      if (
        bitcoinNetwork === BitcoinNetwork.Mainnet &&
        solanaNetwork === SolanaNetwork.Mainnet
      )
        return "https://bitcoin-api-gateway.zeuslayer.io";

      if (
        bitcoinNetwork === BitcoinNetwork.Testnet &&
        solanaNetwork === SolanaNetwork.Devnet
      )
        return "https://bitcoin-api-gateway-testnet3-devnet.zeuslayer.space";

      if (
        bitcoinNetwork === BitcoinNetwork.Regtest &&
        solanaNetwork === SolanaNetwork.Devnet
      )
        return "https://bitcoin-api-gateway-regtest-devnet.zeuslayer.space";

      throw new ClientRequestError(
        "Ares",
        `Unsupported network configuration: Bitcoin "${bitcoinNetwork}" and Solana "${solanaNetwork}"`,
      );
    };

    return axios.create({
      baseURL: getBaseURL(),
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async get<T>(
    path: string,
    params: Record<string, unknown>,
    schema: z.ZodType<T>,
  ): Promise<T> {
    try {
      const response = await this.api.get<{ data: T }>(path, {
        params,
      });
      return z.preprocess(camelize, schema).parse(response.data.data);
    } catch (error) {
      throw new ClientRequestError("Ares", error as Error);
    }
  }

  private async post<T>(
    path: string,
    body: unknown,
    schema: z.ZodType<T>,
  ): Promise<T> {
    try {
      const response = await this.api.post<{ data: T }>(path, body);
      return z.preprocess(camelize, schema).parse(response.data.data);
    } catch (error) {
      throw new ClientRequestError("Ares", error as Error);
    }
  }
}
