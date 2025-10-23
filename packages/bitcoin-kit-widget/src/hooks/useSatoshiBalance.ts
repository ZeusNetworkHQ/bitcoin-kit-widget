import { UtxoModel } from "@zeus-network/client";
import { sumBy } from "lodash";
import useSWR from "swr";

import { useZeusService } from "@/contexts/ConfigContext";

function useSatoshiBalance(bitcoinAddress: string | null) {
  const utxoModel = useZeusService(UtxoModel);

  const swr = useSWR(
    [bitcoinAddress, "satoshiBalance"],
    async ([bitcoinAddress]) => {
      if (!bitcoinAddress) return 0;
      const nonOrdinalUtxos = await utxoModel.findMany({
        bitcoinAddress,
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
