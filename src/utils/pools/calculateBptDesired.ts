import { PoolQuery_PoolTokenFieldsFragment } from "../../../types/subgraph/__generated__/types";
import { BigNumber } from "ethers";
import { ZERO, ONE } from "../../constants/misc";
import safeParseFixed from "../safeParseFixed";

function calculateBptDesired(
  totalShares: string,
  tokens: PoolQuery_PoolTokenFieldsFragment[],
  amounts: BigNumber[]
) {
  if (tokens) {
    const firstTokenAmount = safeParseFixed(tokens[0].balance, 18);
    const multiplier = amounts[0].mul(ONE).div(firstTokenAmount);
    const totalSharesBigNumber = safeParseFixed(totalShares, 18);
    return totalSharesBigNumber.mul(multiplier).div(ONE);
  }
  return ZERO;
}

export default calculateBptDesired;
