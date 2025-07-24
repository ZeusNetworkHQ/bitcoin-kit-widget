import type {
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import type * as bitcoin from "bitcoinjs-lib";

export enum SolanaNetwork {
  Mainnet = "mainnet",
  Devnet = "devnet",
  Testnet = "testnet",
}

export enum BitcoinNetwork {
  Mainnet = "bitcoin",
  Testnet = "testnet",
  Regtest = "regtest",
}

export enum Chain {
  Solana = "Solana",
  Bitcoin = "Bitcoin",
}

export enum InteractionType {
  Deposit = 0,
  Withdrawal = 1,
  ExternalReserveDeposit = 2,
  ExternalReserveWithdrawal = 3,
}

export enum InteractionStatus {
  // Deposit
  BitcoinDepositToHotReserve = "BitcoinDepositToHotReserve",
  BitcoinDepositToEntityDerivedReserve = "BitcoinDepositToEntityDerivedReserve",
  VerifyDepositToHotReserveTransaction = "VerifyDepositToHotReserveTransaction",
  SolanaDepositToEntityDerivedReserve = "SolanaDepositToEntityDerivedReserve",
  SolanaDepositToHotReserve = "SolanaDepositToHotReserve",
  AddLockToColdReserveProposal = "AddLockToColdReserveProposal",
  BitcoinLockToColdReserve = "BitcoinLockToColdReserve",
  VerifyLockToColdReserveTransaction = "VerifyLockToColdReserveTransaction",
  SolanaLockToColdReserve = "SolanaLockToColdReserve",
  Peg = "Peg",
  Reclaim = "Reclaim",
  PegAndDistribute = "PegAndDistribute",

  // Withdrawal
  AddWithdrawalRequest = "AddWithdrawalRequest",
  AddUnlockToUserProposal = "AddUnlockToUserProposal",
  BitcoinUnlockToUser = "BitcoinUnlockToUser",
  VerifyUnlockToUserTransaction = "VerifyUnlockToUserTransaction",
  SolanaUnlockToUser = "SolanaUnlockToUser",
  Unpeg = "Unpeg",
  DeprecateWithdrawalRequest = "DeprecateWithdrawalRequest",

  // External Reserve
  BitcoinLockToExternalReserve = "BitcoinLockToExternalReserve",
  VerifyLockToExternalReserveTransaction = "VerifyLockToExternalReserveTransaction",
  BitcoinUnlockFromExternalReserve = "BitcoinUnlockFromExternalReserve",
  VerifyUnlockFromExternalReserveTransaction = "VerifyUnlockFromExternalReserveTransaction",

  Empty = "Empty",
  DustAmount = "DustAmount",

  // Client Specific
}

export interface BitcoinSigner {
  signPsbt: (psbt: bitcoin.Psbt) => Promise<string>;
}

export interface SolanaSigner {
  publicKey: PublicKey | null;
  signTransaction?: <T extends Transaction | VersionedTransaction>(
    transaction: T
  ) => Promise<T>;
}
