"use client";

import { createContext, useContext, useMemo } from "react";
import {
  BitcoinNetwork,
  WidgetWidgetConfig,
} from "@zeus-network/zeus-stack-widget";
import {
  Connectors,
  useDeriveWalletConnector,
} from "@zeus-network/zeus-stack-widget/bitcoin-wallet-adapter";

const WidgetConfigContext = createContext<WidgetWidgetConfig | null>(null);

function WidgetConfigProvider({
  children,
  bitcoinNetwork,
  ...props
}: React.PropsWithChildren<WidgetWidgetConfig>) {
  const derivedWalletConnector = useDeriveWalletConnector(
    bitcoinNetwork || BitcoinNetwork.Regtest,
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
    [],
  );

  const bitcoinWallets = useMemo(() => {
    return [derivedWalletConnector, ...defaultWallets];
  }, [derivedWalletConnector, defaultWallets]);

  return (
    <WidgetConfigContext.Provider
      value={{
        ...props,
        bitcoinNetwork,
        bitcoinWallets,
      }}
    >
      {children}
    </WidgetConfigContext.Provider>
  );
}

export default WidgetConfigProvider;

export function useWidgetConfig() {
  const context = useContext(WidgetConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
