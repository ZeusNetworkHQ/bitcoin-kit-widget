/// <reference types="vite/client" />

import type {
  OKXWalletMainnet,
  OKXWalletTestnet,
  PhantomBitcoinWallet,
} from "./types";

declare global {
  interface Window {
    okxwallet?: OKXWalletMainnet & OKXWalletTestnet;
    phantom?: PhantomBitcoinWallet;
    muses?: unknown;
    unisat?: unknown;
    xverse?: unknown;
  }
}
