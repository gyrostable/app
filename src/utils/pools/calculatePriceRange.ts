import { PoolFieldsFragment } from "../../../types/subgraph/__generated__/types";

function calculatePriceRange(pool: PoolFieldsFragment | null | undefined) {
  let lowerBound = "-";
  let upperBound = "-";

  if (pool?.sqrtAlpha && pool?.sqrtBeta) {
    lowerBound = Math.pow(Number(pool.sqrtAlpha), 2).toFixed(4);
    upperBound = Math.pow(Number(pool.sqrtBeta), 2).toFixed(4);
  }

  if (pool?.root3Alpha) {
    lowerBound = Math.pow(Number(pool.root3Alpha), 3).toFixed(4);
    upperBound = (1 / Math.pow(Number(pool.root3Alpha), 3)).toFixed(4);
  }

  if (pool?.alpha) {
    lowerBound = Number((pool as PoolFieldsFragment).alpha).toFixed(4);
    upperBound = Number((pool as PoolFieldsFragment).beta).toFixed(4);
  }

  return [lowerBound, upperBound];
}

export default calculatePriceRange;
