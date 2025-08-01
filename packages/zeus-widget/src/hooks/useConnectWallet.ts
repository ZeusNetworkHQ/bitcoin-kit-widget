import { useCallback, useRef } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function useConnectWallet() {
  const wallet = useWallet();
  const walletModal = useWalletModal();

  const resolveRef = useRef<() => void>();
  const rejectRef = useRef<() => void>();

  if (wallet.connected) {
    resolveRef.current?.();
    resolveRef.current = undefined;
    rejectRef.current = undefined;
  }

  return useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (wallet.connected) {
        resolve();
        return;
      }

      if (rejectRef.current) rejectRef.current();

      resolveRef.current = resolve;
      rejectRef.current = reject;

      walletModal.setVisible(true);
    });
  }, [wallet, walletModal]);
}

export default useConnectWallet;
