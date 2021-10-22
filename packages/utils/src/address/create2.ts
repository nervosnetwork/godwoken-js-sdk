import { HexString, Script, Hash, utils } from "@ckb-lumos/base";
import { uint } from "@godwoken-js-sdk/base";
import { ethers } from "ethers";

export function create2ContractAddressToGodwokenScriptHash160(
  ethAddress: HexString,
  rollupTypeHash: Hash,
  polyjuiceContractCodeHash: Hash,
  creatorAccountId: number
): HexString {
  if (!ethers.utils.isAddress(ethAddress)) {
    throw new Error("eth address format error!");
  }

  const creatorAccountIdLe = uint.uint32ToLittleEndian(creatorAccountId);

  const layer2Lock: Script = {
    code_hash: polyjuiceContractCodeHash,
    hash_type: "type",
    args:
      rollupTypeHash +
      creatorAccountIdLe.slice(2) +
      ethAddress.slice(2).toLowerCase(),
  };
  const scriptHash = utils.computeScriptHash(layer2Lock);
  const scriptHash160 = scriptHash.slice(0, 42);
  return scriptHash160;
}
