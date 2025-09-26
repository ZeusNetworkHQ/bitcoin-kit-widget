import { createContext, useContext, useMemo } from "react";

import {
  Connectors,
  useBitcoinWallet,
} from "@zeus-network/bitcoin-wallet-adapter";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import type { DialogContentProps } from "@radix-ui/react-dialog";

import PortalHub from "@/contexts/PortalHub";
import { cn } from "@/utils/misc";

export interface BitcoinWalletSelectorContextValue {
  onConnected?: (connector: Connectors.BaseConnector) => void;
  onError?: (error: Error) => void;
}

const BitcoinWalletSelectorContext =
  createContext<BitcoinWalletSelectorContextValue>({});

function BitcoinWalletSelector({
  children,
  onConnected,
  onError,
}: React.PropsWithChildren<BitcoinWalletSelectorContextValue>) {
  return (
    <Dialog>
      <BitcoinWalletSelectorContext.Provider
        value={useMemo(
          () => ({ onConnected, onError }),
          [onConnected, onError],
        )}
      >
        {children}
      </BitcoinWalletSelectorContext.Provider>
    </Dialog>
  );
}

export type BitcoinWalletSelectorContentProps = Omit<
  DialogContentProps,
  "children"
>;

BitcoinWalletSelector.Content = function BitcoinWalletSelectorContent({
  className,
  ...props
}: BitcoinWalletSelectorContentProps) {
  const { onConnected, onError } = useContext(BitcoinWalletSelectorContext);

  const wallet = useBitcoinWallet();

  const connect = async (connector: Connectors.BaseConnector) => {
    try {
      await wallet.connect(connector);
      onConnected?.(connector);
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
      }
    }
  };

  return (
    <>
      <DialogOverlay className="zeus:w-screen zeus:h-screen zeus:left-0 zeus:top-0 zeus:bg-[#0F0F1280] zeus:backdrop-blur-[8px]" />

      <DialogContent
        {...props}
        className={cn(
          "zeus:bg-[#202027] zeus:border zeus:border-[#8B8A9E33] zeus:border-solid zeus:rounded-[12px] zeus:p-0 zeus:w-[360px]",
          className,
        )}
      >
        <DialogTitle className="zeus:p-[20px] zeus:body-body1-semibold zeus:text-[#C7C5D1] zeus:text-start">
          Connect a Bitcoin Wallet
        </DialogTitle>

        <div className="zeus:px-[12px] zeus:pb-[12px]">
          <div className="zeus:bg-[#16161B] zeus:px-[8px] zeus:py-[12px] zeus:rounded-[12px] zeus:border zeus:border-solid zeus:border-[#8B8A9E26]">
            {wallet.connectors.map((connector) => (
              <div
                key={connector.metadata.name}
                className="zeus:py-[6px] zeus:flex zeus:flex-row zeus:items-center zeus:gap-[8px] zeus:hover:bg-[#202027] zeus:transition-colors zeus:cursor-pointer zeus:rounded-[8px]"
                onClick={() => {
                  if (connector.isReady()) connect(connector);
                  else window.open(connector.metadata.downloadUrl, "_blank");
                }}
              >
                <img
                  src={connector.metadata.icon}
                  className="zeus:h-[18px] zeus:w-[18px] zeus:mx-[4px]"
                />
                <p>{connector.metadata.name}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </>
  );
};

BitcoinWalletSelector.Trigger = DialogTrigger;

BitcoinWalletSelector.Portal = PortalHub.Portal;

export default BitcoinWalletSelector;
