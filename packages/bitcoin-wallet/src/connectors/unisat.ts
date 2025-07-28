import { type WalletMetadata } from "./base";
import { InjectedConnector } from "./injected";

import unisatIconSource from "@/assets/unisat.svg";
import { BitcoinNetwork } from "@/types";
import { WalletId } from "@/types";

export class UniSatConnector extends InjectedConnector {
  readonly networks = [BitcoinNetwork.Mainnet, BitcoinNetwork.Testnet];
  readonly metadata: WalletMetadata = {
    id: WalletId.UniSat,
    name: "Unisat",
    icon: unisatIconSource,
    downloadUrl: "https://unisat.io/",
  };

  constructor() {
    super("unisat");
    this.isReady = () => {
      return typeof window !== "undefined" && window.unisat !== undefined;
    };
  }
}
