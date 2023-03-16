import { BigNumber } from "ethers";
import { parseFixed } from "@ethersproject/bignumber";
import { GyroPoolTypes } from "../../../types/pool";
import { ZERO } from "../../constants/misc";
import {
  _calculateInvariant as calculateInvariantGyro2,
  _findVirtualParams as findVirtualParamsGyro2,
  _calculateNewSpotPrice as calculateNewSpotPriceGyro2,
} from "../sor/gyro2Pool/gyro2Math";
import {
  _calculateInvariant as calculateInvariantGyro3,
  _calculateNewSpotPrice as calculateNewSpotPriceGyro3,
} from "../sor/gyro3Pool/gyro3Math";
import {
  calculateInvariantWithError,
  calcSpotPriceAfterSwapOutGivenIn,
} from "../sor/gyroEPool/gyroEMath/gyroEMath";
import { _normalizeBalances } from "../sor/gyroHelpers/helpers";
import {
  PoolQuery_PoolFieldsFragment,
  PoolQuery_PoolTokenFieldsFragment,
} from "../../../types/subgraph/__generated__/types";
import { mulDown } from "../sor/gyroHelpers/gyroSignedFixedPoint";
import { Vector2 } from "../sor/gyroEPool/gyroEMath/gyroEMathHelpers";

type Gyro2Params = {
  balanceIn: BigNumber;
  balanceOut: BigNumber;
  decimalsIn: number;
  decimalsOut: number;
  sqrtAlpha: BigNumber;
  sqrtBeta: BigNumber;
  swapFee: BigNumber;
};

type Gyro3Params = {
  balanceIn: BigNumber;
  balanceOut: BigNumber;
  balanceTertiary: BigNumber;
  decimalsIn: number;
  decimalsOut: number;
  decimalsTertiary: number;
  root3Alpha: BigNumber;
  swapFee: BigNumber;
};

type GyroEParams = {
  balanceIn: BigNumber;
  balanceOut: BigNumber;
  decimalsIn: number;
  decimalsOut: number;
  gyroEParams: {
    alpha: BigNumber;
    beta: BigNumber;
    c: BigNumber;
    s: BigNumber;
    lambda: BigNumber;
  };
  derivedGyroEParams: {
    tauAlpha: Vector2;
    tauBeta: Vector2;
    u: BigNumber;
    v: BigNumber;
    w: BigNumber;
    z: BigNumber;
    dSq: BigNumber;
  };
  swapFee: BigNumber;
};

type GyroPoolParams = Gyro2Params | Gyro3Params | GyroEParams;

export function destructureRequiredPoolParams(
  poolData: PoolQuery_PoolFieldsFragment
) {
  const tokens = poolData.tokens as PoolQuery_PoolTokenFieldsFragment[];
  const balanceIn = parseFixed(tokens[0].balance, tokens[0].decimals);
  const balanceOut = parseFixed(tokens[1].balance, tokens[1].decimals);

  if (poolData.poolType === "Gyro2") {
    return {
      balanceIn,
      balanceOut,
      decimalsIn: tokens[0].decimals,
      decimalsOut: tokens[1].decimals,
      sqrtAlpha: parseFixed(poolData.sqrtAlpha as string, 18),
      sqrtBeta: parseFixed(poolData.sqrtBeta as string, 18),
      swapFee: parseFixed(poolData.swapFee, 18),
    } as Gyro2Params;
  }

  if (poolData.poolType === "Gyro3") {
    const balanceTertiary = parseFixed(tokens[2].balance, tokens[2].decimals);

    return {
      balanceIn,
      balanceOut,
      balanceTertiary,
      decimalsIn: tokens[0].decimals,
      decimalsOut: tokens[1].decimals,
      decimalsTertiary: tokens[2].decimals,
      root3Alpha: parseFixed(poolData.root3Alpha as string, 18),
      swapFee: parseFixed(poolData.swapFee, 18),
    } as Gyro3Params;
  }

  return {
    balanceIn,
    balanceOut,
    decimalsIn: tokens[0].decimals,
    decimalsOut: tokens[1].decimals,
    gyroEParams: {
      alpha: parseFixed(poolData.alpha as string, 18),
      beta: parseFixed(poolData.beta as string, 18),
      c: parseFixed(poolData.c as string, 18),
      s: parseFixed(poolData.s as string, 18),
      lambda: parseFixed(poolData.lambda as string, 18),
    },
    derivedGyroEParams: {
      tauAlpha: {
        x: parseFixed(poolData.tauAlphaX as string, 38),
        y: parseFixed(poolData.tauAlphaY as string, 38),
      },
      tauBeta: {
        x: parseFixed(poolData.tauBetaX as string, 38),
        y: parseFixed(poolData.tauBetaY as string, 38),
      },
      u: parseFixed(poolData.u as string, 38),
      v: parseFixed(poolData.v as string, 38),
      w: parseFixed(poolData.w as string, 38),
      z: parseFixed(poolData.z as string, 38),
      dSq: parseFixed(poolData.dSq as string, 38),
    },
    swapFee: parseFixed(poolData.swapFee, 18),
  } as GyroEParams;
}

function calculateSpotPrice(poolType: GyroPoolTypes, params: GyroPoolParams) {
  if (poolType === "Gyro2") {
    const price = calculateGyro2SpotPrice(params as Gyro2Params);
    return price;
  }

  if (poolType === "Gyro3") {
    const price = calculateGyro3SpotPrice(params as Gyro3Params);
    return price;
  }

  if (poolType === "GyroE") {
    const price = calculateGyroESpotPrice(params as GyroEParams);
    return price;
  }
}

export default calculateSpotPrice;

function calculateGyro2SpotPrice(params: Gyro2Params): BigNumber {
  const balances = [params.balanceIn, params.balanceOut];
  const normalizedBalances = _normalizeBalances(balances, [
    params.decimalsIn,
    params.decimalsOut,
  ]);

  const invariant = calculateInvariantGyro2(
    normalizedBalances,
    params.sqrtAlpha,
    params.sqrtBeta
  );
  const [virtualParamIn, virtualParamOut] = findVirtualParamsGyro2(
    invariant,
    params.sqrtAlpha,
    params.sqrtBeta
  );
  const newSpotPrice = calculateNewSpotPriceGyro2(
    normalizedBalances,
    ZERO,
    ZERO,
    virtualParamIn,
    virtualParamOut,
    params.swapFee
  );
  return newSpotPrice;
}

function calculateGyro3SpotPrice(params: Gyro3Params): BigNumber {
  const balances = [
    params.balanceIn,
    params.balanceOut,
    params.balanceTertiary,
  ];
  const decimals = [
    params.decimalsIn,
    params.decimalsOut,
    params.decimalsTertiary,
  ];
  const normalizedBalances = _normalizeBalances(balances, decimals);
  const invariant = calculateInvariantGyro3(
    normalizedBalances,
    params.root3Alpha
  );
  const virtualOffsetInOut = mulDown(invariant, params.root3Alpha);
  const newSpotPrice = calculateNewSpotPriceGyro3(
    normalizedBalances,
    ZERO,
    ZERO,
    virtualOffsetInOut,
    params.swapFee
  );
  return newSpotPrice;
}

function calculateGyroESpotPrice(params: GyroEParams): BigNumber {
  const normalizedBalances = _normalizeBalances(
    [params.balanceIn, params.balanceOut],
    [params.decimalsIn, params.decimalsOut]
  );

  const [currentInvariant, invErr] = calculateInvariantWithError(
    normalizedBalances,
    params.gyroEParams,
    params.derivedGyroEParams
  );
  const invariant: Vector2 = {
    x: currentInvariant.add(invErr.mul(2)),
    y: currentInvariant,
  };
  const newSpotPrice = calcSpotPriceAfterSwapOutGivenIn(
    normalizedBalances,
    ZERO,
    true,
    params.gyroEParams,
    params.derivedGyroEParams,
    invariant,
    params.swapFee
  );
  return newSpotPrice;
}
