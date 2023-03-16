import Router from "next/router";
import { useQuery } from "@apollo/client";
import { formatFixed } from "@ethersproject/bignumber";
import { BigNumber } from "@ethersproject/bignumber";
import { useRollbar } from "@rollbar/react";
import { ReactNode, useContext, useEffect, useState } from "react";
import useQueryParam from "../../hooks/useQueryParam";
import Context from "./Context";
import {
  PoolQuery,
  PoolQueryVariables,
} from "../../../types/subgraph/__generated__/types";
import { POOL } from "../../queries/pool";
import fetchPrice from "../../utils/api/fetchPrice";
import { Web3Context } from "../Web3";
import { ZERO, ONE } from "../../constants/misc";
import fetchPausedData from "../../utils/pools/fetchPausedData";
import fetchPoolCapData, {
  PoolCapDataType,
  POOL_CAP_NULL_VALUE,
} from "../../utils/pools/fetchPoolCapData";
import { PauseDataType } from "./Context";
import safeParseFixed from "../../utils/safeParseFixed";
import { GyroPoolTypes } from "../../../types/pool";
import { matchAddressToId } from "../../constants/whitelist";
import convertPoolType, {
  SubgraphPoolTypeType,
} from "../../utils/pools/convertPoolType";
import { chainsConfig } from "../../constants/chains";
import useThrottle from "../../hooks/useThrottle";

const Provider = ({ children }: { children: ReactNode }) => {
  const poolAddressUrl = useQueryParam("poolAddress");
  const id = matchAddressToId(poolAddressUrl);
  const poolTypeUrl = useQueryParam("poolType");
  const { selectedNetworkConfig, setSelectedNetworkConfig } =
    useContext(Web3Context);
  const [poolLoading, setPoolLoading] = useState(true);
  const [prices, setPrices] = useState<{
    [key: string]: BigNumber | undefined;
  } | null>(null);
  const [totalValue, setTotalValue] = useState<BigNumber>();
  const [pauseData, setPauseData] = useState<PauseDataType>(null);
  const [poolCapData, setPoolCapData] =
    useState<PoolCapDataType>(POOL_CAP_NULL_VALUE);
  const [totalShares, setTotalShares] = useState<BigNumber>(ZERO);
  const [globalCapValueExceeded, setGlobalCapValueExceeded] = useState(false);
  const [valuePerShare, setValuePerShare] = useState(ZERO);

  const rollbar = useRollbar();

  // Query
  const { loading, data } = useQuery<PoolQuery, PoolQueryVariables>(POOL, {
    variables: { id },
    pollInterval: 60000,
  });

  const { readOnlyProvider } = useContext(Web3Context);

  const { throttle } = useThrottle();

  // Query for prices
  useEffect(() => {
    (async () => {
      if (data?.pool?.tokens) {
        const newPrices: { [key: string]: BigNumber | undefined } = {};
        if (!prices) setPoolLoading(true);

        const pass = await throttle();
        if (!pass) return;

        setTotalValue(undefined);

        await Promise.all(
          data.pool.tokens.map(async (token) => {
            try {
              const newPrice = await fetchPrice(
                selectedNetworkConfig.coingeckoId,
                token.address
              );
              newPrices[token.address] = newPrice;
            } catch (e: any) {
              console.error(e);
              rollbar.warning(
                "Error fetching price for token address: " + token.address
              );
            }
          })
        );

        // Calculate pool value
        const poolTokenValues = data.pool.tokens.map(({ address, balance }) => {
          const price = newPrices[address];
          return price
            ? price.mul(safeParseFixed(balance, 18)).div(ONE)
            : undefined;
        });

        const newTotalValue = poolTokenValues.reduce((acc, el) => {
          if (!acc || !el) return;
          return acc.add(el);
        }, ZERO);

        setTotalValue(newTotalValue);

        // Find out if pool is paused or not
        const newPauseData = await fetchPausedData(
          data.pool.address,
          data.pool.poolType as GyroPoolTypes,
          readOnlyProvider,
          rollbar
        );

        setPauseData(newPauseData);

        // Find out pool cap data
        const newPoolCapData = await fetchPoolCapData(
          data.pool.address,
          data.pool.poolType as GyroPoolTypes,
          readOnlyProvider,
          rollbar
        );

        setPoolCapData(newPoolCapData);

        const newTotalShares = safeParseFixed(data.pool.totalShares, 18);

        setTotalShares(newTotalShares);

        const newValuePerShare =
          newTotalValue && !newTotalShares.isZero()
            ? newTotalValue.mul(ONE).div(newTotalShares)
            : ZERO;

        setValuePerShare(newValuePerShare);

        const globalCapValue =
          (poolCapData.capEnabled &&
            poolCapData.globalCap &&
            !newValuePerShare.isZero() &&
            poolCapData.globalCap.mul(newValuePerShare).div(ONE)) ||
          null;

        const globalCapValueRounded = globalCapValue
          ? Math.floor(Number(formatFixed(globalCapValue, 18)) / 50000) * 50000
          : null;

        const newGlobalCapValueExceeded = Boolean(
          newTotalValue &&
            globalCapValueRounded &&
            Number(formatFixed(newTotalValue, 18)) > globalCapValueRounded
        );

        setGlobalCapValueExceeded(newGlobalCapValueExceeded);
        setPoolLoading(false);
        setPrices(newPrices);
      }
    })();
  }, [data, readOnlyProvider]);

  // Redirect to pools page if there is no valid pool
  useEffect(() => {
    if (poolAddressUrl && !(loading || data?.pool)) {
      Router.push("/pools");
    }
  }, [loading, data, poolAddressUrl]);

  // Redirect to pools page if pool type does not match url
  useEffect(() => {
    if (
      data?.pool?.poolType &&
      poolTypeUrl &&
      convertPoolType(
        data.pool.poolType as SubgraphPoolTypeType
      ).toLowerCase() !== poolTypeUrl.toLowerCase()
    ) {
      Router.push("/pools");
    }
  }, [data, poolTypeUrl]);

  // Redirect to pools page if url chain name does not exist
  const chainName = useQueryParam("chainName");

  useEffect(() => {
    const urlSelectedChainConfig = Object.values(chainsConfig).find(
      ({ name }) => name.toLowerCase() === chainName?.toLowerCase()
    );

    if (urlSelectedChainConfig) {
      setSelectedNetworkConfig(urlSelectedChainConfig);
    } else if (chainName) {
      Router.push("/pools");
    }
  }, [chainName]);

  return (
    <Context.Provider
      value={{
        loading: loading || poolLoading,
        data,
        prices,
        totalValue,
        pauseData,
        poolCapData,
        totalShares,
        valuePerShare,
        globalCapValueExceeded,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
