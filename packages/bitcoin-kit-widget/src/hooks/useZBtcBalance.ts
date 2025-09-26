import { satoshiToBtc, TokenAccountModel } from "@zeus-network/client";
import BigNumber from "bignumber.js";
import useSWR from "swr";

import type { PublicKey } from "@solana/web3.js";

import { useZeusService } from "@/contexts/ConfigContext";

function useZBtcBalance(publicKey: PublicKey | null) {
  const tokenAccountModel = useZeusService(TokenAccountModel);

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
    },
  );

  return swr;
}

export default useZBtcBalance;
