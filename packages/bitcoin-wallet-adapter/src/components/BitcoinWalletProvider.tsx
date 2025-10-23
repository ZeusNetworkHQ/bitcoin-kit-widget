import { useCallback, useEffect, useMemo, useState } from "react";

import * as bitcoin from "bitcoinjs-lib";

import type { BaseConnector } from "@/connectors";

import { BitcoinWalletContext } from "@/contexts/BitcoinWalletContext";
import { BitcoinNetwork } from "@/types";

export interface BitcoinWalletProviderProps {
  connectors: (BaseConnector | null)[];
  network?: BitcoinNetwork;
  children: React.ReactNode;
}

function BitcoinWalletProvider({
  connectors,
  network = BitcoinNetwork.Regtest,
  children,
}: BitcoinWalletProviderProps) {
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connector, setConnector] = useState<BaseConnector | null>(null);

  const availableConnectors = useMemo(() => {
    return connectors.filter(
      (c): c is NonNullable<typeof c> => !!c && c.networks.includes(network),
    );
  }, [connectors, network]);

  const connect = useCallback(async (connector: BaseConnector) => {
    // prevent error loop we need to connect to the wallet first, so that some wallet can change the network
    const accounts = await connector.requestAccounts();

    if (accounts.length === 0) {
      throw Error(
        "No accounts found. Please create a new account in your wallet.",
      );
    }

    setConnector(connector);
    setAddress(accounts[0]);
    setPubkey(await connector.getPublicKey());
  }, []);

  const disconnect = useCallback(async () => {
    if (!connector) return;
    await connector.disconnect();
    setConnector(null);
    setPubkey(null);
    setAddress(null);
  }, [connector]);

  const signMessage = useCallback(
    (message: string) => {
      if (!connector) {
        throw new Error("No connector available to sign message");
      }
      return connector.signMessage(message);
    },
    [connector],
  );

  const signPsbt = useCallback(
    async (psbt: bitcoin.Psbt) => {
      if (!connector) {
        throw new Error("Wallet not connected");
      }

      const signedPsbtHex = await connector.signPsbt(psbt.toHex(), {
        autoFinalized: false,
      });

      psbt = bitcoin.Psbt.fromHex(signedPsbtHex);
      psbt.finalizeAllInputs();

      return psbt.extractTransaction().toHex();
    },
    [connector],
  );

  useEffect(() => {
    let publicKey: string | undefined;
    let network: string | undefined;

    const onAccountChange = async () => {
      if (!connector) {
        console.error("Connector is not defined");
        return;
      }

      if (
        publicKey !== (await connector.getPublicKey()) ||
        network !== (await connector.getNetwork())
      ) {
        await disconnect();
      }
    };

    const registerListener = async () => {
      publicKey = await connector?.getPublicKey();
      network = await connector?.getNetwork();
      connector?.on("accountsChanged", onAccountChange);
    };
    registerListener();

    return () => {
      connector?.removeListener("accountsChanged", onAccountChange);
    };
  }, [connector, disconnect]);

  if (connector && !availableConnectors.includes(connector)) {
    setConnector(null);
  }

  return (
    <BitcoinWalletContext.Provider
      value={useMemo(
        () => ({
          pubkey,
          address,
          connected: !!pubkey,
          connector,
          connectors: availableConnectors,
          connect,
          disconnect,
          signMessage,
          signPsbt,
        }),
        [
          pubkey,
          address,
          connector,
          availableConnectors,
          connect,
          disconnect,
          signMessage,
          signPsbt,
        ],
      )}
    >
      {children}
    </BitcoinWalletContext.Provider>
  );
}

export default BitcoinWalletProvider;
