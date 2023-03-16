import { PoolQuery } from "../../../types/subgraph/__generated__/types";
import formatBigNumberString from "../formatBigNumberString";
import convertPoolType from "./convertPoolType";
import { GyroPoolTypes } from "../../../types/pool";

function findKeyPoolParams(poolData?: PoolQuery) {
  if (!poolData || !poolData.pool?.poolType) return "";

  const poolType = poolData.pool.poolType as GyroPoolTypes;
  const result = [convertPoolType(poolType) + " Key Pool Params"];

  if (poolType === "Gyro2") {
    const [alpha, beta] = [poolData.pool.sqrtAlpha, poolData.pool.sqrtBeta].map(
      (input) => formatBigNumberString(String(Math.pow(Number(input), 2)), 3)
    );
    result.push(String.fromCharCode(945) + ": " + alpha);
    result.push(String.fromCharCode(946) + ": " + beta);
  }

  if (poolType === "Gyro3") {
    const alpha = Math.pow(Number(poolData.pool.root3Alpha), 3);
    const oneOverAlpha = 1 / alpha;

    const formattedAlpha = formatBigNumberString(String(alpha), 3);
    const formattedOneOverAlpha = formatBigNumberString(
      String(oneOverAlpha),
      3,
      3
    );

    result.push(String.fromCharCode(945) + ": " + formattedAlpha);
    result.push("1/" + String.fromCharCode(945) + ": " + formattedOneOverAlpha);
  }

  if (poolType === "GyroE") {
    const { alpha, beta, lambda, s, c } = poolData.pool;
    const tan = String(Number(s) / Number(c));

    const [formattedAlpha, formattedBeta, pegPrice] = [alpha, beta, tan].map(
      (input) => formatBigNumberString(input as string, 3)
    );

    const formattedLambda = formatBigNumberString(
      lambda as string,
      (lambda as string).split(".")[1] ? 3 : 0
    );

    result.push(String.fromCharCode(945) + ": " + formattedAlpha);
    result.push(String.fromCharCode(946) + ": " + formattedBeta);
    result.push("Peg price: " + pegPrice);
    result.push(String.fromCharCode(955) + ": " + formattedLambda);
  }

  return result;
}

export default findKeyPoolParams;
