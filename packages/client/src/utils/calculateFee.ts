import BigNumber from "bignumber.js";

import { DEFAULT_WITHDRAW_INFRASTRUCTURE_FEE_SOL } from "@/constants";

export function calculateInfrastructureFee(
  withdrawAmount: number | BigNumber | string | bigint = 0,
): BigNumber {
  const amount = new BigNumber(withdrawAmount);

  if (amount.lt(0.1)) {
    return BigNumber(DEFAULT_WITHDRAW_INFRASTRUCTURE_FEE_SOL);
  }

  if (amount.lt(1)) {
    return BigNumber(DEFAULT_WITHDRAW_INFRASTRUCTURE_FEE_SOL).times(20);
  }

  return BigNumber(DEFAULT_WITHDRAW_INFRASTRUCTURE_FEE_SOL).times(40);
}
