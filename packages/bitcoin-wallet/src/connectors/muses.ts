
import { type WalletMetadata } from "./base";
import { InjectedConnector } from "./injected";

import musesIconSource from "@/assets/muses.svg";
import { BitcoinNetwork } from "@/types";
import { WalletId } from "@/types";

export class MusesConnector extends InjectedConnector {
  readonly networks = [BitcoinNetwork.Regtest];
  readonly metadata: WalletMetadata = {
    id: WalletId.Muses,
    name: "Muses Wallet",
    icon: musesIconSource,
    downloadUrl:
      "https://chromewebstore.google.com/detail/muses-wallet-for-apollo-t/eidehbdehdaggoophgjhkplcbjhelfkc",
  };

  constructor() {
    super("muses");
    this.isReady = () => {
      return typeof window !== "undefined" && window.muses !== undefined;
    };
  }
}
