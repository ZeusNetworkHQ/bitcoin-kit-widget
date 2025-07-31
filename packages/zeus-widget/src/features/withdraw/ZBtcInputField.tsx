import {
  MINIMUM_WITHDRAW_AMOUNT_ZBTC,
  WITHDRAW_INFRASTRUCTURE_FEE_SOL,
  WITHDRAW_SERVICE_FEE_BTC_RATE,
} from "@zeus-widget/core";
import BigNumber from "bignumber.js";

import Icon from "@/components/Icon";
import NumberInput from "@/components/NumberField";
import usePrice from "@/hooks/usePrice";
import { cn } from "@/utils/misc";

const WITHDRAW_SERVICE_FEE_BTC_RATE_IN_PERCENT = new BigNumber(
  WITHDRAW_SERVICE_FEE_BTC_RATE
).times(100);

interface ZBtcInputFieldProps {
  amount?: BigNumber;
  maxAmount?: BigNumber;
  disabled?: boolean;
  className?: string;
  onChange?: (value: BigNumber) => void;
}

function ZBtcInputField({
  amount,
  maxAmount,
  disabled,
  onChange,
  className,
}: ZBtcInputFieldProps) {
  const { data: priceInfo } = usePrice("BTCUSDC");
  const btcPrice = new BigNumber(priceInfo?.price || 0);

  return (
    <div
      className={cn(
        "zeus:flex zeus:flex-col zeus:bg-[#0F0F1280] zeus:rounded-[12px] zeus:text-start",
        disabled && "zeus:cursor-not-allowed",
        className
      )}
    >
      <div className="zeus:flex zeus:flex-row zeus:border zeus:border-solid zeus:border-[#8B8A9E33] zeus:p-[6px] zeus:pr-[16px] zeus:rounded-[inherit]">
        <div className="zeus:w-[135px] zeus:h-[72px] zeus:flex zeus:items-center zeus:gap-[8px] zeus:border zeus:border-solid zeus:border-[#8B8A9E26] zeus:bg-[#202027] zeus:rounded-[8px] zeus:body-body1-semibold text-[#F1F0F3] zeus:p-[12px] zeus:shrink-0">
          <Icon variant="brand.zbtc" />
          zBTC
        </div>

        <div className="zeus:flex zeus:flex-col zeus:grow zeus:justify-center zeus:text-[#8B8A9E]">
          <NumberInput
            disabled={disabled}
            value={amount}
            max={maxAmount}
            decimal={8}
            className="zeus:px-[16px] zeus:py-[4px] zeus:w-full zeus:flex-1 zeus:heading-heading5 zeus:outline-none"
            style={{
              boxShadow:
                "0px -1px 0px 0px #8B8A9E40 inset, 0px -2px 0px 0px #0F0F12 inset",
            }}
            onClick={(event) => event.currentTarget.select()}
            onChange={onChange}
          />
          <div className="zeus:flex-1 zeus:px-[16px] zeus:py-[6px] zeus:w-full zeus:body-body2-semibold zeus:wrap-anywhere">
            ~${amount?.times(btcPrice).toFormat() ?? 0} USD
          </div>
        </div>
      </div>

      <div
        className={cn(
          "zeus:flex zeus:flex-col zeus:items-stretch zeus:gap-[8px] zeus:px-[16px] zeus:py-[12px] zeus:body-body2-semibold",
          disabled && "zeus:blur-[4px]"
        )}
      >
        {[
          {
            type: "Estimated Receive",
            value: `${
              amount?.gte(MINIMUM_WITHDRAW_AMOUNT_ZBTC)
                ? BigNumber(
                    amount.times(1 - WITHDRAW_SERVICE_FEE_BTC_RATE).toFixed(8)
                  ).toFormat()
                : 0
            } BTC`,
            primary: true,
          },
          {
            type: "Infrastructure Fee",
            value: `${WITHDRAW_INFRASTRUCTURE_FEE_SOL} SOL`,
          },
          {
            type: "Service Fee",
            value: `${WITHDRAW_SERVICE_FEE_BTC_RATE_IN_PERCENT.toFormat()}%`,
          },
        ].map((item) => (
          <div
            key={item.type}
            className={cn(
              "zeus:flex zeus:justify-between",
              item.primary ? "zeus:text-[#FFF]" : "zeus:text-[#C7C5D1]"
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

export default ZBtcInputField;
