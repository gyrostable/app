import gql from "graphql-tag";

export const USER_SHARES = gql`
  query UserShares($id: String, $user: ID!) {
    user(id: $user) {
      sharesOwned(where: { poolId: $id }) {
        balance
        poolId {
          totalShares
        }
      }
    }
  }
`;
