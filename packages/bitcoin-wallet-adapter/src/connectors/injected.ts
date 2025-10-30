import { BaseConnector } from "./base";

export abstract class InjectedConnector extends BaseConnector {
  constructor(private property: string) {
    super();
    const props = this.property?.split(".");
    if (!this.property || props.length > 2) {
      throw new Error("please input valid property");
    }
  }

  isReady(): boolean {
    if (typeof window !== "undefined") {
      const props = this.property.split(".");
      if (props.length === 1) {
        return typeof window[props[0] as never] !== "undefined";
      } else {
        return (
          typeof window[props[0] as never] !== "undefined" &&
          typeof window[props[0] as never][props[1] as never] !== "undefined"
        );
      }
    }
    return false;
  }

  async requestAccounts(): Promise<string[]> {
    const accounts = await this.getProviderOrThrow().requestAccounts();
    return accounts;
  }

  async getAccounts(): Promise<string[]> {
    const accounts = await this.getProviderOrThrow().getAccounts();
    return accounts;
  }
  async getPublicKey(): Promise<string> {
    return this.getProviderOrThrow().getPublicKey();
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
    const provider = this.getProvider();
    return provider?.on?.(event, handler);
  }
  removeListener(event: string, handler: (data?: unknown) => void) {
    const provider = this.getProvider();
    return provider?.removeListener?.(event, handler);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  getProvider(): any {
    if (this.isReady()) {
      const props = this.property.split(".");
      if (props.length === 1) {
        return window[props[0] as never];
      } else {
        return window[props[0] as never][props[1] as never];
      }
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
    return this.getProviderOrThrow().switchNetwork(network);
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
