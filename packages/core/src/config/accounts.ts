import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js";

import CoreConfig from "./core";

import { BitcoinNetwork, SolanaNetwork } from "@/types";

interface AccountsConfigParams {
  coreConfig?: CoreConfig;
}

export default class AccountsConfig {
  public readonly core: CoreConfig;
  private zplAccounts:
    | Promise<
        Record<
          | "superOperatorCertificate"
          | "chadbufferProgramId"
          | "bitcoinSpvProgramId"
          | "twoWayPegProgramId"
          | "liquidityManagementProgramId"
          | "delegatorProgramId"
          | "layerCaProgramId",
          string
        >
      >
    | undefined;
  private reserveSettingAccounts:
    | Promise<
        Record<
          | "guardianCertificate"
          | "assetMint"
          | "tokenProgramId"
          | "splTokenMintAuthority"
          | "splTokenBurnAuthority",
          string
        > & { seed: number }
      >
    | undefined;

  constructor({ coreConfig = new CoreConfig() }: AccountsConfigParams = {}) {
    this.core = coreConfig;
  }

  public zpl() {
    const getZPLAccounts = async () => {
      const bootstrapAccounts =
        await this.core.solanaConnection.getProgramAccounts(
          new PublicKey(this.getZPLProgramAddress())
        );

      const {
        superOperatorCertificate,
        chadbufferProgramId,
        bitcoinSpvProgramId,
        twoWayPegProgramId,
        liquidityManagementProgramId,
        delegatorProgramId,
        layerCaProgramId,
      } = borsh
        .struct([
          borsh.publicKey("superOperatorCertificate"),
          borsh.publicKey("chadbufferProgramId"),
          borsh.publicKey("bitcoinSpvProgramId"),
          borsh.publicKey("twoWayPegProgramId"),
          borsh.publicKey("liquidityManagementProgramId"),
          borsh.publicKey("delegatorProgramId"),
          borsh.publicKey("layerCaProgramId"),
        ])
        .decode(bootstrapAccounts[0].account.data);

      return {
        superOperatorCertificate: superOperatorCertificate.toBase58(),
        chadbufferProgramId: chadbufferProgramId.toBase58(),
        bitcoinSpvProgramId: bitcoinSpvProgramId.toBase58(),
        twoWayPegProgramId: twoWayPegProgramId.toBase58(),
        liquidityManagementProgramId: liquidityManagementProgramId.toBase58(),
        delegatorProgramId: delegatorProgramId.toBase58(),
        layerCaProgramId: layerCaProgramId.toBase58(),
      };
    };

    if (!this.zplAccounts) this.zplAccounts = getZPLAccounts();
    return this.zplAccounts;
  }

  public async reserveSetting() {
    const getReserveSettingAccounts = async () => {
      const reserveSettingAccount =
        await this.core.solanaConnection.getAccountInfo(
          new PublicKey(this.getReserveSettingAccountAddress())
        );

      const {
        seed,
        guardianCertificate,
        assetMint,
        tokenProgramId,
        splTokenMintAuthority,
        splTokenBurnAuthority,
      } = borsh
        .struct([
          borsh.u32("seed"),
          borsh.publicKey("guardianCertificate"),
          borsh.publicKey("assetMint"),
          borsh.publicKey("tokenProgramId"),
          borsh.publicKey("splTokenMintAuthority"),
          borsh.publicKey("splTokenBurnAuthority"),
        ])
        .decode(reserveSettingAccount!.data.subarray(8));

      return {
        seed,
        guardianCertificate: guardianCertificate.toBase58(),
        assetMint: assetMint.toBase58(),
        tokenProgramId: tokenProgramId.toBase58(),
        splTokenMintAuthority: splTokenMintAuthority.toBase58(),
        splTokenBurnAuthority: splTokenBurnAuthority.toBase58(),
      };
    };

    if (!this.reserveSettingAccounts)
      this.reserveSettingAccounts = getReserveSettingAccounts();
    return this.reserveSettingAccounts;
  }

  // --- PRIVATES ---

  private getZPLProgramAddress() {
    if (
      this.core.solanaNetwork === SolanaNetwork.Mainnet &&
      this.core.bitcoinNetwork === BitcoinNetwork.Mainnet
    ) {
      return "5ogaABGMX57MA44bfTXe3ia1XNxAFitqDEibg9xYkX35";
    }
    if (
      this.core.solanaNetwork === SolanaNetwork.Devnet &&
      this.core.bitcoinNetwork === BitcoinNetwork.Testnet
    ) {
      return "A2pkuynEoU2yhnGBDVkSkKNLGvtDjj94tSqfPx3XPhiP";
    }
    if (
      this.core.solanaNetwork === SolanaNetwork.Devnet &&
      this.core.bitcoinNetwork === BitcoinNetwork.Regtest
    ) {
      return "DTZeCgdDLz6gS6e3K4Go4WGh7sLLj9ux9BF2pPym7MD8";
    }
    throw new Error(
      `Unsupported network configuration: Solana "${this.core.solanaNetwork}" and Bitcoin "${this.core.bitcoinNetwork}"`
    );
  }

  private getReserveSettingAccountAddress() {
    if (
      this.core.solanaNetwork === SolanaNetwork.Mainnet &&
      this.core.bitcoinNetwork === BitcoinNetwork.Mainnet
    ) {
      return "AFbCrUqgiyLpnBbybYGw8QJjqLWk5p4SNvo6tFRQftKL";
    }
    if (
      (this.core.solanaNetwork === SolanaNetwork.Devnet &&
        this.core.bitcoinNetwork === BitcoinNetwork.Testnet) ||
      (this.core.solanaNetwork === SolanaNetwork.Devnet &&
        this.core.bitcoinNetwork === BitcoinNetwork.Regtest)
    ) {
      return "7hDRd3Y4X7U7BQ6ZPeLwVtjMY7hChdq1N6xdpv59QEdU";
    }
    throw new Error(
      `Unsupported network configuration: Solana "${this.core.solanaNetwork}" and Bitcoin "${this.core.bitcoinNetwork}"`
    );
  }
}
