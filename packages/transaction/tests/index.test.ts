import { Fee, WithdrawalRequest } from "@godwoken-js-sdk/base";
import { Config } from "@godwoken-js-sdk/config-manager";
import test from "ava";
import {
  generateTransactionMessage,
  generateTransferRawTransaction,
  generateWithdrawalRequest,
  signMessage,
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
      "0xf027377a0f7bb48836d0e4eb6b426531ff12345b79d7ecff9a6a2efa9d34063915756c4adc191f04f95f3c284f986eccbd05815ec040e2cd6faebcc39a0d642f00",
  },
  txHash: "0xc59d3cf93b35ae3aa76306783f18a1a2b0acce838be780d71b4d6534fba79ff8",
  privateKey:
    "0xe79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3",
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

test("generate transaction message", (t) => {
  const result = generateTransactionMessage(
    info.l2Transaction.raw,
    info.senderScriptHash,
    info.receiverScriptHash,
    info.rollupTypeHash
  );

  t.is(result, info.message);
});

test("signMessage", (t) => {
  const signature = signMessage(info.message, info.privateKey);

  t.is(signature, info.l2Transaction.signature);
});

class MockGodwokenClientForWithdrawal {
  public gw = {
    get_nonce: async () => "0x1",
  };
}

test("generate withdrawal request", async (t) => {
  const godwokenClient = new MockGodwokenClientForWithdrawal();
  const fromId = "0x2";
  const capacity = "0x" + (1000n * 10n ** 8n).toString(16);
  const amount = "0x0";
  const ownerLockHash =
    "0x1f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d";
  const privateKey =
    "0xe79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3";
  const fee: Fee = {
    sudt_id: "0x1",
    amount: "0x0",
  };

  const withdrawalRequest: WithdrawalRequest = {
    raw: {
      nonce: "0x1",
      capacity: "0x174876e800",
      amount: "0x0",
      sudt_script_hash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      account_script_hash:
        "0xd171c28fa9bb125d0de3231c2da4974083b7879465943f234d26b06fed37f2d4",
      sell_amount: "0x0",
      sell_capacity: "0x0",
      owner_lock_hash:
        "0x1f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d",
      payment_lock_hash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      fee: { sudt_id: "0x1", amount: "0x0" },
    },
    signature:
      "0x8a0499ea2012a407873b4111eb18719920148f467859eca9a7df7bae077d3ddd668df66be001cd2f007934f142cf1588a35c9c72844b65ee24b20e15006da1ac00",
  };

  const config: Config = {
    rollupTypeHash:
      "0x54f59d9fdf730651d2d16531d5f8d2dddf979df6264b73d491cfacf0c12177d2",
    polyjuice: {
      ethAccountLockCodeHash:
        "0xa25262966787e65e0d7730a5e72cb927153c50c9cab1a2bbe07063e2fce6bedd",
      creatorAccountId: "",
      scriptCodeHash:
        "0x7d6685ddd1e9ca555958a6722946e6d632ca0707cdd951b351db621029335187",
    },
  };

  const result = await generateWithdrawalRequest(
    godwokenClient as any,
    privateKey,
    {
      fromId,
      capacity,
      amount,
      ownerLockHash,
      fee,
    },
    {
      config,
    }
  );

  t.deepEqual(result, withdrawalRequest);
});
