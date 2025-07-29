import z from "zod";

export const aresUtxoSchema = z.object({
  transactionId: z.string(),
  transactionIndex: z.number(),
  satoshis: z.number(),
  blockHeight: z.number(),
});

export type AresUtxo = z.infer<typeof aresUtxoSchema>;

export const aresTransactionSchema = z.object({
  transaction: z.string(),
  blockhash: z.string().nullable(),
  confirmations: z.number().nullable(),
  time: z.number().nullable(),
  blocktime: z.number().nullable(),
});

export type AresTransaction = z.infer<typeof aresTransactionSchema>;
