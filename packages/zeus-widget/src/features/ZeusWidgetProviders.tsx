import { useMemo } from "react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { BitcoinWalletProvider, Connectors } from "@zeus-widget/bitcoin-wallet";
import { BitcoinNetwork, SolanaNetwork } from "@zeus-widget/core";

import IconProvider from "@/components/Icon/IconProvider";
import ContextProvider from "@/contexts/ConextProvider";
import CorePoolProvider from "@/contexts/CorePoolProvider";

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
        (wallet): wallet is NonNullable<typeof wallet> => !!wallet
      ),
    [bitcoinWallets]
  );

  return (
    <WalletModalProvider className="zeus:wallet-adapter-modal">
      <BitcoinWalletProvider connectors={connectors} network={bitcoinNetwork}>
        <CorePoolProvider
          solanaNetwork={solanaNetwork}
          bitcoinNetwork={bitcoinNetwork}
        >
          <IconProvider />
          <ContextProvider onError={onError} onSuccess={onSuccess}>
            {children}
          </ContextProvider>
        </CorePoolProvider>
      </BitcoinWalletProvider>
    </WalletModalProvider>
  );
}

export default ZeusWidgetProviders;
