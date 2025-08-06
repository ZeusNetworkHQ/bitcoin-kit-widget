import BigNumber from "bignumber.js";
import { AddressType, getAddressInfo } from "bitcoin-address-validation";
import * as bitcoin from "bitcoinjs-lib";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";

import type { BitcoinNetwork } from "@/types";

export function btcToSatoshi(
  btc: number | string | bigint | BigNumber,
): BigNumber {
  return BigNumber(btc).multipliedBy(1e8);
}

export function satoshiToBtc(
  btc: number | string | bigint | BigNumber,
): BigNumber {
  return BigNumber(btc).dividedBy(1e8);
}

export function getInternalXOnlyPubkey(bitcoinPublicKey: string) {
  return toXOnly(Buffer.from(bitcoinPublicKey, "hex"));
}

export function getP2trAddress(
  bitcoinPublicKey: string,
  config: { bitcoinNetwork: BitcoinNetwork },
) {
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(Buffer.from(bitcoinPublicKey, "hex")),
    network: bitcoin.networks[config.bitcoinNetwork],
  });

  if (!address) throw new Error("P2TR address not found");

  return address;
}

export function getReceiverXOnlyPubkey(bitcoinAddress: string): Buffer {
  const addressType = getAddressInfo(bitcoinAddress)?.type;

  switch (addressType) {
    case AddressType.p2tr: {
      const { data: tweakedXOnlyPublicKey } =
        bitcoin.address.fromBech32(bitcoinAddress);
      return tweakedXOnlyPublicKey;
    }

    case AddressType.p2wpkh: {
      const { data: pubkeyHash } = bitcoin.address.fromBech32(bitcoinAddress);
      const receiverAddress = new Uint8Array(32);
      receiverAddress.set(pubkeyHash, 0);
      return Buffer.from(receiverAddress);
    }

    case AddressType.p2pkh: {
      const { hash } = bitcoin.address.fromBase58Check(bitcoinAddress);
      const receiverAddress = new Uint8Array(32);
      receiverAddress.set(hash, 0);
      return Buffer.from(receiverAddress);
    }

    default:
      throw new Error(`Unsupported address type: ${addressType}`);
  }
}
