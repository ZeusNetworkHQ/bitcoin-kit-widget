import z from "zod";

export const unisatUtxoSchema = z.object({
  txid: z.string(),
  vout: z.number(),
  satoshi: z.number(),
});

export type UnisatUtxo = z.infer<typeof unisatUtxoSchema>;
