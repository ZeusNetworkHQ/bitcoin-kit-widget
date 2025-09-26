import { useWallet } from "@solana/wallet-adapter-react";
import { useBitcoinWallet } from "@zeus-network/bitcoin-wallet-adapter";
import {
  btcToSatoshi,
  DEPOSIT_SERVICE_FEE_BTC,
  DepositError,
  satoshiToBtc,
  WalletConnectionError,
  ZeusLayer,
} from "@zeus-network/client";
import BigNumber from "bignumber.js";
import { useCopyToClipboard } from "usehooks-ts";

import BitcoinWalletSelector from "@/components/BitcoinWalletSelector";
import Icon from "@/components/Icon";
import ZeusButton from "@/components/ZeusButton";
import {
  useErrorHandler,
  useSuccessHandler,
  useZeusService,
} from "@/contexts/ConfigContext";
import useReserveAddress from "@/hooks/useReserveAddress";
import useSatoshiBalance from "@/hooks/useSatoshiBalance";
import { cn, truncateMiddle } from "@/utils";
import { GtmEvent, GtmEventType } from "@/utils/gtm";

function DepositDetails({
  amount,
  onSuccess,
  onRequestToChangeAmount,
}: {
  amount: BigNumber;
  onSuccess?: () => void;
  onRequestToChangeAmount?: () => void;
}) {
  const wallet = useWallet();
  const bitcoinWallet = useBitcoinWallet();

  const handleError = useErrorHandler();
  const handleSuccess = useSuccessHandler();
  const [, copyToClipboard] = useCopyToClipboard();

  const zeusLayer = useZeusService(ZeusLayer);
  const { data: reserveAddress } = useReserveAddress(wallet.publicKey);
  const { data: satoshiBalance = 0, isLoading } = useSatoshiBalance(
    bitcoinWallet.p2tr,
  );

  const isSufficientAmount =
    !bitcoinWallet.connected ||
    isLoading ||
    btcToSatoshi(amount).lte(satoshiBalance);

  const runDeposit = async () => {
    try {
      if (!bitcoinWallet.pubkey || !wallet.publicKey)
        throw new WalletConnectionError();

      await zeusLayer.deposit().sign(bitcoinWallet, {
        amount: amount.toNumber(),
        bitcoinPublicKey: bitcoinWallet.pubkey,
        solanaPublicKey: wallet.publicKey,
      });

      onSuccess?.();
      handleSuccess("Deposit initiated successfully.");
      bitcoinWallet.disconnect();
    } catch (error) {
      if (error instanceof Error) {
        handleError(new DepositError(error));
      }
    }
  };

  const getButtonsElement = () => {
    if (!isLoading && !isSufficientAmount)
      return (
        <div className="zeus:flex zeus:flex-row zeus:gap-[8px]">
          <ZeusButton
            variant="tertiary"
            className="zeus:w-full zeus:transition-all"
            data-gtm-type={GtmEventType.Click}
            data-gtm-event={GtmEvent.ClickChangeAmount}
            onClick={onRequestToChangeAmount}
          >
            Change Amount
          </ZeusButton>

          <BitcoinWalletSelector>
            <BitcoinWalletSelector.Trigger asChild>
              <ZeusButton
                variant="primary"
                className="zeus:w-full"
                data-gtm-type={GtmEventType.Click}
                data-gtm-event={GtmEvent.ClickSwitchWallet}
              >
                Switch Wallet
              </ZeusButton>
            </BitcoinWalletSelector.Trigger>
            <BitcoinWalletSelector.Portal>
              <BitcoinWalletSelector.Content />
            </BitcoinWalletSelector.Portal>
          </BitcoinWalletSelector>
        </div>
      );

    return (
      <div className="zeus:flex zeus:flex-row zeus:gap-[8px]">
        <ZeusButton
          variant="tertiary"
          className="zeus:w-full zeus:transition-all"
          data-gtm-type={GtmEventType.Click}
          data-gtm-event={GtmEvent.ClickDepositCancel}
          onClick={async () => {
            bitcoinWallet.disconnect();
            onRequestToChangeAmount?.();
          }}
        >
          Cancel
        </ZeusButton>
        <ZeusButton
          variant="primary"
          className="zeus:w-full"
          data-gtm-type={GtmEventType.Click}
          data-gtm-event={GtmEvent.ClickDepositConfirm}
          onClick={runDeposit}
        >
          Confirm
        </ZeusButton>
      </div>
    );
  };

  return (
    <div className="zeus:flex zeus:flex-col zeus:text-start">
      <p className="zeus:heading-heading6 zeus:text-[#FFFFFF] zeus:mb-[8px]">
        Confirm BTC Transfer
      </p>

      {bitcoinWallet?.pubkey && (
        <div className="zeus:my-[8px] zeus:self-end zeus:flex zeus:flex-row zeus:items-center zeus:gap-[6px] zeus:body-body2-medium zeus:text-[#C7C5D1]">
          <Icon variant="wallet-sm" size={14} />
          {satoshiToBtc(satoshiBalance).toFormat()} BTC
        </div>
      )}

      <div className="zeus:flex zeus:flex-col zeus:gap-[8px] zeus:mb-[20px] zeus:items-stretch">
        <div className="zeus:flex zeus:flex-col zeus:p-[16px] zeus:gap-[12px] zeus:rounded-[12px] zeus:gradient-bg-secondary">
          {[
            {
              label: "You Deposit",
              icon: "brand.btc",
              value: `${amount.toFormat()} BTC`,
            },
            {
              label: "You Will Receive",
              icon: "brand.zbtc",
              value: `${amount.minus(DEPOSIT_SERVICE_FEE_BTC).toFormat()} zBTC`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="zeus:flex zeus:justify-between zeus:items-center"
            >
              <p className="zeus:body-body2-medium zeus:text-[#C7C5D1]">
                {item.label}
              </p>
              <p
                className={cn(
                  "zeus:flex zeus:flex-row zeus:items-center zeus:gap-[8px] zeus:body-body2-medium zeus:text-[#FFFFFF] zeus:transition-opacity",
                  !isSufficientAmount && "zeus:opacity-30",
                )}
              >
                <Icon variant={item.icon} />
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {bitcoinWallet.connected && !isSufficientAmount && (
          <div className="zeus:flex zeus:flex-row zeus:items-center zeus:gap-[12px] zeus:body-body2-medium zeus:px-[12px] zeus:py-[8px] zeus:text-[#FFB546] zeus:bg-[#FFB5461A] zeus:border zeus:border-solid zeus:border-[#FFB54633] zeus:rounded-[8px]">
            <Icon variant="error" />
            Insufficient BTC Balance
          </div>
        )}
      </div>

      {!bitcoinWallet?.pubkey && (
        <>
          <div className="zeus:flex zeus:flex-col zeus:gap-[8px] zeus:mb-[16px]">
            <p className="zeus:body-body2-medium zeus:pl-[8px]">
              Deposit BTC to the following address
            </p>
            <div className="zeus:p-[12px] zeus:bg-[#16161B] zeus:border zeus:border-[#8B8A9E26] zeus:border-solid zeus:rounded-[12px] zeus:body-body1-semibold zeus:text-start zeus:wrap-anywhere zeus:min-h-[74px] zeus:gap-[16px] zeus:flex zeus:flex-row zeus:items-center">
              <div
                className={cn(
                  "zeus:grow-1 zeus:transition-opacity zeus:opacity-0",
                  reserveAddress && "zeus:opacity-100",
                )}
              >
                {reserveAddress}
              </div>
              <button
                type="button"
                className="zeus:h-[30px] zeus:w-[30px] zeus:border zeus:border-solid zeus:border-[#8B8A9E33] zeus:rounded-[8px] zeus:text-[#C7C5D1] zeus:hover:text-[#F1F0F3] zeus:bg-[#2C2C36] zeus:hover:bg-[#272730] zeus:shrink-0 zeus:cursor-pointer zeus:flex zeus:justify-center zeus:items-center zeus:transition-colors"
                data-gtm-type={GtmEventType.Click}
                data-gtm-event={GtmEvent.ClickCopyAddress}
                onClick={() => copyToClipboard(reserveAddress || "")}
              >
                <Icon variant="copy" className="zeus:text-[#C7C5D1]" />
              </button>
            </div>
            {[
              { label: "Service Fee", value: "0.0001 BTC" },
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

          <div className="zeus:divider zeus:gap-[16px] zeus:body-body2-medium zeus:border-[#8B8A9E66]">
            or
          </div>

          <BitcoinWalletSelector>
            <BitcoinWalletSelector.Trigger asChild>
              <ZeusButton
                data-gtm-type={GtmEventType.Click}
                data-gtm-event={GtmEvent.ClickDepositBitcoinWallet}
                variant="primary"
                className="zeus:w-full zeus:mt-[16px]"
              >
                Connect Bitcoin Wallet
              </ZeusButton>
            </BitcoinWalletSelector.Trigger>
            <BitcoinWalletSelector.Portal>
              <BitcoinWalletSelector.Content />
            </BitcoinWalletSelector.Portal>
          </BitcoinWalletSelector>
        </>
      )}

      {bitcoinWallet?.pubkey && (
        <>
          <div className="zeus:flex zeus:flex-col zeus:gap-[8px] zeus:mb-[16px]">
            {[
              {
                label: "Deposited to",
                value: (
                  <div className="zeus:flex zeus:items-center zeus:flex-row zeus:gap-[8px]">
                    {truncateMiddle(bitcoinWallet?.p2tr || "", 10)}
                    <button
                      type="button"
                      className="zeus:h-[18px] zeus:w-[18px] zeus:cursor-pointer zeus:hover:text-[#F1F0F3] zeus:transition-colors"
                      onClick={() => copyToClipboard(bitcoinWallet?.p2tr || "")}
                    >
                      <Icon variant="copy" />
                    </button>
                  </div>
                ),
              },
              { label: "Service Fee", value: "0.0001 BTC" },
              { label: "Estimated arrival", value: "~30 minutes" },
            ].map((item) => (
              <div
                key={item.label}
                className="zeus:flex zeus:flex-row zeus:items-center zeus:justify-between zeus:gap-[8px] zeus:text-[#8B8A9E] zeus:body-body2-medium zeus:px-[8px]"
              >
                <p>{item.label}</p>
                <div className="zeus:text-[#C7C5D1]">{item.value}</div>
              </div>
            ))}
          </div>

          {getButtonsElement()}
        </>
      )}
    </div>
  );
}

export default DepositDetails;
