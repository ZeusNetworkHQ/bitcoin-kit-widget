import { EntityDerivedReserveAddressModel } from "@zeus-network/client";
import useSWR from "swr";

import type { PublicKey } from "@solana/web3.js";

import { useZeusService } from "@/contexts/ConfigContext";

function useReserveAddress(solanaPublicKey: PublicKey | null) {
  const edraModel = useZeusService(EntityDerivedReserveAddressModel);

  const swr = useSWR(
    [solanaPublicKey, "reserveAddress"],
    async ([solanaPublicKey]) => {
      if (!solanaPublicKey) return null;
      const edraList = await edraModel.findMany({ solanaPublicKey });

      if (edraList.length === 0) return null;
      return await edraModel.getP2trAddress(edraList[0]);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  return swr;
}

export default useReserveAddress;
