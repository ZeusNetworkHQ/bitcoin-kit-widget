import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";

bitcoin.initEccLib(ecc);

export { default as CoreConfig } from "./config/core";
export type * from "./config/core";

export * as Programs from "./programs";

export * as Models from "./models";

export * as Clients from "./clients";
export type * from "./clients";

// --- OTHERS ---

export * from "./types";

export * from "./constants";

export * from "./utils";

export * from "./errors";
