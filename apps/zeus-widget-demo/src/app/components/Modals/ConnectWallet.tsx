import Icon from "../Icon/Icon";
import { IconName } from "../Icon/icons";
import Modal, { ModalHeader } from "./Modal";

export default function ConnectWalletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const wallets = [
    {
      name: "Phantom Wallet",
      icon: "Phantom",
      status: "detected",
    },
    {
      name: "Muses Wallet",
      icon: "Muses",
      status: "install",
    },
  ];
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
          Connect a Bitcoin Wallet
        </span>
      </div>
      <div className="px-8">
        <div className="bg-sys-color-background-card rounded-12 border border-sys-color-text-mute/20 p-apollo-6 flex flex-col gap-y-8">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="cursor-pointer flex items-center justify-between rounded-[6px] py-8 px-12 hover:bg-sys-color-background-light transition duration-200"
            >
              <div className="flex items-center gap-x-12">
                <Icon name={wallet.icon as IconName} />
                <span className="text-sys-color-text-primary body-body1-semibold">
                  {wallet.name}
                </span>
              </div>
              <span className="body-body2-medium text-sys-color-text-mute capitalize">
                {wallet.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
