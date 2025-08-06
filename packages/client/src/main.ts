import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";

bitcoin.initEccLib(ecc);

export { default as ZeusCore } from "./lib/core";
export * from "./lib/core";

export { default as ZeusService } from "./lib/service";
export * from "./lib/service";

export * from "./apis";

export * from "./programs";

export * from "./models";

export { default as ZeusLayer } from "./layers/zeus-layer";

export * from "./constants";

export * from "./utils";

export * from "./errors";

export * from "./types";
