import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

import Modal, { ModalHeader } from "./Modal";

export default function ConnectWalletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const wallet = useWallet();

  const wallets = wallet.wallets.filter(
    (wallet) => wallet.readyState !== WalletReadyState.Unsupported
  );

  const connectWallet = async (walletName: WalletName) => {
    wallet.select(walletName);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      cardClassName="!p-0 !pb-8 !pt-44 sm:!pt-20 sm:!absolute gap-y-0 !h-max [background:linear-gradient(180deg,#16161B_0%,rgba(15,15,18,1)_100%)]"
      className="max-w-[1180px] left-1/2 -translate-x-1/2"
      position={{ right: 24, top: 64 }}
      backdropType="default"
      isResponsive={true}
    >
      <ModalHeader onClose={onClose} />
      <div className="px-20 pb-16">
        <span className="body-body1-semibold text-sys-color-text-secondary">
          Connect a Solana Wallet
        </span>
      </div>
      <div className="px-8">
        <div className="bg-sys-color-background-card rounded-12 border border-sys-color-text-mute/20 p-apollo-6 flex flex-col gap-y-8">
          {wallets.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={async () => {
                if (wallet.readyState === WalletReadyState.NotDetected) {
                  return window.open(wallet.adapter.url, "_blank");
                }
                await connectWallet(wallet.adapter.name);
                onClose?.();
              }}
              className="cursor-pointer flex items-center justify-between rounded-[6px] py-8 px-12 hover:bg-sys-color-background-light transition duration-200"
            >
              <div className="flex items-center gap-x-12">
                <Image
                  unoptimized
                  width={18}
                  height={18}
                  src={wallet.adapter.icon}
                  alt={`${wallet.adapter.name} icon`}
                />
                <span className="text-sys-color-text-primary body-body1-semibold">
                  {wallet.adapter.name}
                </span>
              </div>
              <span className="body-body2-medium text-sys-color-text-mute capitalize">
                {wallet.readyState !== WalletReadyState.NotDetected
                  ? "Detected"
                  : "Install"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
