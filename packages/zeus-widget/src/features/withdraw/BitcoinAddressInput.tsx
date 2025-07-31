import { useEffect, useRef } from "react";

import { useBitcoinWallet } from "@zeus-widget/bitcoin-wallet";

import BitcoinWalletSelector from "@/components/BitcoinWalletSelector";
import Icon from "@/components/Icon";

export interface BitcoinAddressInputProps {
  address?: string;
  onChange?: (address: string) => void;
}

function BitcoinAddressInput({ address, onChange }: BitcoinAddressInputProps) {
  const bitcoinWallet = useBitcoinWallet();
  const connected = !!bitcoinWallet?.p2tr;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const disconnectWallet = () => {
    bitcoinWallet.disconnect();
    onChangeRef.current?.("");
  };

  useEffect(() => {
    if (!bitcoinWallet?.p2tr) return;
    onChangeRef.current?.(bitcoinWallet.p2tr);
  }, [bitcoinWallet?.p2tr]);

  return (
    <div className="zeus:p-[8px] zeus:bg-[#16161B] zeus:border zeus:border-[#8B8A9E26] zeus:border-solid zeus:rounded-[12px] zeus:body-body1-semibold zeus:text-start zeus:wrap-anywhere zeus:gap-[12px] zeus:flex zeus:flex-row zeus:items-center">
      <input
        value={address}
        disabled={connected}
        className="zeus:pl-[10px] zeus:py-[6px] zeus:grow zeus:outline-none"
        onChange={(event) => onChange?.(event.target.value)}
      />

      {connected && (
        <button
          type="button"
          className="zeus:p-[9px] zeus:border zeus:border-solid zeus:border-[#8B8A9E33] zeus:rounded-[8px] zeus:text-[#C7C5D1] zeus:hover:text-[#F1F0F3] zeus:bg-[#2C2C36] zeus:hover:bg-[#272730] zeus:shrink-0 zeus:cursor-pointer zeus:transition-colors"
          onClick={() => disconnectWallet()}
        >
          <Icon variant="disconnect" />
        </button>
      )}

      {!connected && (
        <BitcoinWalletSelector>
          <BitcoinWalletSelector.Trigger asChild>
            <button
              type="button"
              className="zeus:px-[12px] zeus:py-[6px] zeus:border zeus:border-solid zeus:border-[#8B8A9E33] zeus:rounded-[8px] zeus:text-[#C7C5D1] zeus:hover:text-[#F1F0F3] zeus:bg-[#2C2C36] zeus:hover:bg-[#272730] zeus:shrink-0 zeus:cursor-pointer zeus:shadow-[0px_-4px_4px_0px_#8B8A9E1F_inset] zeus:transition-colors"
            >
              Connect
            </button>
          </BitcoinWalletSelector.Trigger>
        </BitcoinWalletSelector>
      )}
    </div>
  );
}

export default BitcoinAddressInput;
