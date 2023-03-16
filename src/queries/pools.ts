import gql from "graphql-tag";

// export const POOLS = gql`
//   query Pools($block24HoursAgo: Block_height) {
//     pools(where: { poolType_contains_nocase: "gyro" }) {
//       id
//       name
//       poolType
//       address
//       totalLiquidity
//       tokens {
//         id
//         address
//         balance
//         decimals
//         symbol
//       }
//       sqrtAlpha
//       sqrtBeta
//       root3Alpha
//       swapFee
//       totalSwapVolume
//     }
//     oneDayAgoPools: pools(
//       where: { poolType_contains_nocase: "gyro" }
//       block: $block24HoursAgo
//     ) {
//       id
//       totalSwapVolume
//     }
//   }
// `;

export const POOLS = gql`
  query Pools {
    pools(where: { poolType_contains_nocase: "gyro" }) {
      ...PoolFields
    }
  }

  fragment PoolFields on Pool {
    id
    name
    poolType
    address
    totalLiquidity
    tokens {
      ...TokenFields
    }
    sqrtAlpha
    sqrtBeta
    root3Alpha
    alpha
    beta
    swapFee
    totalSwapVolume
  }

  fragment TokenFields on PoolToken {
    id
    address
    balance
    decimals
    symbol
  }
`;
