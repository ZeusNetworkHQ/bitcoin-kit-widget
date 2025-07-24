import axios, { type AxiosInstance } from "axios";
import z from "zod";

import {
  delegatorGuardianSettingScheme,
  interactionSchema,
  twoWayPegGuardianSettingScheme,
} from "./hermes.schema";

import CoreConfig from "@/config/core";
import { BitcoinNetwork, SolanaNetwork } from "@/types";
import { camelize, snakify } from "@/utils";

export type * from "./hermes.schema";

interface HermesClientParams {
  coreConfig?: CoreConfig;
}

export default class HermesClient {
  private readonly core: CoreConfig;
  private readonly api: AxiosInstance;

  constructor({ coreConfig = new CoreConfig() }: HermesClientParams = {}) {
    this.core = coreConfig;
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
      })
    );
  }

  public async getTwoWayPegGuardianSettings() {
    return this.get(
      "/v1/raw/layer/two-way-peg/guardian-settings",
      {},
      z.object({
        data: z.object({
          items: z.array(twoWayPegGuardianSettingScheme),
        }),
      })
    );
  }

  public async getDelegatorGuardianSettings() {
    return this.get(
      "/v1/raw/layer/delegator/guardian-settings",
      {},
      z.object({
        data: z.object({
          items: z.array(delegatorGuardianSettingScheme),
        }),
      })
    );
  }

  private getInitializedApi() {
    const { solanaNetwork, bitcoinNetwork } = this.core;

    const getBaseURL = () => {
      if (
        bitcoinNetwork === BitcoinNetwork.Mainnet &&
        solanaNetwork === SolanaNetwork.Mainnet
      )
        return "https://indexer-internal.zeuslayer.io";

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

      throw new Error(
        `[Hermes Error]: Unsupported network configuration: Bitcoin "${bitcoinNetwork}" and Solana "${solanaNetwork}"`
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
      const response = await this.api.get<T>(path, {
        params,
      });
      return await z.preprocess(camelize, schema).parseAsync(response.data);
    } catch (error) {
      throw new Error(`[HermesClient Error]: ${error}`);
    }
  }
}
