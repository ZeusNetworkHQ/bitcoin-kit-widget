import axios, { type AxiosInstance } from "axios";
import z from "zod";

import CoreConfig from "@/config/core";
import { BitcoinNetwork, SolanaNetwork } from "@/types";
import { camelize } from "@/utils";

interface AegleClientParams {
  coreConfig?: CoreConfig;
}

export default class AegleClient {
  private readonly core: CoreConfig;
  private readonly api: AxiosInstance;

  constructor({ coreConfig = new CoreConfig() }: AegleClientParams = {}) {
    this.core = coreConfig;
    this.api = this.getInitializedApi();
  }

  // --- PUBLIC ---

  public async claimTestnetBitcoin(payload: { bitcoinP2trAddress: string }) {
    return this.post(
      `api/v1/bitcoin-regtest-wallet/${payload.bitcoinP2trAddress}/claim`,
      {},
      z.object({
        transactionId: z.string(),
      })
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
        return "https://api-internal.apollobyzeus.app";

      if (
        bitcoinNetwork === BitcoinNetwork.Testnet &&
        solanaNetwork === SolanaNetwork.Devnet
      )
        return "https://api-testnet3-devnet.apollobyzeus.space";

      if (
        bitcoinNetwork === BitcoinNetwork.Regtest &&
        solanaNetwork === SolanaNetwork.Devnet
      )
        return "https://api-regtest-devnet.apollobyzeus.space";

      throw new Error(
        `[AegleClient Error]: Unsupported network configuration: Bitcoin "${bitcoinNetwork}" and Solana "${solanaNetwork}"`
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
    schema: z.ZodType<T>
  ): Promise<T> {
    try {
      const response = await this.api.get<{ data: T }>(path, {
        params,
      });
      return z.preprocess(camelize, schema).parse(response.data.data);
    } catch (error) {
      throw new Error(`[AegleClient Error]: ${error}`);
    }
  }

  private async post<T>(
    path: string,
    body: unknown,
    schema: z.ZodType<T>
  ): Promise<T> {
    try {
      const response = await this.api.post<{ data: T }>(path, body);
      return z.preprocess(camelize, schema).parse(response.data.data);
    } catch (error) {
      throw new Error(`[AegleClient Error]: ${error}`);
    }
  }
}
