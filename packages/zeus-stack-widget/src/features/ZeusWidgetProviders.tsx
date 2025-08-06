import { useMemo } from "react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  BitcoinWalletProvider,
  Connectors,
} from "@zeus-network/bitcoin-wallet-adapter";
import { BitcoinNetwork, SolanaNetwork } from "@zeus-network/client";

import IconProvider from "@/components/Icon/IconProvider";
import { ConfigProvider } from "@/contexts/ConfigContext";

const DEFAULT_BITCOIN_WALLETS: Connectors.BaseConnector[] = [];

export interface ZeusWidgetProvidersProps {
  children: React.ReactNode;
  bitcoinNetwork?: BitcoinNetwork;
  solanaNetwork?: SolanaNetwork;
  bitcoinWallets?: (Connectors.BaseConnector | null)[];
  onError?: (error: Error) => void;
  onSuccess?: (message: string) => void;
}

function ZeusWidgetProviders({
  children,
  bitcoinNetwork = BitcoinNetwork.Regtest,
  solanaNetwork = SolanaNetwork.Devnet,
  bitcoinWallets = DEFAULT_BITCOIN_WALLETS,
  onError,
  onSuccess,
}: ZeusWidgetProvidersProps) {
  const connectors = useMemo(
    () =>
      bitcoinWallets.filter(
        (wallet): wallet is NonNullable<typeof wallet> => !!wallet,
      ),
    [bitcoinWallets],
  );

  return (
    <WalletModalProvider className="zeus:wallet-adapter-modal">
      <BitcoinWalletProvider connectors={connectors} network={bitcoinNetwork}>
        <IconProvider />
        <ConfigProvider
          solanaNetwork={solanaNetwork}
          bitcoinNetwork={bitcoinNetwork}
          onError={onError}
          onSuccess={onSuccess}
        >
          {children}
        </ConfigProvider>
      </BitcoinWalletProvider>
    </WalletModalProvider>
  );
}

export default ZeusWidgetProviders;
