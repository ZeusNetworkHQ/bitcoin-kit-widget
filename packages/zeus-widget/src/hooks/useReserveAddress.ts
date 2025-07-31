import useSWR from "swr";

import type { PublicKey } from "@solana/web3.js";

import { useDepositProgram } from "@/contexts/CorePoolProvider";

function useReserveAddress(solanaPublicKey: PublicKey | null) {
  const depositProgram = useDepositProgram();

  const swr = useSWR(
    [solanaPublicKey, "depositProgram.getEntityDerivedReserveAddress"],
    async ([solanaPublicKey]) => {
      if (!depositProgram || !solanaPublicKey) return null;
      return await depositProgram.getEntityDerivedReserveAddress(
        solanaPublicKey
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  return swr;
}

export default useReserveAddress;
