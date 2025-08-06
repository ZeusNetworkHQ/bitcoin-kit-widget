import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js";
import {
  LiquidityManagementClient,
  TwoWayPegClient,
} from "@zeus-network/zpl-sdk";

import { ClientRequestError } from "@/errors";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";
import { BitcoinNetwork, SolanaNetwork } from "@/types";
import { createCacheCallback } from "@/utils";

export default class ZplProgram extends ZeusService {
  constructor(params: CreateZeusServiceParams) {
    super(params);
  }

  public accounts = createCacheCallback(async () => {
    const connection = this.core.solanaConnection;
    const bootstrapAccounts = await connection.getProgramAccounts(
      new PublicKey(this.getZPLProgramAddress()),
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
  });

  public reserveSetting = createCacheCallback(async () => {
    const connection = this.core.solanaConnection;
    const reserveSettingAccount = await connection.getAccountInfo(
      new PublicKey(this.getReserveSettingAccountAddress()),
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
  });

  public twoWayPegClient = createCacheCallback(async () => {
    const { twoWayPegProgramId } = await this.accounts();
    return new TwoWayPegClient(
      this.core.solanaConnection,
      new PublicKey(twoWayPegProgramId),
    );
  });

  public liquidityManagementClient = createCacheCallback(async () => {
    const { liquidityManagementProgramId } = await this.accounts();
    return new LiquidityManagementClient(
      this.core.solanaConnection,
      new PublicKey(liquidityManagementProgramId),
    );
  });

  // --- PRIVATES ---

  private getZPLProgramAddress() {
    const { solanaNetwork, bitcoinNetwork } = this.core;

    if (
      solanaNetwork === SolanaNetwork.Mainnet &&
      bitcoinNetwork === BitcoinNetwork.Mainnet
    ) {
      return "5ogaABGMX57MA44bfTXe3ia1XNxAFitqDEibg9xYkX35";
    }
    if (
      solanaNetwork === SolanaNetwork.Devnet &&
      bitcoinNetwork === BitcoinNetwork.Testnet
    ) {
      return "A2pkuynEoU2yhnGBDVkSkKNLGvtDjj94tSqfPx3XPhiP";
    }
    if (
      solanaNetwork === SolanaNetwork.Devnet &&
      bitcoinNetwork === BitcoinNetwork.Regtest
    ) {
      return "DTZeCgdDLz6gS6e3K4Go4WGh7sLLj9ux9BF2pPym7MD8";
    }
    throw new ClientRequestError(
      "Zpl",
      `Unsupported network configuration: Bitcoin "${bitcoinNetwork}" and Solana "${solanaNetwork}"`,
    );
  }

  private getReserveSettingAccountAddress() {
    const { solanaNetwork, bitcoinNetwork } = this.core;

    if (
      solanaNetwork === SolanaNetwork.Mainnet &&
      bitcoinNetwork === BitcoinNetwork.Mainnet
    ) {
      return "AFbCrUqgiyLpnBbybYGw8QJjqLWk5p4SNvo6tFRQftKL";
    }
    if (
      (solanaNetwork === SolanaNetwork.Devnet &&
        bitcoinNetwork === BitcoinNetwork.Testnet) ||
      (solanaNetwork === SolanaNetwork.Devnet &&
        bitcoinNetwork === BitcoinNetwork.Regtest)
    ) {
      return "7hDRd3Y4X7U7BQ6ZPeLwVtjMY7hChdq1N6xdpv59QEdU";
    }
    throw new ClientRequestError(
      "Zpl",
      `Unsupported network configuration: Solana "${solanaNetwork}" and Bitcoin "${bitcoinNetwork}"`,
    );
  }
}
