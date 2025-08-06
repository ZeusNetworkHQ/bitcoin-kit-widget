import { BinanceApi } from "@zeus-network/client";
import useSWR from "swr";

import { useZeusService } from "@/contexts/ConfigContext";

function usePrice(symbol: string) {
  const binanceApi = useZeusService(BinanceApi);

  const swr = useSWR(
    [symbol, "price"],
    () => {
      return binanceApi.findPrice({ symbol });
    },
    {
      refreshInterval: 60000,
      dedupingInterval: 60000,
    },
  );

  return swr;
}

export default usePrice;
