import gql from "graphql-tag";

export const POOL = gql`
  query Pool($id: ID!) {
    pool(id: $id) {
      ...PoolQuery_PoolFields
    }
  }

  fragment PoolQuery_PoolFields on Pool {
    id
    name
    poolType
    address
    totalLiquidity
    tokens {
      ...PoolQuery_PoolTokenFields
    }
    sqrtAlpha
    sqrtBeta
    root3Alpha
    alpha
    beta
    lambda
    s
    c
    tauAlphaX
    tauAlphaY
    tauBetaX
    tauBetaY
    u
    v
    w
    z
    dSq
    swapFee
    totalSwapFee
    totalSwapVolume
    totalShares
  }

  fragment PoolQuery_PoolTokenFields on PoolToken {
    id
    address
    balance
    decimals
    symbol
    name
  }
`;
