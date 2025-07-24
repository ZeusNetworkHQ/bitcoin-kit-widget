/* eslint-disable @typescript-eslint/no-explicit-any */

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
    muses?: any;
    unisat?: any;
    xverse?: any;
  }
}
