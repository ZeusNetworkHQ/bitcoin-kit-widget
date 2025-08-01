import { useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { MINIMUM_DEPOSIT_AMOUNT_BTC } from "@zeus-widget/core";
import BigNumber from "bignumber.js";

import BtcInputField from "./BtcInputField";
import CreateApolloAccount from "./CreateApolloAccount";
import DepositDetails from "./DepositDetails";

import Icon from "@/components/Icon";
import ZeusButton from "@/components/ZeusButton";
import useConnectWallet from "@/hooks/useConnectWallet";
import useEdra from "@/hooks/useEdra";

function DepositPage() {
  const wallet = useWallet();
  const [amount, setAmount] = useState(() => new BigNumber(0));
  const [ready, setReady] = useState(false);

  const connectSolanaWallet = useConnectWallet();

  const {
    data: edra,
    mutate: refreshEdra,
    isLoading,
  } = useEdra(wallet.publicKey);

  const startToDeposit = async () => {
    try {
      if (isLoading) await refreshEdra();
      setReady(true);
    } catch {
      // Do nothing
    }
  };

  const reset = () => {
    setReady(false);
    setAmount(new BigNumber(0));
  };

  const resetReadyState = () => {
    setReady(false);
  };

  if (!wallet.connected && !wallet.publicKey && ready) {
    setReady(false);
  }

  if (ready && edra)
    return (
      <DepositDetails
        amount={amount}
        onSuccess={reset}
        onRequestToChangeAmount={resetReadyState}
      />
    );

  if (ready && !edra)
    return <CreateApolloAccount onComplete={() => refreshEdra()} />;

  return (
    <div className="zeus:w-full zeus:flex zeus:flex-col zeus:items-center zeus:px-[4px] zeus:gap-[8px]">
      <div className="zeus:w-full zeus:flex zeus:flex-col zeus:items-start zeus:gap-[4px]">
        <p className="zeus:body-body2-medium zeus:text-[#C7C5D1] zeus:pl-[8px]">
          Enter Amount
        </p>

        <BtcInputField
          amount={amount}
          onChange={setAmount}
          disabled={!wallet.connected}
          className="zeus:w-full"
        />
      </div>

      {!wallet.connected && (
        <ZeusButton
          variant="primary"
          className="zeus:w-full"
          onClick={() => connectSolanaWallet()}
        >
          <Icon variant="wallet" />
          Connect Wallet
        </ZeusButton>
      )}

      {wallet.connected && !ready && (
        <ZeusButton
          disabled={amount.lt(MINIMUM_DEPOSIT_AMOUNT_BTC) || isLoading}
          variant="primary"
          className="zeus:w-full"
          onClick={startToDeposit}
        >
          Deposit
        </ZeusButton>
      )}
    </div>
  );
}

export default DepositPage;
