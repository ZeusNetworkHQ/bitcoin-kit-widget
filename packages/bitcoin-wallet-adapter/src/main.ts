import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";

import * as Connectors from "./connectors";

bitcoin.initEccLib(ecc);

export { default as BitcoinWalletProvider } from "@/components/BitcoinWalletProvider";
export type * from "@/components/BitcoinWalletProvider";

export * from "@/contexts/BitcoinWalletContext";

export { Connectors };

export { default as useDeriveWalletConnector } from "./hooks/useDeriveWalletConnector";
