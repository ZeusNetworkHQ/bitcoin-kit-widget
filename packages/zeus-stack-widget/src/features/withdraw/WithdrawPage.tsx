import { useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import BigNumber from "bignumber.js";

import WithdrawDetails from "./WithdrawDetails";
import ZBtcInputField from "./ZBtcInputField";

import Icon from "@/components/Icon";
import ZeusButton from "@/components/ZeusButton";
import useConnectWallet from "@/hooks/useConnectWallet";
import useZBtcBalance from "@/hooks/useZBtcBalance";
import { cn } from "@/utils";
import { GtmEvent, GtmEventType } from "@/utils/gtm";

function WithdrawPage() {
  const wallet = useWallet();
  const [amount, setAmount] = useState<BigNumber>(() => new BigNumber(0));
  const [ready, setReady] = useState(false);

  const { data: zBtcBalance, isLoading: isLoadingZBtcBalance } = useZBtcBalance(
    wallet.publicKey,
  );

  const connectSolanaWallet = useConnectWallet();

  const handleCancel = async () => {
    setReady(false);
  };

  const reset = () => {
    setReady(false);
    setAmount(new BigNumber(0));
  };

  if (ready) {
    return (
      <WithdrawDetails
        amount={amount}
        onCancel={handleCancel}
        onSuccess={reset}
      />
    );
  }

  return (
    <div className="zeus:w-full zeus:flex zeus:flex-col zeus:items-center zeus:px-[4px] zeus:gap-[8px]">
      <div className="zeus:w-full zeus:flex zeus:flex-col zeus:items-start zeus:gap-[4px]">
        <div className="zeus:flex zeus:items-center zeus:gap-[8px] zeus:justify-between zeus:w-full">
          <p className="zeus:body-body2-medium zeus:text-[#C7C5D1] zeus:pl-[8px]">
            Enter Amount
          </p>

          <p
            className={cn(
              "zeus:body-body2-semibold zeus:text-[#8B8A9E] zeus:pr-[8px] zeus:transition-colors zeus:flex zeus:flex-row zeus:items-center zeus:gap-[6px]",
              wallet.connected && "zeus:text-[#F1F0F3]",
            )}
          >
            <Icon variant="wallet-sm" size={14} />
            {!wallet.connected && "Connect Wallet"}
            {wallet.connected && isLoadingZBtcBalance && "Connecting Wallet..."}
            {wallet.connected &&
              !isLoadingZBtcBalance &&
              `${zBtcBalance.toFormat()} zBTC`}
          </p>
        </div>

        <ZBtcInputField
          amount={amount}
          maxAmount={zBtcBalance}
          onChange={setAmount}
          disabled={!wallet.connected}
          className="zeus:w-full"
        />
      </div>

      {!wallet.connected && (
        <ZeusButton
          variant="primary"
          className="zeus:w-full"
          data-gtm-type={GtmEventType.Click}
          data-gtm-event={GtmEvent.ClickConnectWallet}
          onClick={() => connectSolanaWallet().catch(() => {})}
        >
          <Icon variant="wallet" />
          Connect Wallet
        </ZeusButton>
      )}

      {wallet.connected && !ready && (
        <ZeusButton
          disabled={amount.lt("0.0001")}
          variant="primary"
          className="zeus:w-full"
          data-gtm-type={GtmEventType.Click}
          data-gtm-event={GtmEvent.ClickWithdraw}
          onClick={() => setReady(true)}
        >
          Withdraw
        </ZeusButton>
      )}
    </div>
  );
}

export default WithdrawPage;
