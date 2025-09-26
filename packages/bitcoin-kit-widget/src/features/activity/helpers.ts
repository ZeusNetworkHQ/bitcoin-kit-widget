import {
  InteractionStatus,
  InteractionType,
  type Interaction,
} from "@zeus-network/client";

export function getStatus(interaction: Interaction) {
  switch (interaction.status) {
    case InteractionStatus.DeprecateWithdrawalRequest:
    case InteractionStatus.DustAmount:
      return "failed";

    case InteractionStatus.Peg:
    case InteractionStatus.Unpeg:
    case InteractionStatus.PegAndDistribute:
      return "complete";

    case InteractionStatus.BitcoinDepositToHotReserve:
      return "initiating";

    default:
      return "processing";
  }
}

export function getInteractionDetails(interaction: Interaction) {
  switch (interaction.interactionType) {
    case InteractionType.Withdrawal:
      return {
        type: "Withdrawal",
        source: interaction.swapInfo?.swapInputMint || "zBTC",
        sourceChain: "Solana",
        destination: "BTC",
        destinationChain: "Bitcoin",
      };
    case InteractionType.ExternalReserveWithdrawal:
      return {
        type: "Withdrawal",
        source: "zBTC",
        sourceChain: "Solana",
        destination: "BTC",
        destinationChain: "Bitcoin",
      };
    case InteractionType.Deposit:
    case InteractionType.ExternalReserveDeposit:
    default:
      return {
        type: "Deposit",
        source: "BTC",
        sourceChain: "Bitcoin",
        destination: "zBTC",
        destinationChain: "Solana",
      };
  }
}

export function getInteractionLink(
  interactionId: string,
  {
    bitcoinNetwork,
    solanaNetwork,
  }: Record<"bitcoinNetwork" | "solanaNetwork", string>,
) {
  return `https://zeusscan.io/interaction/${interactionId}?network=${bitcoinNetwork}-${solanaNetwork}`;
}
