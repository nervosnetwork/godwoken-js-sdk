import test from "ava";
import {
  generateTransactionMessage,
  generateTransferRawTransaction,
} from "../src";

class MockGodwokenClient {
  public gw = {
    get_nonce: async () => "0x1",
  };
}

const info = {
  rollupTypeHash:
    "0x54f59d9fdf730651d2d16531d5f8d2dddf979df6264b73d491cfacf0c12177d2",
  fromId: "0x2",
  toScriptHash160: "0xf4ca2994226b6cba140116a0ff1d8126352bca11",
  sudtId: "0x1",
  amount: "0x" + 50000000000n.toString(16),
  fee: "0x0",
  senderScriptHash:
    "0xd171c28fa9bb125d0de3231c2da4974083b7879465943f234d26b06fed37f2d4",
  receiverScriptHash:
    "0x03e7758fcad023e7cf439ab648bfbd4458fb7ed03d06eab51a73fc8da559aa04",
  message: "0xcc3e67e309c0e6f76067f3627222d6958a4ecb1c536d04eeceadbf00e414e28c",
  l2Transaction: {
    raw: {
      from_id: "0x2",
      to_id: "0x1",
      nonce: "0x1",
      args: "0x010000004800000010000000280000003800000014000000f4ca2994226b6cba140116a0ff1d8126352bca1100743ba40b000000000000000000000000000000000000000000000000000000",
    },
    signature:
      "0x6a60d68aef49bd802f33daff6c45aa82bab55471b91a8912e7e35b4be3e315f47af4dd1140ea14702bfb8d4783e6c5e41e45b0be06f3d03d613d93b84e6b89c600",
  },
  txHash: "0x35564cae56c3c85c209c6e53d2cadeba3510e32c1978f39fbd584519db6caffa",
};

test("generate transfer raw transaction", async (t) => {
  const godwokenClient = new MockGodwokenClient();

  const result = await generateTransferRawTransaction(
    godwokenClient as any,
    info.fromId,
    info.toScriptHash160,
    info.sudtId,
    info.amount,
    info.fee
  );

  t.deepEqual(result, info.l2Transaction.raw);
});

test("generate transaction message", async (t) => {
  const result = generateTransactionMessage(
    info.l2Transaction.raw,
    info.senderScriptHash,
    info.receiverScriptHash,
    info.rollupTypeHash
  );

  t.is(result, info.message);
});
