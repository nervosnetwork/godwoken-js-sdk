import { Config } from "@godwoken-js-sdk/config-manager";
import test from "ava";
import { create2ContractAddressToGodwokenScriptHash160 } from "../../src/index";

const info = {
  ethAddress: "0xA76206c1E3E4c562c9e05fFCFeA04658D08220df",
  godwokenScriptHash160:
    "0x2E1b6cc9D4332772444E4dc336682c7dbD90552d".toLowerCase(),
};

const config: Config = {
  rollupTypeHash:
    "0x828b8a63f97e539ddc79e42fa62dac858c7a9da222d61fc80f0d61b44b5af5d4",
  polyjuice: {
    scriptCodeHash:
      "0x6677005599a98f86f003946eba01a21b54ed1f13a09f36b5e8bbcf7586b96b41",
    creatorAccountId: "0x3",
    ethAccountLockCodeHash: "",
  },
};

test("create2ContractAddressToGodwokenScriptHash160", async (t) => {
  const result = create2ContractAddressToGodwokenScriptHash160(
    info.ethAddress,
    { config }
  );

  t.is(result, info.godwokenScriptHash160);
});

test("create2ContractAddressToGodwokenScriptHash160 lower case", async (t) => {
  const result = create2ContractAddressToGodwokenScriptHash160(
    info.ethAddress.toLowerCase(),
    { config }
  );

  t.is(result, info.godwokenScriptHash160);
});
