import useSWR from "swr";

import { useBinanceClient } from "@/contexts/CorePoolProvider";

function usePrice(symbol: string) {
  const binanceClient = useBinanceClient();

  const swr = useSWR(
    [symbol, "price"],
    () => {
      return binanceClient.findPrice({ symbol });
    },
    {
      refreshInterval: 60000,
      dedupingInterval: 60000,
    }
  );

  return swr;
}

export default usePrice;
