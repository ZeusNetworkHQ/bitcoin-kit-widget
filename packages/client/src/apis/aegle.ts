import axios, { type AxiosInstance } from "axios";
import z from "zod";

import { ClientRequestError } from "@/errors";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import { BitcoinNetwork, SolanaNetwork } from "@/types";
import { camelize } from "@/utils";

export default class AegleApi extends ZeusService {
  private readonly api: AxiosInstance;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.api = this.getInitializedApi();
  }

  // --- PUBLIC ---

  public async claimTestnetBitcoin(payload: { bitcoinAddress: string }) {
    return this.post(
      `api/v1/bitcoin-regtest-wallet/${payload.bitcoinAddress}/claim`,
      {},
      z.object({
        transactionId: z.string(),
      }),
    );
  }

  public async postCoboAddress(payload: {
    type: string;
    entityDerivedReserveAddressPda: string;
  }) {
    return this.post(
      "/api/v1/cobo-address",
      {
        type: payload.type,
        entityDerivedReserveAddressPda: payload.entityDerivedReserveAddressPda,
      },
      z.unknown(),
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
        return "https://api.apollobyzeus.app";

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

      throw new ClientRequestError(
        "Aegle",
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
      throw new ClientRequestError("Aegle", error as Error);
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
      throw new ClientRequestError("Aegle", error as Error);
    }
  }
}
