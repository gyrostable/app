import { useQuery } from "@apollo/client";
import { formatFixed } from "@ethersproject/bignumber";
import { ReactNode, useContext, useEffect, useState } from "react";
import useQueryParam from "../../hooks/useQueryParam";
import Context from "./Context";
import { Web3Context } from "../Web3";
import { USER_SHARES } from "../../queries/userShares";
import {
  UserSharesQuery,
  UserSharesQueryVariables,
} from "../../../types/subgraph/__generated__/types";
import { PoolDataContext } from "../PoolData";
import { BigNumber } from "@ethersproject/bignumber";
import { ZERO, ONE } from "../../constants/misc";
import { TokensShareData } from "./Context";
import safeParseFixed from "../../utils/safeParseFixed";
import { matchAddressToId } from "../../constants/whitelist";
import { PAMMContext } from "../PAMM";
import useThrottle from "../../hooks/useThrottle";

const Provider = ({ children }: { children: ReactNode }) => {
  const id = matchAddressToId(useQueryParam("poolAddress"));
  const { account } = useContext(Web3Context);
  const {
    data: poolData,
    loading: poolLoading,
    prices,
  } = useContext(PoolDataContext);
  const { underlierTokens } = useContext(PAMMContext);

  const [data, setData] = useState<TokensShareData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState<BigNumber>();
  const [userShareBalance, setUserShareBalance] = useState<BigNumber>(ZERO);
  const [subgraphOutOfSync, setSubgraphOutOfSync] = useState(false);

  const { throttle } = useThrottle();

  // Query
  const { loading: userSharesLoading, data: userSharesData } = useQuery<
    UserSharesQuery,
    UserSharesQueryVariables
  >(USER_SHARES, {
    variables: { id, user: account?.toLowerCase() || "" },
    pollInterval: 60000,
  });

  // Calculation
  useEffect(() => {
    (async function () {
      if (poolData?.pool && prices) {
        setLoading(true);
        const pass = await throttle(1000);
        if (!pass) return;

        const shareBalance =
          userSharesData?.user?.sharesOwned?.length &&
          userSharesData.user.sharesOwned[0].balance;

        const totalShareBalance =
          userSharesData?.user?.sharesOwned?.length &&
          userSharesData.user.sharesOwned[0].poolId.totalShares;

        const share =
          shareBalance && totalShareBalance
            ? safeParseFixed(shareBalance, 18)
                .mul(ONE)
                .div(safeParseFixed(totalShareBalance, 18))
            : ZERO;

        if (!poolData.pool.tokens) {
          setLoading(false);
          return setData([]);
        }

        const newTokenSharesData = poolData.pool.tokens.map(
          ({ balance: totalPoolBalance, symbol, name, address }) => {
            const balance = safeParseFixed(totalPoolBalance, 18)
              .mul(share)
              .div(ONE);

            const price = prices[address];
            const value = price ? balance.mul(price).div(ONE) : undefined;

            return {
              name,
              symbol,
              address,
              balance,
              value,
              price,
              allowed: true,
            };
          }
        );

        setData(newTokenSharesData);

        const totalValue = newTokenSharesData
          .map(({ value }) => value)
          .reduce((acc, el) => {
            if (!acc || !el) return;
            return el.add(acc);
          }, ZERO);

        setTotalValue(totalValue);

        const lpToken = underlierTokens.find(
          ({ address }) =>
            poolData.pool?.address.toLowerCase() === address.toLowerCase()
        );

        if (lpToken) {
          const isEqualDollarValue =
            Math.floor(Number(formatFixed(lpToken?.value ?? ZERO, 18))) ===
            Math.floor(Number(formatFixed(totalValue ?? ZERO, 18)));

          setSubgraphOutOfSync(!isEqualDollarValue);
        }

        setUserShareBalance(
          (!!shareBalance && safeParseFixed(shareBalance, 18)) || ZERO
        );
        setLoading(false);
      }
    })();
  }, [poolData, userSharesData, prices]);

  // Align loading states
  useEffect(() => {
    if (userSharesLoading || poolLoading) setLoading(true);
  }, [userSharesLoading, poolLoading]);

  return (
    <Context.Provider
      value={{
        loading,
        data,
        totalValue,
        userShareBalance,
        subgraphOutOfSync,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
