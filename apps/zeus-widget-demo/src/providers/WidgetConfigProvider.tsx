"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { createContext, use, useMemo } from "react";
import { BitcoinNetwork, ZeusWidgetWidgetConfig } from "zeus-widget";
import { Connectors, useDeriveWalletConnector } from "zeus-widget/bitcoin";

const WidgetConfigContext = createContext<ZeusWidgetWidgetConfig | null>(null);

function WidgetConfigProvider({
  children,
  bitcoinNetwork,
  ...props
}: React.PropsWithChildren<ZeusWidgetWidgetConfig>) {
  const wallet = useWallet();
  console.log({ WALLET: wallet });

  const derivedWalletConnector = useDeriveWalletConnector(
    bitcoinNetwork || BitcoinNetwork.Regtest
  );

  const defaultWallets = useMemo(
    () => [
      new Connectors.PhantomConnector(),
      new Connectors.MusesConnector(),
      new Connectors.OKXConnector(),
      new Connectors.OKXTestnetConnector(),
      new Connectors.UniSatConnector(),
      new Connectors.XverseConnector(),
    ],
    []
  );

  const bitcoinWallets = useMemo(() => {
    return [derivedWalletConnector, ...defaultWallets];
  }, [derivedWalletConnector, defaultWallets]);

  return (
    <WidgetConfigContext
      value={{
        ...props,
        bitcoinNetwork,
        bitcoinWallets,
      }}
    >
      {children}
    </WidgetConfigContext>
  );
}

export default WidgetConfigProvider;

export function useWidgetConfig() {
  const context = use(WidgetConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
