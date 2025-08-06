import { AegleApi } from "@zeus-network/client";
import { BitcoinNetwork } from "@zeus-network/zeus-stack-widget";
import {
  BitcoinWalletProvider,
  BitcoinWalletSelector,
  useBitcoinWallet,
} from "@zeus-network/zeus-stack-widget/bitcoin-wallet-adapter";
import { useMemo, useState } from "react";

import Button from "../Button";
import Icon from "../Icon/Icon";

import Modal, { ModalActions, ModalBody, ModalHeader } from "./Modal";

import { useWidgetConfig } from "@/providers/WidgetConfigProvider";

function ClaimTestnetModalContent({ onClose }: { onClose?: () => void }) {
  const bitcoinWallets = useBitcoinWallet();

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const aegleApi = useMemo(
    () => new AegleApi({ core: { bitcoinNetwork: BitcoinNetwork.Regtest } }),
    [],
  );

  const handleClose = () => {
    onClose?.();
    if (!bitcoinWallets.connected) {
      bitcoinWallets.disconnect();
    }
  };

  const handleCloseErrorAlert = () => setError(null);

  const handleCloseCompletedAlert = () => {
    setCompleted(false);
  };

  const claimTestnetBitcoin = async () => {
    if (!bitcoinWallets.connected) {
      throw new Error("No connected Bitcoin wallet");
    }
    if (!bitcoinWallets.p2tr) {
      throw new Error("No P2TR address available");
    }

    try {
      setLoading(true);
      await aegleApi.claimTestnetBitcoin({
        bitcoinP2trAddress: bitcoinWallets.p2tr,
      });
      setCompleted(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const completeAlertElement = (
    <Modal
      isOpen={completed}
      backdropType="overrideHeader"
      onClose={handleCloseCompletedAlert}
    >
      <ModalHeader
        title="You successfully claimed"
        onClose={handleCloseCompletedAlert}
      />

      <ModalBody className="pt-[24px]">
        <div className="flex flex-row items-center gap-[8px]">
          <Icon name="TBtc" className="h-[24px] w-[24px]" />
          <p className="headline-headline4 text-sys-color-text-primary">0.05</p>
          <p className="body-body2-medium text-sys-color-text-mute">tBTC</p>
        </div>
      </ModalBody>
    </Modal>
  );

  const errorAlertElement = (
    <Modal
      isOpen={!!error}
      backdropType="overrideHeader"
      onClose={handleCloseErrorAlert}
    >
      <ModalHeader title="Error" onClose={handleCloseErrorAlert} />

      <ModalBody>
        <p className="body-body2-medium text-sys-color-text-secondary">
          You have reached the daily claim limit. Please try again tomorrow.
        </p>
      </ModalBody>
    </Modal>
  );

  return (
    <>
      <ModalHeader onClose={handleClose} title="Claim Test Bitcoin (tBTC)" />
      <ModalBody>
        <ul className="leading-[150%] list-inside px-16 py-apollo-10 rounded-[6px] text-left list-disc bg-sys-color-background-light/50 w-full">
          <li>Free test tokens for development and testing</li>
          <li>No real monetary value</li>
          <li>Works only on testnet (regtest)</li>
        </ul>
      </ModalBody>

      <ModalActions>
        {bitcoinWallets.connected ? (
          <Button
            theme="primary"
            label="Claim"
            size="md"
            className="w-full"
            isLoading={loading}
            onClick={() => claimTestnetBitcoin()}
          />
        ) : (
          <BitcoinWalletSelector>
            <BitcoinWalletSelector.Trigger asChild>
              <Button
                theme="primary"
                label="Connect Bitcoin Wallet"
                size="md"
                className="w-full"
              />
            </BitcoinWalletSelector.Trigger>
          </BitcoinWalletSelector>
        )}
      </ModalActions>

      {completeAlertElement}
      {errorAlertElement}
    </>
  );
}

export default function ClaimTestnetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const { bitcoinWallets = [] } = useWidgetConfig();

  return (
    <Modal
      width={450}
      isOpen={isOpen}
      onClose={onClose}
      backdropType="overrideHeader"
    >
      <BitcoinWalletProvider
        connectors={bitcoinWallets}
        network={BitcoinNetwork.Regtest}
      >
        <ClaimTestnetModalContent onClose={onClose} />
      </BitcoinWalletProvider>
    </Modal>
  );
}
