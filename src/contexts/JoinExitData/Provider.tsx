import { useQuery } from "@apollo/client";
import { ReactNode, useContext, useEffect, useState } from "react";
import useQueryParam from "../../hooks/useQueryParam";
import Context from "./Context";
import { JOIN_EXITS } from "../../queries/joinExits";
import { USER_JOIN_EXITS } from "../../queries/userJoinExits";
import {
  JoinExitsQuery,
  JoinExitsQueryVariables,
  JoinExitFieldsFragment,
  JoinExitTokenFieldsFragment,
  UserJoinExitsQuery,
  UserJoinExitsQueryVariables,
} from "../../../types/subgraph/__generated__/types";
import { Web3Context } from "../Web3";
import { PoolDataContext } from "../PoolData";
import { BigNumber } from "@ethersproject/bignumber";
import { ONE } from "../../constants/misc";
import safeParseFixed from "../../utils/safeParseFixed";
import { matchAddressToId } from "../../constants/whitelist";
import useThrottle from "../../hooks/useThrottle";

type JoinExitTokenDataType = JoinExitTokenFieldsFragment & {
  amount: string;
  value?: BigNumber;
};

export type JoinExitDataType = JoinExitFieldsFragment & {
  tokens?: JoinExitTokenDataType[];
  value?: BigNumber;
};

const INITAL_SELECTION_CHOICES: ("All" | "My")[] = ["All", "My"];

const Provider = ({ children }: { children: ReactNode }) => {
  const id = matchAddressToId(useQueryParam("poolAddress"));
  const { account } = useContext(Web3Context);
  const { prices } = useContext(PoolDataContext);

  const [loading, setLoading] = useState(true);
  const [allJoinsExits, setAllJoinsExits] = useState<JoinExitDataType[]>([]);
  const [userJoinsExits, setUserJoinsExits] = useState<JoinExitDataType[]>([]);

  const { throttle } = useThrottle();

  // Limit for number of data points to display
  const [limit, setLimit] = useState(5);

  function incrementLimit() {
    setLimit((prev) => prev + 5);
  }

  // Query for all relevant join/exits
  const { loading: loadingAll, data: dataAll } = useQuery<
    JoinExitsQuery,
    JoinExitsQueryVariables
  >(JOIN_EXITS, {
    variables: { id },
    pollInterval: 60000,
  });

  // Query for user relevant join/exits
  const { loading: loadingUser, data: dataUser } = useQuery<
    UserJoinExitsQuery,
    UserJoinExitsQueryVariables
  >(USER_JOIN_EXITS, {
    variables: { id, user: account?.toLowerCase() || "" },
    pollInterval: 60000,
  });

  // Add value to query data
  useEffect(() => {
    if (dataAll?.joinExits && prices) {
      setLoading(true);
      const pass = throttle();
      if (!pass) return;

      const newJoinExits: JoinExitDataType[] = dataAll.joinExits.map(
        (joinExit) => {
          const tokens = joinExit.pool?.tokens?.map((token, index) => {
            const price = prices[token.address];
            const amount = joinExit.amounts[index];
            const value = price
              ? price.mul(safeParseFixed(amount, 18)).div(ONE)
              : undefined;

            return {
              ...token,
              amount,
              value,
            };
          });

          const value = tokens
            ?.map(({ value }) => value)
            .reduce((acc, el) => {
              if (!acc || !el) return;
              return acc.add(el);
            });

          return {
            ...joinExit,
            tokens,
            value,
          };
        }
      );
      setAllJoinsExits(newJoinExits);
      setLoading(false);
    }
  }, [dataAll, prices]);

  // Add value to query data for user specific data
  useEffect(() => {
    if (dataUser?.joinExits && prices) {
      setLoading(true);
      const pass = throttle();
      if (!pass) return;

      const newJoinExits: JoinExitDataType[] = dataUser.joinExits.map(
        (joinExit) => {
          const tokens = joinExit.pool?.tokens?.map((token, index) => {
            const price = prices[token.address];
            const amount = joinExit.amounts[index];
            const value = price
              ? price.mul(safeParseFixed(amount, 18)).div(ONE)
              : undefined;

            return {
              ...token,
              amount,
              value,
            };
          });

          const value = tokens
            ?.map(({ value }) => value)
            .reduce((acc, el) => {
              if (!acc || !el) return;
              return acc.add(el);
            });

          return {
            ...joinExit,
            tokens,
            value,
          };
        }
      );

      setUserJoinsExits(newJoinExits);
      setLoading(false);
    }
  }, [dataUser, prices]);

  // Selection choice
  const [selected, setSelected] = useState<"All" | "My">("All");
  const [selectionChoices, setSelectionChoices] = useState(
    INITAL_SELECTION_CHOICES
  );

  // Remove "User Joins / Exits" choice when wallet is not connected
  useEffect(() => {
    if (!account) {
      setSelectionChoices([INITAL_SELECTION_CHOICES[0]]);
      setSelected(INITAL_SELECTION_CHOICES[0]);
    } else {
      setSelectionChoices(INITAL_SELECTION_CHOICES);
    }
  }, [account]);

  const data = selected === "All" ? allJoinsExits : userJoinsExits;

  // Reset limit on selection change or pool change
  useEffect(() => {
    setLimit(5);
  }, [selected, id]);

  // Align loading states
  useEffect(() => {
    if (loadingAll || loadingUser) setLoading(true);
  }, [loadingAll, loadingUser]);

  return (
    <Context.Provider
      value={{
        loading,
        data,
        selectionChoices,
        setSelected,
        selected,
        limit,
        incrementLimit,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
