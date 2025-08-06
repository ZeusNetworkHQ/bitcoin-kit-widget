import AresApi, { type AresUtxo } from "@/apis/ares";
import UnisatApi, { type UnisatUtxo } from "@/apis/unisat";
import Cache from "@/lib/cache";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";

export default class UtxoModel extends ZeusService {
  private readonly aresApi: AresApi;
  private readonly unisatApi: UnisatApi;
  public readonly cache = new Cache<Record<string, AresUtxo[]>>("zeus:utxos");

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.aresApi = this.core.getOrInstall(AresApi);
    this.unisatApi = this.core.getOrInstall(UnisatApi);
  }

  public async findMany(payload: {
    bitcoinAddress: string;
    ordinal?: boolean;
    blocked?: boolean;
  }) {
    const utxosRaw = await this.aresApi.findManyUtxos(payload);

    const ordinalUtxos = await this.getOrdinalUtxos(payload.bitcoinAddress);

    const blockedUtxos = await this.findBlockedUtxos();

    let utxos = utxosRaw.map((utxo) => ({
      ...utxo,
      ordinal: ordinalUtxos.some(
        (ordUtxo) =>
          ordUtxo.txid === utxo.transactionId &&
          ordUtxo.vout === utxo.transactionIndex,
      ),
      blocked: blockedUtxos.some(
        (blockedUtxo) =>
          blockedUtxo.transactionId === utxo.transactionId &&
          blockedUtxo.transactionIndex === utxo.transactionIndex,
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
      const res = await this.unisatApi.findManyOrdinalUtxo({
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
        const transactionDetail = await this.aresApi.getTransactionDetail({
          transactionId,
        });

        if (transactionDetail.confirmations) this.cache.delete(transactionId);
      }),
    );
  }
}
