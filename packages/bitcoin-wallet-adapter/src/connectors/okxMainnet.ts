import EventEmitter from "events";

import { BaseConnector, type WalletMetadata } from "./base";

import okxIconSource from "@/assets/okx.svg";
import { BitcoinNetwork } from "@/types";
import { WalletId } from "@/types";

export class OKXConnector extends BaseConnector {
  readonly networks = [BitcoinNetwork.Mainnet];
  _network = "livenet";
  _event = new EventEmitter();

  readonly metadata: WalletMetadata = {
    id: WalletId.OKXMainnet,
    name: "OKX Web3 Wallet",
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
      window.okxwallet.bitcoin !== undefined
    );
  }

  private async connectToWallet(): Promise<{
    address: string;
    compressedPublicKey: string | null;
    publicKey: string;
  }> {
    const network = await this.getNetwork();

    if (network === undefined || network === null || network != "livenet") {
      throw new Error(
        `This connector only support ${this.metadata.name} on livenet`,
      );
    }

    const account = await this.getProviderOrThrow().connect();

    if (account == undefined) {
      throw new Error(`${this.metadata.name} not connected!`);
    }

    // ! identify if account.address start with "bc1p" which is a p2tr address
    // ! or else need to ask user to switch to p2tr address
    // ! this is for protecting the account which is loading from Ledger wallet
    // ! which the address loading from Ledger is not sharing the same pubkey
    // ! which will cause serious problem since we are generating the p2tr address from user pubkey
    // TODO: might need to add a notification to ask user to switch to p2tr address
    if (!account.address.startsWith("bc1p")) {
      throw new Error(
        `This connector only support ${this.metadata.name} with p2tr address`,
      );
    }

    return account;
  }

  async requestAccounts(): Promise<string[]> {
    return this.getProviderOrThrow().requestAccounts();
  }

  async getAccounts(): Promise<string[]> {
    return this.getProviderOrThrow().getAccounts();
  }
  async getPublicKey(): Promise<string> {
    const accounts = await this.connectToWallet();
    if (accounts === undefined) {
      throw new Error(`${this.metadata.name} not connected!`);
    }
    return accounts.publicKey;
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
    return this.getProvider()?.on(event, handler);
  }

  removeListener(event: string, handler: (data?: unknown) => void) {
    return this.getProvider()?.removeListener(event, handler);
  }

  getProvider() {
    if (this.isReady()) {
      return window.okxwallet?.bitcoin;
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

  async getNetwork(): Promise<"livenet" | "testnet" | "regtest"> {
    return this.getProviderOrThrow().getNetwork();
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
    return this.getProviderOrThrow().sendBitcoin(toAddress, satoshis, options);
  }

  async sendInscription(
    address: string,
    inscriptionId: string,
    options?: { feeRate: number },
  ): Promise<{ txid: string }> {
    const result = await this.getProviderOrThrow().sendInscription(
      address,
      inscriptionId,
      options,
    );
    if (typeof result === "string") {
      return {
        txid: result,
      };
    }

    return result;
  }

  disconnect() {}
}
