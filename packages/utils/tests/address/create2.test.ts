import test from "ava";
import { create2ContractAddressToGodwokenScriptHash160 } from "../../src/index";

const info = {
  ethAddress: "0xA76206c1E3E4c562c9e05fFCFeA04658D08220df",
  rollupTypeHash:
    "0x828b8a63f97e539ddc79e42fa62dac858c7a9da222d61fc80f0d61b44b5af5d4",
  polyjuiceContractCodeHash:
    "0x6677005599a98f86f003946eba01a21b54ed1f13a09f36b5e8bbcf7586b96b41",
  creatorAccountId: 3,
  godwokenScriptHash160:
    "0x2E1b6cc9D4332772444E4dc336682c7dbD90552d".toLowerCase(),
};

test("create2ContractAddressToGodwokenScriptHash160", async (t) => {
  const result = create2ContractAddressToGodwokenScriptHash160(
    info.ethAddress,
    info.rollupTypeHash,
    info.polyjuiceContractCodeHash,
    info.creatorAccountId
  );

  t.is(result, info.godwokenScriptHash160);
});

test("create2ContractAddressToGodwokenScriptHash160 lower case", async (t) => {
  const result = create2ContractAddressToGodwokenScriptHash160(
    info.ethAddress.toLowerCase(),
    info.rollupTypeHash,
    info.polyjuiceContractCodeHash,
    info.creatorAccountId
  );

  t.is(result, info.godwokenScriptHash160);
});
