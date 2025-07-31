import { useEffect, useMemo } from "react";

import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

export const WALLET_RECONNECTED_EVENT = "walletReconnected";

function WalletEventProvider({ children }: React.PropsWithChildren) {
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.publicKey) return;
    return () => {
      document.dispatchEvent(new CustomEvent(WALLET_RECONNECTED_EVENT));
    };
  }, [wallet.publicKey]);

  return children;
}

function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint =
    import.meta.env.VITE_SOLANA_DEVNET_RPC || clusterApiUrl("devnet");

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletEventProvider>{children}</WalletEventProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SolanaWalletProvider;
