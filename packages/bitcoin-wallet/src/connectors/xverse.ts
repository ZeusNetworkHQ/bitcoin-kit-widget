// * This will only connect with Xverse wallet, if you use the request from sats-connect, it will pop up a dialog asking which wallet to connect

import EventEmitter from "events";

import { AddressType, request } from "@sats-connect/core";
import * as bitcoin from "bitcoinjs-lib";
import { AddressPurpose, getProviderById } from "sats-connect";
import {
  BitcoinNetworkType,
  type SendBtcTransactionOptions,
  type SignMessageOptions,
} from "sats-connect";

import { BaseConnector, type WalletMetadata } from "./base";

import xverseIconSource from "@/assets/xverse.svg";
import { WalletId } from "@/types";
import { BitcoinNetwork } from "@/types";

export class XverseConnector extends BaseConnector {
  networks = [
    BitcoinNetwork.Mainnet,
    BitcoinNetwork.Testnet,
    BitcoinNetwork.Regtest,
  ];
  _network: BitcoinNetworkType.Mainnet | BitcoinNetworkType.Testnet =
    BitcoinNetworkType.Mainnet;
  _event = new EventEmitter();
  constructor() {
    super();
    this._event.setMaxListeners(100);
  }
  readonly metadata: WalletMetadata = {
    id: WalletId.Xverse,
    name: "Xverse",
    icon: xverseIconSource,
    downloadUrl: "https://www.xverse.app",
  };

  isReady(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.XverseProviders?.BitcoinProvider !== "undefined"
    );
  }

  // * request "wallet_connect" actually return the same as "wallet_getAccount"
  // * the difference is that "wallet_connect" will pop up a consent dialog asked for permission to connect to the wallet
  private connectToWallet = async () => {
    const res = await request("wallet_connect", {
      message: "Address for receiving Ordinals",
      addresses: [AddressPurpose.Ordinals], // get Ordinals address only Prevent error for our system
    } as never);

    if (res.status === "error") {
      console.error("Error connecting to wallet", JSON.stringify(res.error));
      throw new Error("Error connecting to wallet, details in terminal.");
    }

    return res;
  };

  private loadAccounts = async () => {
    // if already connected, return the addresses
    let res = await request("wallet_getAccount", undefined);

    if (res.status === "error") {
      // which means not connected
      console.error("Error getting account", JSON.stringify(res.error));
      try {
        // connect to Xverse wallet
        res = await this.connectToWallet();
      } catch (e) {
        console.error("Error connecting to wallet", e);
        throw new Error("Error connecting to wallet, details in terminal.");
      }
    }
    return res.result.addresses;
  };

  async sendInscription(): Promise<{ txid: string }> {
    throw new Error("Unsupported");
  }

  async requestAccounts(): Promise<string[]> {
    if (!this.isReady()) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    const addresses = await this.loadAccounts();
    // only response p2tr (Ordinals) address
    const filteredAddresses = addresses.filter(
      (item) => item.addressType === AddressType.p2tr
    );
    return filteredAddresses.map((item) => item.address);
  }
  async getAccounts(): Promise<string[]> {
    if (!this.isReady()) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    const addresses = await this.loadAccounts();
    return addresses.map((item) => item.address);
  }
  async getPublicKey(): Promise<string> {
    if (!this.isReady()) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    const addresses = await this.loadAccounts();

    if (addresses) {
      // force filter p2tr (Ordinals) address
      return (
        addresses.find((address) => address.addressType === AddressType.p2tr)
          ?.publicKey ?? ""
      );
    } else {
      return "";
    }
  }
  async signMessage(signStr: string): Promise<string> {
    if (!this.isReady()) {
      throw new Error(`${this.metadata.name} is not install!`);
    }

    const { signMessage } = await import("sats-connect");

    const walletAddress = await this.loadAccounts();
    const inputAddress = walletAddress.find(
      (item) => item.addressType == AddressType.p2tr
    );

    if (!inputAddress) {
      throw new Error("No input address found");
    }

    const sig = await new Promise<string>((resolve, reject) => {
      const signMessageOptions: SignMessageOptions = {
        payload: {
          network: {
            type: this._network,
          },
          address: inputAddress.address,
          message: signStr,
        },
        onFinish: (response) => {
          resolve(response);
        },
        onCancel: () => {
          reject({
            code: 4001,
            message: "User rejected the request.",
          });
        },
      };
      signMessage(signMessageOptions).catch((e) => {
        reject(e);
      });
    });

    const modifiedSig = Buffer.from(sig, "base64");
    modifiedSig[0] = 31 + ((modifiedSig[0] - 31) % 4);
    return modifiedSig.toString("base64");
  }
  /**
   *
   * @param psbt must be hex string
   * @param opt options
   * @returns hex string
   */
  async signPsbt(
    psbt: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _opt?: Record<string, unknown>
  ): Promise<string> {
    const psbtParsed = bitcoin.Psbt.fromHex(psbt);

    const inputLength = psbtParsed.data.inputs.length;
    const walletAddress = await this.loadAccounts();
    const inputAddress = walletAddress.find(
      (item) => item.addressType == AddressType.p2tr
    );

    if (!inputAddress) {
      throw new Error("No input address found");
    }

    // ref: https://docs.xverse.app/sats-connect/bitcoin-methods/signpsbt
    const signInputs: { [key: string]: number[] } = {};
    signInputs[inputAddress.address] = Array.from(
      { length: inputLength },
      (_, i) => i
    );

    const response = await request("signPsbt", {
      psbt: psbtParsed.toBase64(),
      signInputs,
      broadcast: false,
    });

    if (response.status == "error") {
      throw new Error("error");
    }
    // response psbt is in base64 format need to convert to hex
    return Buffer.from(response.result.psbt, "base64").toString("hex");
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
  on(event: string, handler: (data?: unknown) => void) {
    return this._event.on(event, handler);
  }
  removeListener(event: string, handler: (data?: unknown) => void) {
    return this._event.removeListener(event, handler);
  }
  // TODO: entry point for provider, not sure what to do with provider since we directly call the wallet through json-rpc method
  getProvider() {
    try {
      // FIXME: maybe move the provider id into metadata?
      return getProviderById("XverseProviders.BitcoinProvider");
    } catch (e) {
      console.error("Xverse Connector getProvider error", e);
      return null;
    }
  }
  async getNetwork(): Promise<"livenet" | "testnet"> {
    if (!this.isReady()) {
      throw new Error(`${this.metadata.name} is not install!`);
    }

    // ref: https://docs.xverse.app/sats-connect/wallet-methods/wallet_getnetwork
    // ! must grant permission to access the function
    const res = await request("wallet_getNetwork", undefined);
    // if success response will be like
    // {
    //   "status": "success",
    //   "result": {
    //       "bitcoin": {
    //           "name": "Mainnet"
    //       },
    //       "stacks": {
    //           "name": "Mainnet"
    //       }
    //   }
    // }
    if (res.status === "error" || !res.result) {
      console.error("Error getting network", JSON.stringify(res));
      throw new Error("Error getting network");
    }

    this._network =
      res.result.bitcoin.name === "Mainnet"
        ? BitcoinNetworkType.Mainnet
        : BitcoinNetworkType.Testnet;

    return this._network === BitcoinNetworkType.Mainnet ? "livenet" : "testnet";
  }
  async switchNetwork(): Promise<void> {
    throw new Error("Unsupported");
  }
  async sendBitcoin(toAddress: string, satoshis: number): Promise<string> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error(`${this.metadata.name} is not install!`);
    }
    const { sendBtcTransaction } = await import("sats-connect");

    const walletAddress = await this.loadAccounts();
    const inputAddress = walletAddress.find(
      (item) => item.addressType == AddressType.p2tr
    );

    if (!inputAddress) {
      throw new Error("No input address found");
    }

    const result = await new Promise<string>((resolve, reject) => {
      const sendBtcOptions: SendBtcTransactionOptions = {
        payload: {
          network: {
            type: this._network,
          },
          recipients: [
            {
              address: toAddress,
              amountSats: BigInt(satoshis),
            },
          ],
          senderAddress: inputAddress.address,
        },
        onFinish: (response) => {
          resolve(response);
        },
        onCancel: () => {
          reject({
            code: 4001,
            message: "User rejected the request.",
          });
        },
      };
      sendBtcTransaction(sendBtcOptions).catch((e) => reject(e));
    });
    return result;
  }
  disconnect() {
    request("wallet_disconnect", undefined);
  }
}
