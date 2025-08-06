import {
  DEPOSIT_SERVICE_FEE_BTC,
  MINIMUM_DEPOSIT_AMOUNT_BTC,
} from "@zeus-network/client";
import BigNumber from "bignumber.js";

import Icon from "@/components/Icon";
import NumberInput from "@/components/NumberField";
import usePrice from "@/hooks/usePrice";
import { cn } from "@/utils/misc";

interface BtcInputFieldProps {
  amount?: BigNumber;
  disabled?: boolean;
  className?: string;
  onChange?: (value: BigNumber) => void;
}

function BtcInputField({
  amount,
  disabled,
  onChange,
  className,
}: BtcInputFieldProps) {
  const { data: priceInfo } = usePrice("BTCUSDC");
  const btcPrice = new BigNumber(priceInfo?.price || 0);

  return (
    <div
      className={cn(
        "zeus:flex zeus:flex-col zeus:bg-[#0F0F1280] zeus:rounded-[12px] zeus:text-start",
        disabled && "zeus:cursor-not-allowed",
        className,
      )}
    >
      <div className="zeus:flex zeus:flex-row zeus:border zeus:border-solid zeus:border-[#8B8A9E33] zeus:p-[6px] zeus:pr-[16px] zeus:rounded-[inherit]">
        <div className="zeus:w-[135px] zeus:h-[72px] zeus:flex zeus:items-center zeus:gap-[8px] zeus:border zeus:border-solid zeus:border-[#8B8A9E26] zeus:bg-[#202027] zeus:rounded-[8px] zeus:body-body1-semibold text-[#F1F0F3] zeus:p-[12px] zeus:shrink-0">
          <Icon variant="brand.btc" />
          BTC
        </div>

        <div className="zeus:flex zeus:flex-col zeus:grow zeus:justify-center zeus:text-[#8B8A9E]">
          <NumberInput
            value={amount}
            disabled={disabled}
            onChange={onChange}
            decimal={8}
            className="zeus:px-[16px] zeus:py-[4px] zeus:w-full zeus:flex-1 zeus:heading-heading5 zeus:outline-none"
            style={{
              boxShadow:
                "0px -1px 0px 0px #8B8A9E40 inset, 0px -2px 0px 0px #0F0F12 inset",
            }}
          />
          <div className="zeus:flex-1 zeus:px-[16px] zeus:py-[6px] zeus:w-full zeus:body-body2-medium zeus:wrap-anywhere">
            ~${amount?.times(btcPrice).toFormat() ?? 0} USD
          </div>
        </div>
      </div>

      <div
        className={cn(
          "zeus:flex zeus:flex-col zeus:items-stretch zeus:gap-[8px] zeus:px-[16px] zeus:py-[12px] zeus:body-body2-semibold",
          disabled && "zeus:blur-[4px]",
        )}
      >
        {[
          {
            type: "Estimated Receive",
            value: `${
              amount?.gte(MINIMUM_DEPOSIT_AMOUNT_BTC)
                ? amount.minus(DEPOSIT_SERVICE_FEE_BTC).toFormat()
                : 0
            } BTC`,
            primary: true,
          },
          {
            type: "Service Fee",
            value: `${new BigNumber(DEPOSIT_SERVICE_FEE_BTC).toFormat()} BTC`,
          },
        ].map((item) => (
          <div
            key={item.type}
            className={cn(
              "zeus:flex zeus:justify-between",
              item.primary ? "zeus:text-[#FFF]" : "zeus:text-[#C7C5D1]",
            )}
          >
            <span>{item.type}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BtcInputField;
