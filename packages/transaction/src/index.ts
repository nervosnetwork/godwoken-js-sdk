import { Hash, HexNumber, HexString, utils } from "@ckb-lumos/base";
import {
  RawL2Transaction,
  SudtTransfer,
  UnoinType,
  schemas,
  normalizers,
} from "@godwoken-js-sdk/base";
import { RPC } from "@godwoken-js-sdk/rpc";
import { Reader } from "ckb-js-toolkit";
import keccak256 from "keccak256";
import * as secp256k1 from "secp256k1";

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
