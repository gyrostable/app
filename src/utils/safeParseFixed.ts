import { BigNumber, parseFixed } from "@ethersproject/bignumber";

/// Parses a fixed-point decimal string into a BigNumber
/// If we do not have enough decimals to express the number, we truncate it
export default function safeParseFixed(
  value: string,
  decimals: number = 0
): BigNumber {
  value = value.split(",").join("");
  const [integer, fraction] = value.split(".");
  if (!fraction) {
    return parseFixed(value, decimals);
  }
  const safeValue = integer + "." + fraction.slice(0, decimals);
  return parseFixed(safeValue, decimals);
}
