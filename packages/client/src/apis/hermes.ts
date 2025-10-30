import axios, { type AxiosInstance } from "axios";
import z from "zod";

import {
  emissionSettingSchema,
  interactionSchema,
  twoWayPegReserveSettingSchema,
} from "./hermes.schema";

import { ClientRequestError } from "@/errors";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import { BitcoinNetwork, SolanaNetwork } from "@/types";
import { camelize, snakify } from "@/utils";

export type {
  InteractionStep,
  GuardianCertificate,
  SwapInfo,
  Interaction,
  TwoWayPegReserveSetting,
  EmissionSetting,
} from "./hermes.schema";

export default class HermesApi extends ZeusService {
  private readonly api: AxiosInstance;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.api = this.getInitializedApi();
  }

  public async findManyInteractions(payload: {
    size: number;
    solanaAddress: string;
  }) {
    return this.get(
      `/v2/interactions`,
      snakify(payload),
      z.object({
        items: z.array(interactionSchema),
        cursor: z.string().nullable(),
      }),
    );
  }

  public async getTwoWayPegReserveSettings() {
    return this.get(
      "/v1/raw/layer/two-way-peg/guardian-settings",
      {},
      z.object({
        data: z.object({
          items: z.array(twoWayPegReserveSettingSchema),
        }),
      }),
    );
  }

  public async getEmissionSettings() {
    return this.get(
      "/v1/raw/layer/delegator/guardian-settings",
      {},
      z.object({
        data: z.object({
          items: z.array(emissionSettingSchema),
        }),
      }),
    );
  }

  private getInitializedApi() {
    const { solanaNetwork, bitcoinNetwork } = this.core;

    const getBaseURL = () => {
      if (
        bitcoinNetwork === BitcoinNetwork.Mainnet &&
        solanaNetwork === SolanaNetwork.Mainnet
      )
        return "https://indexer.zeuslayer.io/api";

      if (
        bitcoinNetwork === BitcoinNetwork.Testnet &&
        solanaNetwork === SolanaNetwork.Devnet
      )
        return "https://indexer-regtest-devnet.zeuslayer.space/api";

      if (
        bitcoinNetwork === BitcoinNetwork.Regtest &&
        solanaNetwork === SolanaNetwork.Devnet
      )
        return "https://indexer-regtest-devnet.zeuslayer.space/api";

      throw new ClientRequestError(
        "Hermes",
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
      const response = await this.api.get<T>(path, {
        params,
      });
      return await z.preprocess(camelize, schema).parseAsync(response.data);
    } catch (error) {
      throw new ClientRequestError("Hermes", error as Error);
    }
  }
}
