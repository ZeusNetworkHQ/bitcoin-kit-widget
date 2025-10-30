import EventEmitter from "events";

import * as bitcoin from "bitcoinjs-lib";
import { fromHex, toHex } from "uint8array-tools";

import { BaseConnector, type WalletMetadata } from "./base";

import phantomIconSource from "@/assets/phantom.svg";
import { BitcoinNetwork } from "@/types";
import { WalletId } from "@/types";

/**
 * @link https://docs.phantom.app/bitcoin/provider-api-reference#options-parameters
 */
type PhantomSignPsbtOptions = {
  sigHash?: number;
  address: string;
  signingIndexes: number[];
}[];

export class PhantomConnector extends BaseConnector {
  readonly networks = [BitcoinNetwork.Mainnet];
  _event = new EventEmitter();

  readonly metadata: WalletMetadata = {
    id: WalletId.Phantom,
    name: "Phantom Wallet",
    icon: phantomIconSource,
    downloadUrl: "https://www.phantom.app/",
  };

  constructor() {
    super();
    this._event.setMaxListeners(100);
  }

  isReady(): boolean {
    return (
      typeof window !== "undefined" &&
      window.phantom !== undefined &&
      window.phantom.bitcoin !== undefined
    );
  }

  async requestAccounts(): Promise<string[]> {
    const accounts = await this.getProviderOrThrow().requestAccounts();

    // FIXME: need to figure out moving the notifyError to the UI layer
    if (!accounts || accounts.length === 0) {
      console.error(
        `${this.metadata.name} > Bitcoin wallet not created. Please create a Bitcoin wallet in Phantom wallet.`,
      );
      throw new Error(
        `${this.metadata.name} is not install or not create Bitcoin wallet!`,
      );
    }

    // find p2tr address
    const account = accounts.filter(
      (account) => account.addressType === "p2tr",
    );
    if (!account || account.length === 0) {
      console.error(
        `${this.metadata.name} > Bitcoin Wallet Taproot(P2TR) address not found. Please go to your Phantom wallet Settings > Preferences > Preferred Bitcoin Address, enable "Taproot" address.`,
      );
      throw new Error(
        `${this.metadata.name} Bitcoin Wallet Taproot(P2TR) address not found.`,
      );
    }
    // the length of account should be 1, so we can safely return the first one
    return [account[0].address];
  }

  async getAccounts(): Promise<string[]> {
    return this.requestAccounts();
  }

  async getPublicKey(): Promise<string> {
    const accounts = await this.getProviderOrThrow().requestAccounts();
    // filter p2tr address
    const account = accounts.find((account) => account.addressType === "p2tr");

    if (!account) {
      throw new Error(
        `${this.metadata.name} is not install or not create Bitcoin wallet!`,
      );
    }
    return account.publicKey;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async signMessage(
    signStr: string,
    _type?: "ecdsa" | "bip322-simple",
  ): Promise<string> {
    // signStr to Uint8Array
    const signData = Uint8Array.from(Buffer.from(signStr, "utf-8"));
    const accounts = await this.requestAccounts();
    const result = await this.getProviderOrThrow().signMessage(
      signData,
      accounts[0],
    );

    return Buffer.from(result.signature).toString("base64");
  }

  async signPsbt(
    psbt: string,
    _opt?: Record<string, unknown>,
  ): Promise<string> {
    const psbtParsed = bitcoin.Psbt.fromHex(psbt);
    const inputLength = psbtParsed.data.inputs.length;
    const walletAddress = await this.getAccounts();
    const inputAddress = walletAddress[0];

    if (!inputAddress) {
      throw new Error("No input address found");
    }
    const inputsToSign: PhantomSignPsbtOptions = [
      {
        sigHash: 0x01, // bitcoinjs -> SIGHASH_ALL
        address: inputAddress,
        signingIndexes: Array.from({ length: inputLength }, (_, i) => i),
      },
    ];

    // WARNING: although the phantom documentation says the return type is Promise<string>, but the actual return type is Promise<Uint8Array>
    const signedPsbt = await this.getProviderOrThrow().signPSBT(fromHex(psbt), {
      inputsToSign,
    });

    return toHex(signedPsbt);
  }

  on(event: string, handler: (data?: unknown) => void): void {
    this.getProvider()?.on(event, handler);
  }

  removeListener(event: string, handler: (data?: unknown) => void): void {
    this.getProvider()?.removeListener(event, handler);
  }

  getProvider() {
    if (this.isReady()) {
      return window.phantom?.bitcoin;
    }
  }

  getProviderOrThrow() {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(
        `${this.metadata.name} is not install or not create Bitcoin wallet!`,
      );
    }
    return provider;
  }

  async getNetwork(): Promise<"livenet" | "testnet"> {
    return "livenet";
  }

  async switchNetwork(network: "livenet" | "testnet"): Promise<void> {
    throw new Error(
      `${this.metadata.name} does not support network switching: ${network}`,
    );
  }

  async sendBitcoin(
    toAddress: string,
    satoshis: number,
    options?: { feeRate: number },
  ): Promise<string> {
    throw new Error(
      `${this.metadata.name} does not support sendBitcoin: ${toAddress}, ${satoshis}, ${options}`,
    );
  }

  async sendInscription(
    address: string,
    inscriptionId: string,
    options?: { feeRate: number },
  ): Promise<{ txid: string }> {
    throw new Error(
      `${this.metadata.name} does not support sendInscription: ${address}, ${inscriptionId}, ${options}`,
    );
  }

  disconnect(): void {}
}
