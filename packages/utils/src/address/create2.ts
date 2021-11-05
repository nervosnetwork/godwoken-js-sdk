import { HexString, Script, utils } from "@ckb-lumos/base";
import { uint } from "@godwoken-js-sdk/base";
import { Config, getConfig } from "@godwoken-js-sdk/config-manager";
import { ethers } from "ethers";

export function create2ContractAddressToGodwokenScriptHash160(
  ethAddress: HexString,
  {
    config = getConfig(),
  }: {
    config?: Config;
  } = {}
): HexString {
  if (!ethers.utils.isAddress(ethAddress)) {
    throw new Error("eth address format error!");
  }

  const creatorAccountIdLe = uint.uint32ToLittleEndian(
    +config.polyjuice.creatorAccountId
  );

  const layer2Lock: Script = {
    code_hash: config.polyjuice.scriptCodeHash,
    hash_type: "type",
    args:
      config.rollupTypeHash +
      creatorAccountIdLe.slice(2) +
      ethAddress.slice(2).toLowerCase(),
  };
  const scriptHash = utils.computeScriptHash(layer2Lock);
  const scriptHash160 = scriptHash.slice(0, 42);
  return scriptHash160;
}
