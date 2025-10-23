import { createContext, useContext } from "react";

import * as bitcoin from "bitcoinjs-lib";

import type { BaseConnector } from "@/connectors";

export interface BitcoinWallet {
  pubkey: string | null;
  address: string | null;
  connected: boolean;
  connector: BaseConnector | null;
  connectors: BaseConnector[];
  connect: (connector: BaseConnector) => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signPsbt: (psbt: bitcoin.Psbt) => Promise<string>;
}

export const BitcoinWalletContext = createContext<BitcoinWallet | null>(null);

export const useBitcoinWallet = () => {
  const value = useContext(BitcoinWalletContext);

  if (!value) {
    throw new Error(
      `useBitcoinWallet must be used within the BitcoinWalletProvider`,
    );
  }

  return value;
};
