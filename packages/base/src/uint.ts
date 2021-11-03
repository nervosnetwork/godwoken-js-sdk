import { HexString } from "@ckb-lumos/base";

export function uint32ToLittleEndian(num: number): HexString {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(num);
  return `0x${buf.toString("hex")}`;
}
