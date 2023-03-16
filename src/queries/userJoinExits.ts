import gql from "graphql-tag";

export const USER_JOIN_EXITS = gql`
  query UserJoinExits($id: String, $user: String) {
    joinExits(
      where: { pool: $id, user: $user }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      type
      sender
      amounts
      pool {
        id
        tokens {
          symbol
          address
          decimals
        }
      }
      timestamp
      tx
    }
  }
`;
