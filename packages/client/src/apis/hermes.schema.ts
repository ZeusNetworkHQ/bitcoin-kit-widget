import z from "zod";

import { Chain, InteractionStatus, InteractionType } from "@/types";

export const interactionStepSchema = z.object({
  chain: z.nativeEnum(Chain),
  action: z.string(),
  transaction: z.string(),
  timestamp: z.number(),
});

export type InteractionStep = z.infer<typeof interactionStepSchema>;

export const guardianCertificateSchema = z.object({
  name: z.string(),
  address: z.string(),
  entity: z.string(),
  status: z.string(),
});

export type GuardianCertificate = z.infer<typeof guardianCertificateSchema>;

export const swapInfoSchema = z.object({
  swapInputAmount: z.string(),
  swapInputMint: z.string(),
  swapOutputAmount: z.string(),
});

export type SwapInfo = z.infer<typeof swapInfoSchema>;

export const interactionSchema = z.object({
  interactionId: z.string(),
  interactionType: z.nativeEnum(InteractionType),
  status: z.nativeEnum(InteractionStatus),
  appDeveloper: z.string(),
  initiatedAt: z.number(),
  currentStepAt: z.number().optional().nullable(),
  amount: z.string(),
  minerFee: z.string(),
  serviceFee: z.string(),
  source: z.string(),
  destination: z.string(),
  guardianCertificate: guardianCertificateSchema.optional().nullable(),
  guardianSetting: z.string().optional().nullable(),
  steps: z.array(interactionStepSchema).optional().nullable(),
  swapInfo: swapInfoSchema.nullable(),
  withdrawalRequestPda: z.string().optional().nullable(),
  depositBlock: z.number().optional().nullable(),
  liquidityManagementMethods: z.array(z.string()).optional().nullable(),
});

export type Interaction = z.infer<typeof interactionSchema>;

export const twoWayPegReserveSettingSchema = z.object({
  address: z.string(),
  seed: z.number(),
  guardianCertificate: z.string(),
  assetMint: z.string(),
  tokenProgramId: z.string(),
  splTokenMintAuthority: z.string(),
  splTokenBurnAuthority: z.string(),
  totalAmountLocked: z.string(),
  totalAmountPegged: z.string(),
});

export type TwoWayPegReserveSetting = z.infer<
  typeof twoWayPegReserveSettingSchema
>;

export const emissionSettingSchema = z.object({
  address: z.string(),
  seed: z.number(),
  status: z.number(),
  guardianCertificate: z.string(),
  maxQuota: z.string(),
  availableQuota: z.string(),
  accumulatedAmount: z.string(),
  escrowBalance: z.string(),
  penaltyRate: z.number(),
  delegationRemovalLockDays: z.number(),
  quotaIncreasingRate: z.number(),
  delegateOptions: z.array(
    z.object({
      lockDays: z.number(),
      initialRate: z.number(),
      currentRate: z.number(),
    }),
  ),
  splTokenEscrowAuthority: z.string(),
  splTokenVaultAuthority: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type EmissionSetting = z.infer<typeof emissionSettingSchema>;
