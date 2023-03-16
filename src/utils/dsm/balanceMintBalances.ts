import { formatFixed } from "@ethersproject/bignumber";
import { MutableRefObject } from "react";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { ONE } from "../../constants/misc";
import safeParseFixed from "../safeParseFixed";

const balanceMintBalances = (
  fieldValues: string[],
  reserveState: DataTypes.ReserveStateStructOutput,
  prevBalancedMintBalances: MutableRefObject<string[]>
): [boolean, string[]] => {
  if (fieldValues.length < prevBalancedMintBalances.current.length) {
    return [false, []];
  }

  if (
    JSON.stringify(fieldValues) === JSON.stringify(prevBalancedMintBalances)
  ) {
    return [false, []];
  }

  const alteredTokenIndex = fieldValues.findIndex((value, index) => {
    const prevValue = prevBalancedMintBalances
      ? prevBalancedMintBalances.current[index]
      : "";
    return value && (!prevValue || !(Number(value) === Number(prevValue)));
  });

  if (alteredTokenIndex < 0) {
    return [false, []];
  }

  if (!fieldValues[alteredTokenIndex]) {
    return [false, []];
  }

  const relevantVaults = reserveState.vaults.filter(
    ({ idealWeight }) => !idealWeight.isZero()
  );
  const idealWeights = relevantVaults.map(({ idealWeight }) => idealWeight);

  const alteredBalance = safeParseFixed(fieldValues[alteredTokenIndex], 18);

  const valueOfAlteredToken = alteredBalance
    .mul(relevantVaults[alteredTokenIndex].price)
    .div(ONE);

  const balancedMintBalances = idealWeights
    .map((idealWeight) =>
      valueOfAlteredToken.mul(idealWeight).div(idealWeights[alteredTokenIndex])
    ) // balanced mint values
    .map((idealValue, index) =>
      idealValue.mul(ONE).div(relevantVaults[index].price)
    ) // balanced mint balances
    .map((bn) => formatFixed(bn, 18)) // balanced mint balances string
    .map((value, index) =>
      index === alteredTokenIndex ||
      (fieldValues[index] !== "" &&
        Number(value) === Number(fieldValues[index]))
        ? fieldValues[index]
        : value
    ); // Leave field value unchanged if numeric value is equal or if index is altered token index

  if (balancedMintBalances.some((el) => Number(el) < 0)) return [false, []];

  prevBalancedMintBalances.current = balancedMintBalances;

  return [true, balancedMintBalances];
};

export default balanceMintBalances;
