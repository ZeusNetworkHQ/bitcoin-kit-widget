import { clusterApiUrl, Connection } from "@solana/web3.js";

import { SolanaNetwork } from "@/types";

export function getDefaultConnection(solanaNetwork: SolanaNetwork) {
  if (solanaNetwork === SolanaNetwork.Mainnet)
    return new Connection(clusterApiUrl("mainnet-beta"));
  return new Connection(clusterApiUrl(solanaNetwork));
}
