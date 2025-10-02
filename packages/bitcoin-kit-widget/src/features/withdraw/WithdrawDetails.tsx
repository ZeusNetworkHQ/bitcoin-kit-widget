import { useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useBitcoinWallet } from "@zeus-network/bitcoin-wallet-adapter";
import {
  MINIMUM_WITHDRAW_AMOUNT_ZBTC,
  WalletConnectionError,
  WITHDRAW_SERVICE_FEE_RATE,
  WithdrawError,
  ZeusLayer,
  calculateInfrastructureFee,
} from "@zeus-network/client";
import BigNumber from "bignumber.js";

import BitcoinAddressInput from "./BitcoinAddressInput";

import ZeusButton from "@/components/ZeusButton";
import {
  useErrorHandler,
  useSuccessHandler,
  useZeusService,
} from "@/contexts/ConfigContext";
import { GtmEvent, GtmEventType } from "@/utils/gtm";

function WithdrawDetails({
  amount,
  onCancel,
  onSuccess,
}: {
  amount: BigNumber;
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const [address, setAddress] = useState("");
  const wallet = useWallet();
  const bitcoinWallet = useBitcoinWallet();
  const zeusLayer = useZeusService(ZeusLayer);

  const handleError = useErrorHandler();
  const handleSuccess = useSuccessHandler();

  const runWithdraw = async () => {
    if (!wallet.publicKey || !wallet.signTransaction)
      throw new WalletConnectionError();

    if (amount.lte(MINIMUM_WITHDRAW_AMOUNT_ZBTC)) {
      handleError(
        new WithdrawError(
          `Amount must be greater than ${MINIMUM_WITHDRAW_AMOUNT_ZBTC} zBTC`,
        ),
      );
      return;
    }

    try {
      await zeusLayer.withdraw().sign(wallet, {
        bitcoinAddress: address,
        amount: amount.toNumber(),
      });

      onSuccess?.();
      bitcoinWallet.disconnect();
      handleSuccess("Withdrawal initiated successfully.");
    } catch (error) {
      if (error instanceof Error) {
        handleError(new WithdrawError(error));
      }
    }
  };

  return (
    <div className="zeus:flex zeus:flex-col zeus:text-start">
      <p className="zeus:heading-heading6 zeus:text-[#FFFFFF] zeus:mb-[8px]">
        Confirm BTC Withdrawal
      </p>

      <div className="zeus:flex zeus:flex-col zeus:p-[16px] zeus:gap-[12px] zeus:rounded-[12px] zeus:gradient-bg-secondary zeus:mb-[24px]">
        {[
          { label: "You Withdraw", value: `${amount.toFixed()} zBTC` },
          {
            label: "You Will Receive",
            value: `${amount
              .times(1 - WITHDRAW_SERVICE_FEE_RATE)
              .toFixed()} BTC`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="zeus:flex zeus:justify-between zeus:items-center"
          >
            <p className="zeus:body-body2-medium zeus:text-[#C7C5D1]">
              {item.label}
            </p>
            <p className="zeus:body-body2-medium zeus:text-[#FFFFFF]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="zeus:flex zeus:flex-col zeus:gap-[8px] zeus:mb-[16px]">
        <p className="zeus:body-body2-medium zeus:pl-[8px]">Send to</p>

        <BitcoinAddressInput address={address} onChange={setAddress} />

        {[
          {
            label: "Service Fee",
            value: `${amount.times(WITHDRAW_SERVICE_FEE_RATE).toFormat()} BTC`,
          },
          {
            label: "Infrastructure Fee",
            value: `${calculateInfrastructureFee(amount).toFormat()} SOL`,
          },
          { label: "Estimated arrival", value: "~30 minutes" },
        ].map((item) => (
          <div
            key={item.label}
            className="zeus:flex zeus:flex-row zeus:items-center zeus:justify-between zeus:gap-[8px] zeus:text-[#8B8A9E] zeus:body-body2-medium zeus:px-[8px]"
          >
            <p>{item.label}</p>
            <p className="zeus:text-[#C7C5D1]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="zeus:flex zeus:flex-row zeus:gap-[8px]">
        <ZeusButton
          variant="tertiary"
          className="zeus:w-full"
          data-gtm-type={GtmEventType.Click}
          data-gtm-event={GtmEvent.ClickWithdrawCancel}
          onClick={() => onCancel?.()}
        >
          Cancel
        </ZeusButton>
        <ZeusButton
          variant="primary"
          className="zeus:w-full"
          disabled={!address}
          data-gtm-type={GtmEventType.Click}
          data-gtm-event={GtmEvent.ClickWithdrawConfirm}
          onClick={runWithdraw}
        >
          Confirm
        </ZeusButton>
      </div>
    </div>
  );
}

export default WithdrawDetails;
