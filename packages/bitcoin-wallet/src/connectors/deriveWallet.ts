import ecc from "@bitcoinerlab/secp256k1";
import { type WalletContextState as SolanaWallet } from "@solana/wallet-adapter-react";
import * as bitcoin from "bitcoinjs-lib";
import { sha256, taggedHash } from "bitcoinjs-lib/src/crypto";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";
import ECPairFactory, { type ECPairInterface } from "ecpair";

import { BaseConnector, type WalletMetadata } from "./base";

import phantomIconSource from "@/assets/phantom.svg";
import { BitcoinNetwork, WalletId } from "@/types";

const ECPair = ECPairFactory(ecc);
bitcoin.initEccLib(ecc);

/**
 * DeriveWalletConnector allows users to derive a Bitcoin wallet from their Solana wallet.
 * This connector only works with on Testnet and Regtest networks for development purposes.
 * The bitcoin is only recognized by the Zeus Widget and Apollo and not by any other Bitcoin wallet.
 * You can claim the Bitcoin by https://btc.apollodex.io/claim.
 */
export class DeriveWalletConnector extends BaseConnector {
  readonly networks = [BitcoinNetwork.Testnet, BitcoinNetwork.Regtest];
  private account: {
    address: string;
    publicKey: string;
    compressedPublicKey: null;
    p2pkh: string;
    p2wpkh: string;
    p2tr: string;
  } | null = null;
  private privateKey: ECPairInterface | null = null;

  readonly metadata: WalletMetadata = {
    id: WalletId.DeriveWallet,
    name: "Bitcoin Devnet Wallet",
    icon: phantomIconSource,
    downloadUrl: "",
  };

  constructor(
    private readonly solanaWallet: SolanaWallet,
    private readonly bitcoinNetwork: BitcoinNetwork
  ) {
    super();
  }

  isReady(): boolean {
    return true; // DeriveWallet is always ready
  }

  private async connectToWallet(): Promise<{
    address: string;
    compressedPublicKey: string | null;
    publicKey: string;
  }> {
    if (!this.solanaWallet.publicKey)
      throw new Error("Unable to connect to Solana wallet");

    if (!this.solanaWallet.signMessage)
      throw new Error("Solana wallet does not support signing messages");

    if (this.account) return this.account;

    // Encode anything as bytes
    const message = new TextEncoder().encode(
      `By proceeding, you are authorizing the generation of a Testnet address based on the Solana wallet you've connected. This process does not charge any fees. Connected Solana wallet address:${this.solanaWallet.publicKey.toBase58()}`
    );

    // Sign the bytes using the wallet
    const signature = await this.solanaWallet.signMessage(message);

    const signatureHash = sha256(Buffer.from(signature));
    const keyPair = ECPair.fromPrivateKey(signatureHash);
    this.privateKey = keyPair;

    const pubkey = keyPair.publicKey.toString("hex");
    const network = bitcoin.networks[this.bitcoinNetwork];

    const p2pkh =
      bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network,
      }).address ?? "";

    const p2wpkh =
      bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network,
      }).address ?? "";

    const p2tr =
      bitcoin.payments.p2tr({
        internalPubkey: keyPair.publicKey.subarray(1, 33),
        network,
      }).address ?? "";

    this.account = {
      address: p2tr,
      publicKey: pubkey,
      compressedPublicKey: null,
      p2pkh,
      p2wpkh,
      p2tr,
    };

    return this.account;
  }

  async requestAccounts(): Promise<string[]> {
    return this.connectToWallet().then((account) =>
      account ? [account.address] : []
    );
  }

  async getAccounts(): Promise<string[]> {
    return this.connectToWallet().then((account) =>
      account ? [account.address] : []
    );
  }

  async getPublicKey(): Promise<string> {
    const accounts = await this.connectToWallet();
    if (accounts === undefined) {
      throw new Error(`${this.metadata.name} not connected!`);
    }
    return accounts.publicKey;
  }

  async signMessage(): Promise<string> {
    throw new Error(`${this.metadata.name} does not support signing messages!`);
  }

  async signPsbt(signedPsbtHex: string): Promise<string> {
    await this.connectToWallet();
    const psbt = bitcoin.Psbt.fromHex(signedPsbtHex);
    const tweakKeypair = tweakSigner(this.privateKey!, {
      network: bitcoin.networks[this.bitcoinNetwork],
    });
    psbt.signAllInputs(tweakKeypair);
    return psbt.toHex();
  }

  on() {}

  removeListener() {}

  getProvider() {}

  getProviderOrThrow() {
    throw new Error(`${this.metadata.name} does not support getting provider!`);
  }

  async getNetwork(): Promise<"livenet" | "testnet"> {
    return "testnet";
  }

  async switchNetwork(network: "livenet" | "testnet"): Promise<void> {
    throw new Error(
      `${this.metadata.name} does not support network switching: ${network}`
    );
  }

  async sendBitcoin(): Promise<string> {
    throw new Error(`${this.metadata.name} does not support sending Bitcoin!`);
  }

  async sendInscription(): Promise<{ txid: string }> {
    throw new Error(
      `${this.metadata.name} does not support sending inscriptions!`
    );
  }

  disconnect() {
    this.account = null;
    this.privateKey = null;
  }
}

interface TweakSignerOpts {
  network: bitcoin.networks.Network;
  tapTweak?: Buffer;
}

function tweakSigner(
  signer: ECPairInterface,
  opts: TweakSignerOpts = { network: bitcoin.networks.regtest }
): bitcoin.Signer {
  let privateKey: Uint8Array | undefined = signer.privateKey;
  if (!privateKey) {
    throw new Error("Private key is required for tweaking signer!");
  }
  if (signer.publicKey[0] === 3) {
    privateKey = ecc.privateNegate(privateKey);
  }

  const tweakedPrivateKey = ecc.privateAdd(
    privateKey,
    tapTweakHash(toXOnly(signer.publicKey), opts.tapTweak)
  );
  if (!tweakedPrivateKey) {
    throw new Error("Invalid tweaked private key!");
  }
  return ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey), {
    network: opts.network,
  });
}

function tapTweakHash(pubkey: Buffer, h: Buffer | undefined): Buffer {
  return taggedHash("TapTweak", Buffer.concat(h ? [pubkey, h] : [pubkey]));
}
