import { BitcoinNetwork } from "@/types";

export interface WalletMetadata {
  id: string;
  name: string;
  icon: string;
  downloadUrl: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class BaseConnector {
  abstract readonly metadata: WalletMetadata;
  abstract readonly networks: BitcoinNetwork[];
  abstract isReady(): boolean;
  abstract requestAccounts(): Promise<string[]>;
  abstract getAccounts(): Promise<string[]>;
  abstract getPublicKey(): Promise<string>;
  abstract signMessage(
    signStr: string,
    type?: "ecdsa" | "bip322-simple",
  ): Promise<string>;
  abstract signPsbt(psbt: string, opt?: unknown): Promise<string>;
  abstract on(event: string, handler: (data?: unknown) => void): void;
  abstract removeListener(
    event: string,
    handler: (data?: unknown) => void,
  ): void;
  [key: string]: any;
  abstract getProvider(): any;
  abstract getNetwork(): Promise<"livenet" | "testnet">;
  abstract switchNetwork(network: "livenet" | "testnet"): Promise<void>;
  abstract sendBitcoin(
    toAddress: string,
    satoshis: number,
    options?: { feeRate: number },
  ): Promise<string>;
  abstract sendInscription(
    address: string,
    inscriptionId: string,
    options?: { feeRate: number },
  ): Promise<{ txid: string }>;
  abstract disconnect(): void;
}
