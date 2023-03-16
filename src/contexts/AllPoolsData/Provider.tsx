import { Contract } from "ethers";
import { useQuery } from "@apollo/client";
import { useRollbar } from "@rollbar/react";
import { ReactNode, useContext, useEffect, useState } from "react";
import Context from "./Context";
import { PoolsQuery } from "../../../types/subgraph/__generated__/types";
import { POOLS } from "../../queries/pools";
import fetchPrice from "../../utils/api/fetchPrice";
import { Web3Context } from "../Web3";
import { BigNumber } from "@ethersproject/bignumber";
import { ZERO, ONE } from "../../constants/misc";
// import useBlockNumber from "../../hooks/useBlockNumber";
import safeParseFixed from "../../utils/safeParseFixed";
import { POOL_WHITELIST } from "../../constants/whitelist";
import { GyroPoolTypes } from "../../../types/pool";
import multicall from "../../utils/multicall";
import { ABI_MAP } from "../../abis";
import { contracts } from "../../constants/contracts";
import { Multicall } from "../../../types/typechain";
import useThrottle from "../../hooks/useThrottle";

type PricesType = { [key: string]: BigNumber } | null;

const Provider = ({ children }: { children: ReactNode }) => {
  const { selectedNetworkConfig, readOnlyProvider } = useContext(Web3Context);

  const [data, setData] = useState<any[]>([]);
  const [prices, setPrices] = useState<PricesType>(null);
  const [loading, setLoading] = useState(true);

  const rollbar = useRollbar();

  const { throttle } = useThrottle();

  // const { blockNumber24HoursAgo } = useBlockNumber();

  // Pools Query
  const { loading: queryLoading, data: queryData } = useQuery<PoolsQuery>(
    POOLS,
    {
      // variables: { block24HoursAgo: { number: blockNumber24HoursAgo } },
      pollInterval: 60000,
    }
  );

  //   Query for prices
  useEffect(() => {
    (async () => {
      // if (queryData?.pools && blockNumber24HoursAgo > 0) {
      if (queryData?.pools) {
        setLoading(true);
        const pass = await throttle();
        if (!pass) return;

        let uniqueTokenAddresses: string[] = [];

        const filteredPools = queryData.pools.filter(({ id }) =>
          POOL_WHITELIST.includes(id)
        );

        filteredPools.forEach((pool) =>
          pool.tokens?.forEach(
            ({ address }) =>
              !uniqueTokenAddresses.includes(address) &&
              uniqueTokenAddresses.push(address)
          )
        );

        const newPrices: PricesType = {};

        await Promise.all(
          uniqueTokenAddresses.map(async (address) => {
            try {
              const newPrice = await fetchPrice(
                selectedNetworkConfig.coingeckoId,
                address
              );
              newPrices[address] = newPrice;
            } catch (e) {
              console.error(e);
              rollbar.warning(
                "Error fetching price for token address: " + address
              );
            }
          })
        );

        setPrices(newPrices);

        const newPoolsData = filteredPools.map((pool) => {
          // const oneDayAgoPool = queryData.oneDayAgoPools.find(
          //   ({ id }) => id === pool.id
          // );
          // const totalSwapVolume24HoursAgo = oneDayAgoPool
          //   ? safeParseFixed(oneDayAgoPool?.totalSwapVolume, 18)
          //   : ZERO;
          const swapVolume24Hours = safeParseFixed(pool.totalSwapVolume, 18);
          // .sub(totalSwapVolume24HoursAgo); // TEMPORARILY REMOVE 24HR FIGURES

          return {
            ...pool,
            swapVolume24Hours,
            tokens: pool.tokens?.map((token) => {
              const price = newPrices[token.address];
              const value: BigNumber | undefined = price
                ? safeParseFixed(token.balance, 18).mul(price).div(ONE)
                : undefined;
              return {
                ...token,
                price,
                value,
              };
            }),
          };
        });

        const newPoolsDataWithPoolValue = newPoolsData.map((pool) => {
          const poolValue = pool?.tokens
            ?.map(({ value }) => value)
            .reduce((acc, el) => {
              if (!acc || !el) return;
              return acc.add(el);
            }, ZERO);

          return {
            ...pool,
            poolValue,
          };
        });

        try {
          const multicallContract = new Contract(
            contracts["MULTICALL"].address[selectedNetworkConfig.chainId],
            contracts["MULTICALL"].abi,
            readOnlyProvider
          ) as Multicall;

          const pausedStateResults = await multicall(
            multicallContract,
            newPoolsDataWithPoolValue.map(({ address, poolType }) => ({
              address,
              abi: ABI_MAP[poolType as GyroPoolTypes],
            })),
            new Array(newPoolsDataWithPoolValue.length).fill("getPausedState")
          );

          const newPoolsDataWithPausedData = newPoolsDataWithPoolValue.map(
            (pool, index) => ({
              ...pool,
              paused: Boolean(pausedStateResults[index]?.paused),
            })
          );

          setData(newPoolsDataWithPausedData);
        } catch (e: any) {
          console.error("Error fetching paused state: " + (e.message ?? e));
        }

        setLoading(false);
      }
    })();
  }, [queryData, readOnlyProvider]);
  // }, [queryData, blockNumber24HoursAgo]);

  // Align loading states
  useEffect(() => {
    if (queryLoading) setLoading(true);
  }, [queryLoading]);

  return (
    <Context.Provider
      value={{
        loading,
        data,
        prices,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
