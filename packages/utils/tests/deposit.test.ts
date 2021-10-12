import { Cell } from "@ckb-lumos/base";
import test from "ava";
import { DepositLockArgs } from "@godwoken-js-sdk/base";

import { minimalDepositCapacity } from "../src/deposit";

test("deposit ckb", async (t) => {
  const expectedCapacity = "0x" + 29000000000n.toString(16);

  const outputCell: Cell = {
    cell_output: {
      capacity: "0x45d964b800",
      lock: {
        code_hash:
          "0xa9744c3dbf3309af977b77c379e8aaa12d9ed597d49ac345c925c98edd7d3a31",
        hash_type: "type",
        args: "0xa7f7e304cfcd2f8de6bd4fc800612fc4102d16906f51981674be528b1e653d4ea10000001000000030000000990000001f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d69000000100000003000000031000000ee01ff6670fbc4e2625574070b26e91389a09d7651aae7cd6fb303ba6f7fe0160134000000a7f7e304cfcd2f8de6bd4fc800612fc4102d16906f51981674be528b1e653d4e599f0453dbe60439c58feb4c6f8ed428fc6b7ae300a30200000000c0",
      },
    },
    data: "0x",
  };

  const depositLockArgs: DepositLockArgs = {
    owner_lock_hash:
      "0x1f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d",
    layer2_lock: {
      code_hash:
        "0xee01ff6670fbc4e2625574070b26e91389a09d7651aae7cd6fb303ba6f7fe016",
      hash_type: "type",
      args: "0xa7f7e304cfcd2f8de6bd4fc800612fc4102d16906f51981674be528b1e653d4e599f0453dbe60439c58feb4c6f8ed428fc6b7ae3",
    },
    cancel_timeout: "0xc00000000002a300",
  };

  const minimalCapacity = minimalDepositCapacity(
    outputCell.cell_output.type,
    outputCell.data,
    depositLockArgs
  );

  t.is(minimalCapacity, expectedCapacity);
});

test("deposit sudt", async (t) => {
  const expectedCapacity = "0x" + 37100000000n.toString(16);

  const outputCell: Cell = {
    cell_output: {
      capacity: "0x9502f9000",
      lock: {
        code_hash:
          "0xa9744c3dbf3309af977b77c379e8aaa12d9ed597d49ac345c925c98edd7d3a31",
        hash_type: "type",
        args: "0xa7f7e304cfcd2f8de6bd4fc800612fc4102d16906f51981674be528b1e653d4ea10000001000000030000000990000001f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d69000000100000003000000031000000ee01ff6670fbc4e2625574070b26e91389a09d7651aae7cd6fb303ba6f7fe0160134000000a7f7e304cfcd2f8de6bd4fc800612fc4102d16906f51981674be528b1e653d4e599f0453dbe60439c58feb4c6f8ed428fc6b7ae300a30200000000c0",
      },
      type: {
        code_hash:
          "0xc747b1d410d0c38a35397f44873bbd9b4df96ae7489cafbc4857d84121074e26",
        hash_type: "type",
        args: "0x1f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d",
      },
    },
    data: "0x64000000000000000000000000000000",
  };

  const depositLockArgs: DepositLockArgs = {
    owner_lock_hash:
      "0x1f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d",
    layer2_lock: {
      code_hash:
        "0xee01ff6670fbc4e2625574070b26e91389a09d7651aae7cd6fb303ba6f7fe016",
      hash_type: "type",
      args: "0xa7f7e304cfcd2f8de6bd4fc800612fc4102d16906f51981674be528b1e653d4e599f0453dbe60439c58feb4c6f8ed428fc6b7ae3",
    },
    cancel_timeout: "0xc00000000002a300",
  };

  const minimalCapacity = minimalDepositCapacity(
    outputCell.cell_output.type,
    outputCell.data,
    depositLockArgs
  );

  t.is(minimalCapacity, expectedCapacity);
});
