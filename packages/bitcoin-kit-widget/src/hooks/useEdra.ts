import { EntityDerivedReserveAddressModel } from "@zeus-network/client";
import useSWR from "swr";

import type { PublicKey } from "@solana/web3.js";

import { useZeusService } from "@/contexts/ConfigContext";

function useEdra(solanaPublicKey: PublicKey | null) {
  const edraModel = useZeusService(EntityDerivedReserveAddressModel);

  const swr = useSWR(
    [solanaPublicKey, "edra"],
    async ([solanaPublicKey]) => {
      if (!solanaPublicKey) return null;
      const edras = await edraModel.findMany({ solanaPublicKey });
      return edras.length > 0 ? edras[0] : null;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  return swr;
}

export default useEdra;
