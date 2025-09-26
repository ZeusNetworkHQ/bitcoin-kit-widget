import { UtxoModel } from "@zeus-network/client";
import { sumBy } from "lodash";
import useSWR from "swr";

import { useZeusService } from "@/contexts/ConfigContext";

function useSatoshiBalance(p2tr: string | null) {
  const utxoModel = useZeusService(UtxoModel);

  const swr = useSWR(
    [p2tr, "satoshiBalnace"],
    async ([p2tr]) => {
      if (!p2tr) return 0;
      const nonOrdinalUtxos = await utxoModel.findMany({
        bitcoinAddress: p2tr,
        ordinal: false,
      });
      return sumBy(nonOrdinalUtxos, "satoshis");
    },
    {
      fallbackData: 0,
      revalidateOnReconnect: false,
      refreshInterval: 10000,
    },
  );

  return swr;
}

export default useSatoshiBalance;
