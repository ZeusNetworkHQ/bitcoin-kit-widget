import AresClient, { type AresUtxo } from "@/clients/ares";
import UnisatClient, { type UnisatUtxo } from "@/clients/unisat";
import CoreConfig from "@/config/core";
import Cache from "@/lib/cache";

export default class UtxoModel {
  private readonly core: CoreConfig;
  private readonly aresClient: AresClient;
  private readonly unisatClient: UnisatClient;
  public readonly cache = new Cache<Record<string, AresUtxo[]>>("zeus:utxos");

  constructor({
    coreConfig = new CoreConfig(),
    aresClient = new AresClient({ coreConfig }),
    unisatClient = new UnisatClient({ coreConfig }),
  } = {}) {
    this.core = coreConfig;
    this.aresClient = aresClient;
    this.unisatClient = unisatClient;
  }

  public async findMany(payload: {
    bitcoinAddress: string;
    ordinal?: boolean;
    blocked?: boolean;
  }) {
    const utxosRaw = await this.aresClient.findManyUtxos(payload);

    const ordinalUtxos = await this.getOrdinalUtxos(payload.bitcoinAddress);

    const blockedUtxos = await this.findBlockedUtxos();

    let utxos = utxosRaw.map((utxo) => ({
      ...utxo,
      ordinal: ordinalUtxos.some(
        (ordUtxo) =>
          ordUtxo.txid === utxo.transactionId &&
          ordUtxo.vout === utxo.transactionIndex
      ),
      blocked: blockedUtxos.some(
        (blockedUtxo) =>
          blockedUtxo.transactionId === utxo.transactionId &&
          blockedUtxo.transactionIndex === utxo.transactionIndex
      ),
    }));

    if (payload.ordinal !== undefined) {
      utxos = utxos.filter((utxo) => utxo.ordinal === payload.ordinal);
    }

    if (payload.blocked !== undefined) {
      utxos = utxos.filter((utxo) => utxo.blocked === payload.blocked);
    }

    return utxos;
  }

  public async blockUtxos(transactionId: string, utxos: AresUtxo[]) {
    this.cache.set(transactionId, utxos);
  }

  // --- PRIVATES ---

  private async getOrdinalUtxos(bitcoinAddress: string) {
    let cursor = 0;
    let totalConfirmed = Infinity;
    const ordinalUtxos: UnisatUtxo[] = [];

    while (cursor < totalConfirmed) {
      const res = await this.unisatClient.findManyOrdinalUtxo({
        cursor,
        size: 1000,
        bitcoinAddress,
      });
      const data = res;
      ordinalUtxos.push(...data.utxo);

      totalConfirmed = data.totalConfirmed;
      cursor += data.utxo.length;
    }

    return ordinalUtxos;
  }

  private async findBlockedUtxos() {
    await this.releaseUtxosIfTransactionConformed();
    return this.cache.entries().flatMap(([, utxos]) => utxos);
  }

  private async releaseUtxosIfTransactionConformed() {
    const transactionIds = this.cache.keys();

    await Promise.all(
      transactionIds.map(async (transactionId) => {
        const transactionDetail = await this.aresClient.getTransactionDetail({
          transactionId,
        });

        if (transactionDetail.confirmations) this.cache.delete(transactionId);
      })
    );
  }
}
