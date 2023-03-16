import { BigNumber } from "ethers";
import { Dispatch, SetStateAction, MutableRefObject } from "react";
import { PoolQuery } from "../../../types/subgraph/__generated__/types";
import { ZERO, ONE } from "../../constants/misc";
import safeParseFixed from "../safeParseFixed";

function balanceInputValues(
  inputValues: (BigNumber | null)[],
  setInputValues: Dispatch<SetStateAction<(BigNumber | null)[]>>,
  prevBalancedInputValues?: MutableRefObject<(BigNumber | null)[]>,
  poolData?: PoolQuery
) {
  if (inputValues.every((el) => el?.isZero()))
    return inputValues as BigNumber[];

  if (
    !poolData?.pool?.tokens?.length ||
    (prevBalancedInputValues &&
      JSON.stringify(inputValues) ===
        JSON.stringify(prevBalancedInputValues.current))
  )
    return;

  const alteredTokenIndex = inputValues.findIndex((value, index) => {
    const prevValue = prevBalancedInputValues
      ? prevBalancedInputValues.current[index]
      : ZERO;
    return value && (!prevValue || !value.eq(prevValue));
  });

  if (alteredTokenIndex < 0) return;

  const totalPoolBalance = poolData.pool.tokens
    .map(({ balance }) => safeParseFixed(balance, 18))
    .reduce((acc, el) => acc.add(el), ZERO);

  if (totalPoolBalance.isZero()) return;

  const proportions = poolData.pool.tokens.map(({ balance }) =>
    safeParseFixed(balance, 18).mul(ONE).div(totalPoolBalance)
  );

  const balancedInputValues = proportions.map((proportion) => {
    return (inputValues[alteredTokenIndex] as BigNumber)
      .mul(proportion)
      .div(proportions[alteredTokenIndex]);
  });

  setInputValues(balancedInputValues);

  if (prevBalancedInputValues)
    prevBalancedInputValues.current = balancedInputValues;

  return balancedInputValues;
}

export default balanceInputValues;
