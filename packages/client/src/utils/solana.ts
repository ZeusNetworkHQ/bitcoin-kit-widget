import BigNumber from "bignumber.js";

import type { SolanaSigner } from "@/types";

export function assertsSolanaSigner(signer: SolanaSigner): asserts signer is {
  [key in keyof SolanaSigner]-?: NonNullable<SolanaSigner[key]>;
} {
  if (!signer.publicKey || !signer.signTransaction) {
    throw new Error(
      "Signer is not connected or does not support signing transactions.",
    );
  }
}

export function lamportsToSol(
  lamports: number | string | BigNumber,
): BigNumber {
  return new BigNumber(lamports).dividedBy(1e9);
}
