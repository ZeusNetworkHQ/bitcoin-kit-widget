import { useWallet } from "@solana/wallet-adapter-react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useMemo } from "react";
import {
  BitcoinNetwork,
  SolanaNetwork,
  ZeusButton,
  ZeusShadow,
  ZeusWidget,
} from "zeus-widget";
import { Connectors, useDeriveWalletConnector } from "zeus-widget/bitcoin";

import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// import "zeus-widget/assets/style.css";

function App() {
  const wallet = useWallet();

  const bitcoinNetwork = BitcoinNetwork.Regtest;
  const solanaNetwork = SolanaNetwork.Devnet;

  const connectors = useMemo(
    () => [
      new Connectors.MusesConnector(),
      new Connectors.PhantomConnector(),
      new Connectors.OKXConnector(),
      new Connectors.XverseConnector(),
      new Connectors.UniSatConnector(),
    ],
    []
  );

  const deriveWalletConnector = useDeriveWalletConnector(bitcoinNetwork);

  const bitcoinWallets = useMemo(
    () => [...connectors, deriveWalletConnector].filter(Boolean),
    [connectors, deriveWalletConnector]
  );

  return (
    <>
      <SnackbarProvider />
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ZeusShadow>
          <ZeusWidget.Popover
            side="top"
            config={{
              solanaNetwork,
              bitcoinNetwork,
              bitcoinWallets,
              onError: (error) => {
                console.log({ error });
                enqueueSnackbar({
                  variant: "error",
                  message: error.message,
                });
              },
              onSuccess: (message) => {
                enqueueSnackbar({
                  variant: "success",
                  message: message,
                });
              },
            }}
          >
            <ZeusButton>Open Widget</ZeusButton>
          </ZeusWidget.Popover>
        </ZeusShadow>
      </div>

      <p className="read-the-docs" onClick={() => wallet.disconnect()}>
        Disconnect
      </p>
    </>
  );
}

export default App;
