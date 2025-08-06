"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { BitcoinNetwork, SolanaNetwork } from "@zeus-network/zeus-stack-widget";

import WidgetConfigProvider from "@/providers/WidgetConfigProvider";

const SOLANA_NETWORK = SolanaNetwork.Devnet;
const BITCOIN_NETWORK = BitcoinNetwork.Regtest;
const ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK);

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WidgetConfigProvider
            solanaNetwork={SOLANA_NETWORK}
            bitcoinNetwork={BITCOIN_NETWORK}
            onError={(error) => {
              console.log({ error });
              enqueueSnackbar(error.message, { variant: "error" });
            }}
            onSuccess={(message) => {
              enqueueSnackbar(message, { variant: "success" });
            }}
          >
            {children}
            <SnackbarProvider
              anchorOrigin={{ horizontal: "right", vertical: "top" }}
            />
          </WidgetConfigProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
