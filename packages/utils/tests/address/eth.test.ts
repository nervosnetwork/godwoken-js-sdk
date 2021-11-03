import test from "ava";
import { ethEoaAddressToGodwokenScriptHash160 } from "../../src/index";

test("ethEoaAddressToGodwokenScriptHash160", async (t) => {
  const ethAddress = "0x599f0453dbe60439c58feb4c6f8ed428fc6b7ae3";
  const rollupTypeHash =
    "0x2c0d067923d52277575beea08796667de2a947e59684f6d0ac21908a1b507f41";
  const ethAccountLockCodeHash =
    "0xee01ff6670fbc4e2625574070b26e91389a09d7651aae7cd6fb303ba6f7fe016";
  const godwokenScriptHash160 = "0xc794ba86f50a498e0f7913079afaca093684c596";

  const result = ethEoaAddressToGodwokenScriptHash160(
    ethAddress,
    rollupTypeHash,
    ethAccountLockCodeHash
  );

  t.is(result, godwokenScriptHash160);
});
