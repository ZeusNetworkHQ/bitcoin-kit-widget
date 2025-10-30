import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { SolanaNetwork } from "@zeus-network/client";
import { clusterApiUrl } from "@solana/web3.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSolanaRpcEndpoint(network: SolanaNetwork) {
  if (network === SolanaNetwork.Mainnet) return clusterApiUrl("mainnet-beta");
  return clusterApiUrl(network);
}
