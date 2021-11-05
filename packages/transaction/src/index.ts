import { Hash, HexNumber, HexString, Script, utils } from "@ckb-lumos/base";
import {
  RawL2Transaction,
  SudtTransfer,
  UnoinType,
  schemas,
  normalizers,
  RawWithdrawalRequest,
  WithdrawalRequest,
  Fee,
} from "@godwoken-js-sdk/base";
import { RPC } from "@godwoken-js-sdk/rpc";
import { Reader } from "ckb-js-toolkit";
import keccak256 from "keccak256";
import * as secp256k1 from "secp256k1";
import { withdrawal, privateKeyToEthEoaAddress } from "@godwoken-js-sdk/utils";
import { Config, getConfig } from "@godwoken-js-sdk/config-manager";

const { SerializeRawL2Transaction, SerializeSUDTArgs } = schemas;
const { NormalizeRawL2Transaction, NormalizeSUDTTransfer } = normalizers;

/**
 *
 * @param godwokenClient
 * @param fromId uint32
 * @param toScriptHash160
 * @param sudtId uint32
 * @param amount uint128
 * @param fee uint128
 * @param rollupTypeHash
 * @returns
 */
export async function generateTransferRawTransaction(
  godwokenClient: RPC,
  fromId: HexNumber,
  toScriptHash160: HexString,
  sudtId: HexNumber,
  amount: HexNumber,
  fee: HexNumber
): Promise<RawL2Transaction> {
  const nonce = await godwokenClient.gw.get_nonce(fromId);

  const sudtTransfer: SudtTransfer = {
    to: toScriptHash160,
    amount: amount,
    fee: fee,
  };

  const sudtArgs: UnoinType = {
    type: "SUDTTransfer",
    value: NormalizeSUDTTransfer(sudtTransfer),
  };

  const serializedSudtArgs = new Reader(
    SerializeSUDTArgs(sudtArgs)
  ).serializeJson();

  const rawL2Transaction: RawL2Transaction = {
    from_id: fromId,
    to_id: sudtId,
    nonce: "0x" + BigInt(nonce).toString(16),
    args: serializedSudtArgs,
  };

  return rawL2Transaction;
}

export function generateTransactionMessage(
  rawL2Transaction: RawL2Transaction,
  senderScriptHash: Hash,
  receiverScriptHash: Hash,
  rollupTypeHash: Hash
): HexString {
  const rawTxHex = new Reader(
    SerializeRawL2Transaction(NormalizeRawL2Transaction(rawL2Transaction))
  ).serializeJson();

  const data =
    rollupTypeHash +
    senderScriptHash.slice(2) +
    receiverScriptHash.slice(2) +
    rawTxHex.slice(2);
  const message = new utils.CKBHasher().update(data).digestHex();

  const prefix = Buffer.from(`\x19Ethereum Signed Message:\n32`);
  const buf = Buffer.concat([prefix, Buffer.from(message.slice(2), "hex")]);
  return `0x${keccak256(buf).toString("hex")}`;
}

export function signMessage(message: Hash, privateKey: HexString): HexString {
  const signObject = secp256k1.ecdsaSign(
    new Uint8Array(new Reader(message).toArrayBuffer()),
    new Uint8Array(new Reader(privateKey).toArrayBuffer())
  );
  const signatureBuffer = new ArrayBuffer(65);
  const signatureArray = new Uint8Array(signatureBuffer);
  signatureArray.set(signObject.signature, 0);
  let v = signObject.recid;
  if (v >= 27) {
    v -= 27;
  }
  signatureArray.set([v], 64);

  const signature = new Reader(signatureBuffer).serializeJson();
  return signature;
}

export async function generateWithdrawalRequest(
  godwokenClient: RPC,
  privateKey: HexString,
  {
    fromId,
    capacity,
    amount,
    ownerLockHash,
    fee,
    sellCapacity = "0x0",
    sellAmount = "0x0",
    paymentLockHash = "0x" + "00".repeat(32),
    sudtScriptHash = "0x" + "00".repeat(32),
  }: {
    fromId: HexNumber;
    capacity: HexNumber;
    amount: HexNumber;
    ownerLockHash: Hash;
    fee: Fee;
    sellCapacity?: HexNumber;
    sellAmount?: HexNumber;
    paymentLockHash?: Hash;
    sudtScriptHash?: Hash;
  },
  {
    config = getConfig(),
  }: {
    config?: Config;
  } = {}
) {
  const ckbSudtScriptHash =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  if (config == null) {
    config = getConfig();
  }

  const isSudt = sudtScriptHash !== ckbSudtScriptHash;
  let minCapacity = withdrawal.minimalWithdrawalCapacity(isSudt);
  if (BigInt(capacity) < BigInt(minCapacity)) {
    throw new Error(
      `Withdrawal required ${BigInt(
        minCapacity
      )} shannons at least, provided ${BigInt(capacity)}.`
    );
  }

  const ethEoaAddress = privateKeyToEthEoaAddress(privateKey);
  const script: Script = {
    code_hash: config.polyjuice.ethAccountLockCodeHash,
    hash_type: "type",
    args: config.rollupTypeHash + ethEoaAddress.slice(2),
  };
  const accountScriptHash = utils.computeScriptHash(script);

  const nonce: HexNumber = await godwokenClient.gw.get_nonce(fromId);

  const rawWithdrawalRequest: RawWithdrawalRequest = {
    nonce,
    capacity,
    amount,
    sudt_script_hash: sudtScriptHash,
    account_script_hash: accountScriptHash,
    sell_amount: sellAmount,
    sell_capacity: sellCapacity,
    owner_lock_hash: ownerLockHash,
    payment_lock_hash: paymentLockHash,
    fee,
  };

  const message = generateWithdrawalMessage(
    rawWithdrawalRequest,
    config.rollupTypeHash
  );

  let signature: HexString = signMessage(message, privateKey);

  const withdrawalRequest: WithdrawalRequest = {
    raw: rawWithdrawalRequest,
    signature: signature,
  };

  return withdrawalRequest;
}

export function generateWithdrawalMessage(
  raw_request: RawWithdrawalRequest,
  rollupTypeHash: Hash
): HexString {
  const raw_request_data = new Reader(
    schemas.SerializeRawWithdrawalRequest(
      normalizers.NormalizeRawWithdrawalRequest(raw_request)
    )
  ).serializeJson();
  const hexData = rollupTypeHash + raw_request_data.slice(2);
  const message = new utils.CKBHasher().update(hexData).digestHex();

  const prefix = Buffer.from(`\x19Ethereum Signed Message:\n32`);
  const buf = Buffer.concat([prefix, Buffer.from(message.slice(2), "hex")]);
  return `0x${keccak256(buf).toString("hex")}`;
}
