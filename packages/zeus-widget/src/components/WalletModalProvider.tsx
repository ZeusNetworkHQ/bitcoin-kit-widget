import { useEffect } from "react";

import {
  useWalletModal,
  WalletModalProvider as WalletModalProviderBase,
  type WalletModalProviderProps,
} from "@solana/wallet-adapter-react-ui";

function BodyScrollAdjustment() {
  const { visible } = useWalletModal();

  useEffect(() => {
    // [NOTE]: @solana/wallet-adapter-react-ui will set body overflow to hidden when the modal is open,
    // and this collides with the modal's own logic. This is a workaround to ensure the body overflow
    // is reset when the modal closes.
    if (!visible && globalThis.document?.body.style.overflow === "hidden") {
      globalThis.document.body.style.overflow = "";
    }
  }, [visible]);

  return null;
}

function WalletModalProvider({ children, ...props }: WalletModalProviderProps) {
  return (
    <WalletModalProviderBase className="zeus:wallet-adapter-modal" {...props}>
      {children}
      <BodyScrollAdjustment />
    </WalletModalProviderBase>
  );
}

export default WalletModalProvider;
