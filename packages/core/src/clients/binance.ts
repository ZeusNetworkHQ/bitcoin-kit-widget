import axios, { type AxiosInstance } from "axios";
import z from "zod";

import CoreConfig from "@/config/core";

export type * from "./unisat.schema";

interface BinanceClientParams {
  coreConfig?: CoreConfig;
}

export default class BinanceClient {
  private readonly core: CoreConfig;
  private readonly api: AxiosInstance;

  constructor({ coreConfig = new CoreConfig() }: BinanceClientParams = {}) {
    this.core = coreConfig;
    this.api = this.getInitializedApi();
  }

  public async findPrice(payload: { symbol: string }) {
    return this.get(
      `/v3/ticker/price`,
      { symbol: payload.symbol },
      z.object({
        price: z.string(),
        symbol: z.string(),
      })
    );
  }

  private getInitializedApi() {
    return axios.create({
      baseURL: "https://www.binance.com/api",
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
      return schema.parse(response.data);
    } catch (error) {
      throw new Error(`[Binance Error]: ${error}`);
    }
  }
}
