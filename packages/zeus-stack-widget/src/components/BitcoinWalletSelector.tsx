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

import { cn } from "@/utils/misc";

export interface BitcoinWalletSelectorProps extends DialogContentProps {
  children: React.ReactNode;
  onConnected?: (connector: Connectors.BaseConnector) => void;
}

function BitcoinWalletSelector({
  children,
  className,
  onConnected,
  ...props
}: BitcoinWalletSelectorProps) {
  const wallet = useBitcoinWallet();

  const connect = async (connector: Connectors.BaseConnector) => {
    await wallet.connect(connector);
    onConnected?.(connector);
  };

  return (
    <Dialog>
      {children}

      <DialogOverlay className="zeus:w-[150vw] zeus:h-[150vh] zeus:left-[-50vw] zeus:top-[-50vh] zeus:bg-[#0F0F1280] zeus:backdrop-blur-[8px]" />

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
    </Dialog>
  );
}

BitcoinWalletSelector.Trigger = DialogTrigger;

export default BitcoinWalletSelector;
