import gql from "graphql-tag";

export const JOIN_EXITS = gql`
  query JoinExits($id: String) {
    joinExits(where: { pool: $id }, orderBy: timestamp, orderDirection: desc) {
      ...JoinExitFields
    }
  }

  fragment JoinExitFields on JoinExit {
    id
    type
    sender
    amounts
    pool {
      ...JoinExitPoolFields
    }
    timestamp
    tx
  }

  fragment JoinExitPoolFields on Pool {
    id
    tokens {
      ...JoinExitTokenFields
    }
  }

  fragment JoinExitTokenFields on PoolToken {
    symbol
    address
    decimals
  }
`;
