export const BitcoinNetwork = {
  Mainnet: "bitcoin",
  Testnet: "testnet",
  Regtest: "regtest",
} as const;

export type BitcoinNetwork =
  (typeof BitcoinNetwork)[keyof typeof BitcoinNetwork];
