import test from "ava";

import { minimalWithdrawalCapacity } from "../src/withdrawal";

test("withdraw ckb", async (t) => {
  const expectedCapacity = "0x" + 26500000000n.toString(16);

  const minimalCapacity = minimalWithdrawalCapacity(false);

  t.is(minimalCapacity, expectedCapacity);
});

test("withdraw sudt", async (t) => {
  const expectedCapacity = "0x" + 34600000000n.toString(16);

  const minimalCapacity = minimalWithdrawalCapacity(true);

  t.is(minimalCapacity, expectedCapacity);
});
