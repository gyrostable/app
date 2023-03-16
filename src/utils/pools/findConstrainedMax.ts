import { BigNumber } from "ethers";
import { PoolQuery } from "../../../types/subgraph/__generated__/types";
import { ONE, ZERO } from "../../constants/misc";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { MAX_AMOUNT_BUFFER } from "../../constants/misc";
import safeParseFixed from "../safeParseFixed";

const findConstrainedMax = (
  walletData: WalletTokenDataType[],
  poolData?: PoolQuery
): BigNumber[] | undefined => {
  // Pool
  if (!poolData?.pool?.tokens?.length) return;

  const totalPoolBalance = poolData.pool.tokens
    .map(({ balance }) => safeParseFixed(balance, 18))
    .reduce((acc, el) => acc.add(el), ZERO);

  if (totalPoolBalance.isZero()) return;

  const poolProportions = poolData.pool.tokens.map(({ balance }) =>
    safeParseFixed(balance, 18).mul(ONE).div(totalPoolBalance)
  );

  // Wallet
  const totalWalletBalance = walletData
    .map(({ balance }) => balance)
    .reduce((acc, el) => acc.add(el), ZERO);

  if (totalWalletBalance.isZero()) return;

  const walletProportions = walletData.map(({ balance }) =>
    balance.mul(ONE).div(totalWalletBalance)
  );

  // Find constrained max values
  const ratioOfProportions = walletProportions.map((bn, index) =>
    bn.mul(ONE).div(poolProportions[index])
  );

  const minRatio = ratioOfProportions.reduce(
    (acc, el) => (acc.lt(el) ? acc : el),
    ratioOfProportions[0]
  );

  const minRatioIndex = ratioOfProportions.findIndex((val) => val.eq(minRatio));

  const result = new Array(walletData.length).fill(ZERO) as BigNumber[];
  result[minRatioIndex] =
    walletData[minRatioIndex].balance.sub(MAX_AMOUNT_BUFFER);

  if (result[minRatioIndex].lt(ZERO)) result[minRatioIndex] = ZERO;

  return result;
};

export default findConstrainedMax;
