import { Cell, Hash, HexNumber, HexString, Script } from "@ckb-lumos/base";
import { minimalCellCapacity } from "@ckb-lumos/helpers";
import {
  CustodianLockArgs,
  DepositLockArgs,
  schemas,
  normalizers,
} from "@godwoken-js-sdk/base";
import { Reader } from "ckb-js-toolkit";

const { SerializeCustodianLockArgs } = schemas;
const { NormalizeCustodianLockArgs } = normalizers;

export function minimalDepositCapacity(
  outputType: Script | undefined,
  outputData: HexString,
  depositLockArgs: DepositLockArgs
): HexNumber {
  // fixed size, the specific value is not important.
  const dummyHash: Hash = "0x" + "00".repeat(32);
  const dummyHexNumber: HexNumber = "0x0";
  const rollupTypeHash: Hash = dummyHash;

  const custodianLockArgs: CustodianLockArgs = {
    deposit_block_hash: dummyHash,
    deposit_block_number: dummyHexNumber,
    deposit_lock_args: depositLockArgs,
  };

  const serializedCustodianLockArgs: HexString = new Reader(
    SerializeCustodianLockArgs(NormalizeCustodianLockArgs(custodianLockArgs))
  ).serializeJson();

  const args = rollupTypeHash + serializedCustodianLockArgs.slice(2);

  const lock: Script = {
    code_hash: dummyHash,
    hash_type: "data",
    args,
  };

  const cell: Cell = {
    cell_output: {
      lock,
      type: outputType,
      capacity: "0x0",
    },
    data: outputData,
  };
  const capacity: bigint = minimalCellCapacity(cell);

  return "0x" + capacity.toString(16);
}
