import axios, { type AxiosInstance } from "axios";
import z from "zod";

import { unisatUtxoSchema } from "./unisat.schema";

import { ClientRequestError } from "@/errors";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";

export type { UnisatUtxo } from "./unisat.schema";

export default class UnisatApi extends ZeusService {
  private readonly api: AxiosInstance;

  constructor(params: CreateZeusServiceParams) {
    super(params);
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
      }),
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
    schema: z.ZodType<T>,
  ): Promise<T> {
    try {
      const response = await this.api.get<{ message: string; data: T }>(path, {
        params,
      });
      return schema.parse(response.data.data);
    } catch (error) {
      throw new ClientRequestError("Unisat", error as Error);
    }
  }
}
