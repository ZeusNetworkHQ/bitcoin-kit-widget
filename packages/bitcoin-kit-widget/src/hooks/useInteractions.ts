import { InteractionModel } from "@zeus-network/client";
import useSWR from "swr";

import type { PublicKey } from "@solana/web3.js";

import { useZeusService } from "@/contexts/ConfigContext";

function useInteractions(solanaPublicKey: PublicKey | null) {
  const interactionModel = useZeusService(InteractionModel);

  const swr = useSWR(
    [solanaPublicKey, "interactions"],
    ([solanaPublicKey]) => {
      if (!solanaPublicKey) return [];
      return interactionModel.findMany({
        size: 5,
        solanaAddress: solanaPublicKey?.toBase58(),
      });
    },
    {
      refreshInterval: 60000,
      dedupingInterval: 60000,
    },
  );

  return swr;
}

export default useInteractions;
