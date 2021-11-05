import { Config } from "@godwoken-js-sdk/config-manager";
import test from "ava";
import {
  ethEoaAddressToGodwokenScriptHash160,
  privateKeyToEthEoaAddress,
} from "../../src";

const config: Config = {
  rollupTypeHash:
    "0x2c0d067923d52277575beea08796667de2a947e59684f6d0ac21908a1b507f41",
  polyjuice: {
    scriptCodeHash: "",
    creatorAccountId: "",
    ethAccountLockCodeHash:
      "0xee01ff6670fbc4e2625574070b26e91389a09d7651aae7cd6fb303ba6f7fe016",
  },
};

test("ethEoaAddressToGodwokenScriptHash160", async (t) => {
  const ethAddress = "0x599f0453dbe60439c58feb4c6f8ed428fc6b7ae3";
  const godwokenScriptHash160 = "0xc794ba86f50a498e0f7913079afaca093684c596";

  const result = ethEoaAddressToGodwokenScriptHash160(ethAddress, { config });

  t.is(result, godwokenScriptHash160);
});

test("privateKeyToEthEoaAddress", (t) => {
  const privateKey =
    "0xe79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3";
  const ethAddress = "0x599f0453dbe60439c58feb4c6f8ed428fc6b7ae3";

  const result = privateKeyToEthEoaAddress(privateKey);

  t.is(result, ethAddress);
});
