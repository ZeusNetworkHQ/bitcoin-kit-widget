import { satoshiToBtc } from "@zeus-widget/core";
import BigNumber from "bignumber.js";
import useSWR from "swr";

import type { PublicKey } from "@solana/web3.js";

import { useTokenAccountModel } from "@/contexts/CorePoolProvider";

function useZBtcBalance(publicKey: PublicKey | null) {
  const tokenAccountModel = useTokenAccountModel();

  const swr = useSWR(
    [publicKey, "zBtcBalance"],
    async ([publicKey]) => {
      if (!publicKey) return new BigNumber(0);

      const account = await tokenAccountModel.find({ publicKey });
      return satoshiToBtc(account.amount);
    },
    {
      fallbackData: new BigNumber(0),
      refreshInterval: 30000,
      dedupingInterval: 30000,
    }
  );

  return swr;
}

export default useZBtcBalance;
