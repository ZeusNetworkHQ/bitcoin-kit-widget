import axios, { type AxiosInstance } from "axios";
import z from "zod";

import { unisatUtxoSchema } from "./unisat.schema";

import CoreConfig from "@/config/core";

export type * from "./unisat.schema";

interface UnisatClientParams {
  coreConfig?: CoreConfig;
}

export default class UnisatClient {
  private readonly core: CoreConfig;
  private readonly api: AxiosInstance;

  constructor({ coreConfig = new CoreConfig() }: UnisatClientParams = {}) {
    this.core = coreConfig;
    this.api = this.getInitializedApi();
  }

  public async findManyOrdinalUtxo(payload: {
    bitcoinAddress: string;
    cursor?: number;
    size?: number;
  }) {
    return this.get(
      `v1/indexer/address/${payload.bitcoinAddress}/inscription-utxo-data`,
      { cursor: payload.cursor, size: payload.size },
      z.object({
        cursor: z.number(),
        totalConfirmed: z.number(),
        utxo: z.array(unisatUtxoSchema),
      })
    );
  }

  private getInitializedApi() {
    return axios.create({
      baseURL: "https://open-api.unisat.io/",
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
      const response = await this.api.get<{ message: string; data: T }>(path, {
        params,
      });
      return schema.parse(response.data.data);
    } catch (error) {
      throw new Error(`[Unisat Error]: ${error}`);
    }
  }
}
