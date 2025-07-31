import Button from "../Button";
import Modal, { ModalActions, ModalBody, ModalHeader } from "./Modal";

export default function ClaimTestnetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  return (
    <Modal
      width={450}
      isOpen={isOpen}
      onClose={onClose}
      backdropType="overrideHeader"
    >
      <ModalHeader onClose={onClose} title="Claim Test Bitcoin (tBTC)" />
      <ModalBody>
        <ul className="leading-[150%] list-inside px-16 py-apollo-10 rounded-[6px] text-left list-disc bg-sys-color-background-light/50 w-full">
          <li>Free test tokens for development and testing</li>
          <li>No real monetary value</li>
          <li>Works only on testnet (regtest)</li>
        </ul>
      </ModalBody>
      <ModalActions>
        <Button theme="primary" label="Claim" size="md" className="w-full" />
      </ModalActions>
    </Modal>
  );
}
