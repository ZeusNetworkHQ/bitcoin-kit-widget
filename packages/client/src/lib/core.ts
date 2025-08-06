import { clusterApiUrl, Connection } from "@solana/web3.js";

import type ZeusService from "./service";

import { BitcoinNetwork, SolanaNetwork } from "@/types";

export interface CreateZeusCoreParams {
  solanaNetwork?: SolanaNetwork;
  solanaConnection?: Connection;
  bitcoinNetwork?: BitcoinNetwork;
}

class ZeusCore {
  public solanaNetwork: SolanaNetwork;
  public solanaConnection: Connection;
  public bitcoinNetwork: BitcoinNetwork;

  public providers: Record<string, ZeusService> = {};

  constructor(config: CreateZeusCoreParams | ZeusCore = {}) {
    const {
      solanaNetwork = SolanaNetwork.Devnet,
      bitcoinNetwork = BitcoinNetwork.Regtest,
      solanaConnection = getDefaultConnection(solanaNetwork),
    } = config;

    this.solanaNetwork = solanaNetwork;
    this.solanaConnection = solanaConnection;
    this.bitcoinNetwork = bitcoinNetwork;
  }

  static create(config?: CreateZeusCoreParams | ZeusCore) {
    if (config instanceof ZeusCore) {
      return config;
    }
    return new ZeusCore(config);
  }

  public getOrInstall<T extends typeof ZeusService>(
    Service: T,
    params?: Omit<ConstructorParameters<T>[0], "core">,
  ) {
    this.providers[Service.name] ??= new Service({ ...params, core: this });
    return this.providers[Service.name] as InstanceType<T>;
  }
}

export default ZeusCore;

// --- HELPERS ---

function getDefaultConnection(solanaNetwork: SolanaNetwork) {
  if (solanaNetwork === SolanaNetwork.Mainnet)
    return new Connection(clusterApiUrl("mainnet-beta"));
  return new Connection(clusterApiUrl(solanaNetwork));
}
