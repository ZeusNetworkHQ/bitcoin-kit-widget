import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";

bitcoin.initEccLib(ecc);

export { default as BitcoinWalletProvider } from "@/components/BitcoinWalletProvider";
export type * from "@/components/BitcoinWalletProvider";

export * from "@/contexts/BitcoinWalletContext";

export * as Connectors from "./connectors";

export { default as useDeriveWalletConnector } from "./hooks/useDeriveWalletConnector";
