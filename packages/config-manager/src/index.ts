import { Hash, HexNumber } from "@ckb-lumos/base";

export interface Config {
  rollupTypeHash: Hash;
  polyjuice: PolyjuiceConfig;
}

export interface PolyjuiceConfig {
  // type hash
  scriptCodeHash: Hash;
  creatorAccountId: HexNumber;
  // type hash
  ethAccountLockCodeHash: Hash;
}

let config: Config | undefined = undefined;

export function initializeConfig(iConfig: Config) {
  config = iConfig;
}

export function getConfig(): Config {
  if (config == null) {
    throw new Error("Initialize config first!");
  }
  return config;
}
