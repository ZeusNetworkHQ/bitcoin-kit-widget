import { useMemo } from "react";

import { useWallet } from "@solana/wallet-adapter-react";

import type { BitcoinNetwork } from "@/types";

import { DeriveWalletConnector } from "@/connectors";

/**
 * Hook to get derived wallet connector based on the current Solana wallet connection.
 * You can also implement your own logic to get the derived wallet connector by using the `DeriveWalletConnector` class from `zeus-widget/bitcoin`.
 */

function useDeriveWalletConnector(bitcoinNetwork: BitcoinNetwork) {
  const wallet = useWallet();

  return useMemo(() => {
    if (!wallet.connected || !wallet.publicKey) return null;
    return new DeriveWalletConnector(wallet, bitcoinNetwork);
  }, [wallet, bitcoinNetwork]);
}

export default useDeriveWalletConnector;
