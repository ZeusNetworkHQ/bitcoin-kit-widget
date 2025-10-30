import { useEffect, useRef, useState } from "react";

import { useBitcoinWallet } from "@zeus-network/bitcoin-wallet-adapter";

import BitcoinWalletSelector from "@/components/BitcoinWalletSelector";
import Icon from "@/components/Icon";
import { useErrorHandler } from "@/contexts/ConfigContext";
import { truncateMiddle } from "@/utils";
import { GtmEvent, GtmEventType } from "@/utils/gtm";

export interface BitcoinAddressInputProps {
  address?: string;
  onChange?: (address: string) => void;
}

function BitcoinAddressInput({ address, onChange }: BitcoinAddressInputProps) {
  const bitcoinWallet = useBitcoinWallet();
  const [inputFocused, setInputFocused] = useState(false);
  const connected = !!bitcoinWallet?.address;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleError = useErrorHandler();

  const disconnectWallet = () => {
    bitcoinWallet.disconnect();
    onChangeRef.current?.("");
  };

  const getFieldButton = () => {
    if (connected)
      return (
        <button
          type="button"
          className="zeus:p-[9px] zeus:border zeus:border-solid zeus:border-[#8B8A9E33] zeus:rounded-[8px] zeus:text-[#C7C5D1] zeus:hover:text-[#F1F0F3] zeus:bg-[#2C2C36] zeus:hover:bg-[#272730] zeus:shrink-0 zeus:cursor-pointer zeus:transition-colors"
          onClick={() => disconnectWallet()}
        >
          <Icon variant="disconnect" />
        </button>
      );

    if (!address?.trim())
      return (
        <BitcoinWalletSelector onError={handleError}>
          <BitcoinWalletSelector.Trigger asChild>
            <button
              type="button"
              data-gtm-type={GtmEventType.Click}
              data-gtm-event={GtmEvent.ClickWithdrawBitcoinWallet}
              className="zeus:px-[12px] zeus:py-[6px] zeus:border zeus:border-solid zeus:border-[#8B8A9E33] zeus:rounded-[8px] zeus:text-[#C7C5D1] zeus:hover:text-[#F1F0F3] zeus:bg-[#2C2C36] zeus:hover:bg-[#272730] zeus:shrink-0 zeus:cursor-pointer zeus:shadow-[0px_-4px_4px_0px_#8B8A9E1F_inset] zeus:transition-colors"
            >
              Connect
            </button>
          </BitcoinWalletSelector.Trigger>
          <BitcoinWalletSelector.Portal>
            <BitcoinWalletSelector.Content />
          </BitcoinWalletSelector.Portal>
        </BitcoinWalletSelector>
      );

    return (
      <button
        type="button"
        onClick={() => onChange?.("")}
        className="zeus:cursor-pointer zeus:px-[12px]"
      >
        <Icon variant="clear" size={12} className="zeus:text-[#8B8A9E]" />
      </button>
    );
  };

  useEffect(() => {
    if (!bitcoinWallet?.address) return;
    onChangeRef.current?.(bitcoinWallet.address);
  }, [bitcoinWallet?.address]);

  return (
    <div className="zeus:p-[8px] zeus:bg-[#16161B] zeus:border zeus:border-[#8B8A9E26] zeus:border-solid zeus:rounded-[12px] zeus:body-body1-semibold zeus:text-start zeus:wrap-anywhere zeus:gap-[12px] zeus:flex zeus:flex-row zeus:items-center">
      <input
        value={inputFocused ? address : truncateMiddle(address || "", 22, 11)}
        disabled={connected}
        className="zeus:pl-[10px] zeus:py-[6px] zeus:grow zeus:outline-none zeus:min-h-[38px]"
        placeholder="Enter Bitcoin Address"
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onChange={(event) => onChange?.(event.target.value)}
      />

      {getFieldButton()}
    </div>
  );
}

export default BitcoinAddressInput;
