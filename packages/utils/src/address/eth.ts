import { HexString, Script, utils } from "@ckb-lumos/base";
import { getConfig, Config } from "@godwoken-js-sdk/config-manager";
import { RPC } from "@godwoken-js-sdk/rpc";

export function ethEoaAddressToGodwokenScriptHash160(
  ethAddress: HexString,
  {
    config,
  }: {
    config: Config;
  } = {
    config: getConfig(),
  }
): HexString {
  if (ethAddress.length !== 42 || !ethAddress.startsWith("0x")) {
    throw new Error("eth address format error!");
  }

  const layer2Lock: Script = {
    code_hash: config.polyjuice.ethAccountLockCodeHash,
    hash_type: "type",
    args: config.rollupTypeHash + ethAddress.slice(2).toLowerCase(),
  };
  const scriptHash = utils.computeScriptHash(layer2Lock);
  const scriptHash160 = scriptHash.slice(0, 42);
  return scriptHash160;
}

export async function godwokenScriptHash160ToEthEoaAddress(
  godwokenRpc: RPC,
  scriptHash160: HexString
): Promise<HexString> {
  const scriptHash = await godwokenRpc.gw.get_script_hash_by_short_address(
    scriptHash160
  );
  if (scriptHash == null) {
    throw new Error(
      `ScriptHash not found by script hash 160: ${scriptHash160}`
    );
  }
  const script = await godwokenRpc.gw.get_script(scriptHash);
  if (script == null) {
    throw new Error(`Script not found by script hash 160: ${scriptHash160}`);
  }
  const ethAddress = "0x" + script.args.slice(66);
  return ethAddress;
}
