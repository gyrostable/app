import { BigNumber } from "ethers";

function formatBigNumberString(
  input: string,
  decimals?: number,
  maxDecimals: number = 10
) {
  if (decimals === 0) {
    return addThousandsSeparators(input.split(".")[0]);
  }

  if (!decimals) {
    return (
      addThousandsSeparators(input.split(".")[0]) +
      (input.split(".")[1] ? "." + input.split(".")[1] : "")
    );
  }

  if (input.split(".").length === 1) {
    input = addThousandsSeparators(input) + (decimals > 0 ? "." : "");
    for (let i = 0; i < decimals; i++) {
      input += "0";
    }
    return input;
  }

  const integer = input.split(".")[0];
  let decimalsPart = input.split(".")[1];
  const decimalLength = input.split(".")[1].length;

  if (decimalLength <= decimals) {
    for (let i = 0; i < decimals - decimalLength; i++) {
      decimalsPart += "0";
    }
    return addThousandsSeparators(input.split(".")[0]) + "." + decimalsPart;
  }

  if (BigNumber.from(integer).isZero()) {
    let nonZero = 0;
    for (let i = 0; i < decimalLength; i++) {
      if (decimalsPart[i] !== "0" || nonZero) {
        nonZero++;
      }

      if (i === maxDecimals) return "0." + decimalsPart.slice(0, maxDecimals);

      if (nonZero === decimals)
        return "0." + decimalsPart.slice(0, i + decimals - nonZero + 1);
    }
  }

  return (
    addThousandsSeparators(input.split(".")[0]) +
    "." +
    decimalsPart.slice(0, decimals)
  );
}

export function addThousandsSeparators(input: string) {
  const reversedArray = Array.from(input).reverse();
  const reversedOutput: string[] = [];

  for (let i = 0; i < reversedArray.length; i++) {
    reversedOutput.push(reversedArray[i]);
    if ((i + 1) % 3 === 0 && i !== reversedArray.length - 1)
      reversedOutput.push(",");
  }

  return reversedOutput.reverse().join("");
}

export default formatBigNumberString;
