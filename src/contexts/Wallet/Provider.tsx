import { Contract } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { useRollbar } from "@rollbar/react";
import { ReactNode, useContext, useEffect, useState } from "react";
import Context, { WalletTokenDataType } from "./Context";
import { Web3Context } from "../Web3";
import { PoolDataContext } from "../PoolData";
import { erc20 as erc20ABI } from "../../abis";
import { ZERO, ONE } from "../../constants/misc";
import { contracts } from "../../constants/contracts";
import safeParseFixed from "../../utils/safeParseFixed";
import multicall from "../../utils/multicall";
import { Web3FallbackContext } from "../Web3Fallback";
import { Multicall } from "../../../types/typechain";
import { ChainsValue } from "../../constants/chains";
import useThrottle from "../../hooks/useThrottle";

const Provider = ({ children }: { children: ReactNode }) => {
  const [walletTokenData, setWalletTokenData] = useState<WalletTokenDataType[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState<BigNumber>();

  const { account, chainId, selectedNetworkConfig, readOnlyProvider } =
    useContext(Web3Context);
  const { reportFailedRequest } = useContext(Web3FallbackContext);
  const {
    loading: poolDataLoading,
    data: poolData,
    prices,
  } = useContext(PoolDataContext);

  const rollbar = useRollbar();

  const { throttle } = useThrottle();

  useEffect(() => {
    updateWallet();
  }, [poolData, account, prices, readOnlyProvider]);

  // Align loading states
  useEffect(() => {
    if (poolDataLoading && account) setLoading(true);
  }, [poolDataLoading, account]);

  async function updateWallet() {
    if (account && poolData?.pool?.tokens && prices) {
      setLoading(true);

      const pass = await throttle(1000);
      if (!pass) return;

      const newWalletTokenData: WalletTokenDataType[] = await Promise.all(
        poolData.pool.tokens.map(
          async ({ name, symbol, address, decimals }) => {
            let balance = ZERO,
              allowed = false,
              limitedAllowance: BigNumber | null = null;
            try {
              let allowance = ZERO;

              const multicallContract = new Contract(
                contracts["MULTICALL"].address[selectedNetworkConfig.chainId],
                contracts["MULTICALL"].abi,
                readOnlyProvider
              ) as Multicall;

              [balance, allowance] = await multicall(
                multicallContract,
                {
                  abi: erc20ABI,
                  address,
                },
                [
                  ["balanceOf", account],
                  [
                    "allowance",
                    account,
                    contracts.VAULT.address[(chainId as ChainsValue) || 1],
                  ],
                ]
              );

              allowed = allowance.gt(0);

              limitedAllowance =
                !allowance.isZero() &&
                allowance.lte(
                  safeParseFixed("1", decimals).mul(safeParseFixed("1", 9)) // 1e9 tokens
                )
                  ? allowance.mul(ONE).div(safeParseFixed("1", decimals)) // normalize to decimal = 18
                  : null;
            } catch (e: any) {
              balance = ZERO;
              allowed = false;
              limitedAllowance = null;
              if (await reportFailedRequest(readOnlyProvider)) {
                rollbar.critical(
                  `Failed to fetch ERC20 data for token address ${address}: ` +
                    (e.message ?? e)
                );
              }
            }
            const normalizedBalance = balance
              .mul(ONE)
              .div(safeParseFixed("1", decimals));
            const price = prices[address];
            const value = price
              ? normalizedBalance.mul(price).div(ONE)
              : undefined;

            return {
              name,
              symbol,
              balance: normalizedBalance,
              price,
              value,
              decimals,
              allowed,
              address,
              limitedAllowance,
            };
          }
        )
      );

      setWalletTokenData(newWalletTokenData);

      const newTotalValue = newWalletTokenData
        .map(({ value }) => value)
        .reduce((acc, el) => {
          if (!acc || !el) return;
          return el.add(acc);
        }, ZERO);
      setTotalValue(newTotalValue);

      setLoading(false);
    } else {
      setWalletTokenData([]);
    }
  }

  return (
    <Context.Provider
      value={{
        loading,
        data: walletTokenData,
        totalValue,
        updateWallet,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
