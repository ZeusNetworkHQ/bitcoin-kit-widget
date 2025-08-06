// * base on the okx document, bitcoin testnet provider got different method
// * currently only provide 4 methods
// - connect
// - signMessage
// - signPsbt
// - signPsbts
// ref: https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider-testnet

import EventEmitter from "events";

import { BaseConnector, type WalletMetadata } from "./base";

import okxIconSource from "@/assets/okx.svg";
import { BitcoinNetwork } from "@/types";
import { WalletId } from "@/types";

export class OKXTestnetConnector extends BaseConnector {
  readonly networks = [BitcoinNetwork.Testnet];
  _network = "Testnet";
  _event = new EventEmitter();
  readonly metadata: WalletMetadata = {
    id: WalletId.OKXTestnet,
    name: "OKX Testnet Web3 Wallet",
    icon: okxIconSource,
    downloadUrl: "https://www.okx.com/download",
  };

  constructor() {
    super();
    this._event.setMaxListeners(100);
  }

  isReady(): boolean {
    return (
      typeof window !== "undefined" &&
      window.okxwallet !== undefined &&
      window.okxwallet.bitcoinTestnet !== undefined
    );
  }

  private async connectToWallet() {
    const account = await this.getProviderOrThrow().connect();

    if (account == undefined) {
      throw new Error(`${this.metadata.name} not connected!`);
    }

    return account;
  }

  async requestAccounts(): Promise<string[]> {
    const account = await this.connectToWallet();
    return [account.address];
  }

  async getAccounts(): Promise<string[]> {
    const account = await this.connectToWallet();
    return [account.address];
  }

  async getPublicKey(): Promise<string> {
    const account = await this.connectToWallet();
    if (account == undefined) {
      throw new Error(`${this.metadata.name} not connected!`);
    }
    return account.publicKey;
  }

  async signMessage(
    signStr: string,
    type?: "ecdsa" | "bip322-simple",
  ): Promise<string> {
    const addresses = await this.getAccounts();
    if (addresses.length === 0) {
      throw new Error(`${this.metadata.name} not connected!`);
    }
    return this.getProviderOrThrow().signMessage(signStr, type);
  }

  async signPsbt(psbt: string, opt?: Record<string, unknown>): Promise<string> {
    // ! Warning this might be failed to sign by web extension wallet if the psbt inputs include pubkey not equal to the wallet's pubkey
    // ! due to different web extension wallet design you must go through the documentation of the wallet you are using
    return this.getProviderOrThrow().signPsbt(psbt, {
      ...opt,
    });
  }

  on(event: string, handler: (data?: unknown) => void) {
    return this._event.on(event, handler);
  }

  removeListener(event: string, handler: (data?: unknown) => void) {
    return this._event.removeListener(event, handler);
  }

  getProvider() {
    if (this.isReady()) {
      return window.okxwallet?.bitcoinTestnet;
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
    return "testnet";
  }

  async switchNetwork(): Promise<void> {
    throw new Error(`switchNetwork is not supported by ${this.metadata.name}`);
  }

  async sendBitcoin(): Promise<string> {
    throw new Error(`sendBitcoin is not supported by ${this.metadata.name}`);
  }

  async sendInscription(): Promise<{ txid: string }> {
    throw new Error(
      `sendInscription is not supported by ${this.metadata.name}`,
    );
  }

  disconnect() {}
}
