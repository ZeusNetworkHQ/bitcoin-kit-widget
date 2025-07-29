import * as bitcoin from "bitcoinjs-lib";
import { type ECPairInterface } from "ecpair";

export enum WalletLabel {
  Muses = "muses",
  OKXWeb3 = "okx_web3",
  UniSat = "unisat",
  Xverse = "xverse",
  Phantom = "phantom",
}

// Warning: this enum is also used in the wallet connector, make sure to keep it in sync
export enum WalletId {
  Muses = "muses",
  OKXMainnet = "okx",
  OKXTestnet = "okx_testnet",
  UniSat = "unisat",
  Xverse = "xverse",
  Phantom = "phantom",
  DeriveWallet = "derive_wallet",
}

export interface Wallet {
  id: WalletId | string;
  title: string;
  icon: string;
  type: "connector" | "solana";
  isDetected: boolean;
  url: string;
  label: WalletLabel | string; // allow custom label
}

export interface OKXWalletBase {
  connect(): Promise<{
    address: string;
    compressedPublicKey: string | null;
    publicKey: string;
  }>;
  signMessage(
    signStr: string,
    type?: "ecdsa" | "bip322-simple"
  ): Promise<string>;
  signPsbt(psbt: string, opts?: Record<string, unknown>): Promise<string>;
  signPsbts(psbt: string[], opts?: Record<string, unknown>): Promise<string[]>;
}

/**
 * ! okx testnet got different API from mainnet
 * @link https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider-testnet
 */
export interface OKXWalletTestnet {
  bitcoinTestnet: OKXWalletBase;
}

/**
 * @link https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider
 */
export interface OKXWalletMainnet {
  bitcoin: OKXWalletBase & {
    requestAccounts(): Promise<string[]>;
    getAccounts(): Promise<string[]>;
    getNetwork(): Promise<"livenet">; // mainnet only, return "livenet"
    getPublicKey(): Promise<string | null>;
    sendBitcoin(
      toAddress: string,
      satoshis: number,
      opts?: Record<string, unknown>
    ): Promise<string>;
    sendInscription(
      address: string,
      inscriptionId: string,
      opts?: Record<string, unknown>
    ): Promise<string>;
  };
}

export interface BtcAccount {
  address: string;
  addressType: "p2tr" | "p2wpkh" | "p2sh" | "p2pkh";
  publicKey: string;
  purpose: "payment" | "ordinals";
}
/**
 * @link https://docs.phantom.com/bitcoin/provider-api-reference
 */
export interface PhantomBitcoinWallet {
  bitcoin?: {
    requestAccounts(): Promise<BtcAccount[]>;
    signMessage(
      message: Uint8Array,
      address: string
    ): Promise<{
      signature: Uint8Array;
    }>;
    signPSBT(
      psbtHex: Uint8Array,
      options?: Record<string, unknown>
    ): Promise<Uint8Array>; // WARNING: this is not as same as the document, since the actual behavior is return Uint8Array
  };
}

export type BitcoinWalletType = "solana" | "connector" | null;

export type BitcoinXOnlyPublicKey = Buffer;

export type BitcoinAddress = Buffer;

export interface BitcoinWallet {
  pubkey: string;
  p2tr: string;
  privkeyHex?: string;
  privkey?: ECPairInterface;
  p2pkh?: string;
  p2wpkh?: string;
  tweakSigner?: bitcoin.Signer;
  signer?: bitcoin.Signer;
}

export enum EventName {
  sendUserOp = "sendUserOp",
  sendUserOpResult = "sendUserOpResult",

  personalSign = "personalSign",
  personalSignResult = "personalSignResult",

  signTypedData = "signTypedData",
  signTypedDataResult = "signTypedDataResult",
}
