import { useState, useEffect, useContext, useRef } from "react";
import { BigNumber, Contract } from "ethers";
import { useRollbar } from "@rollbar/react";
import { Web3Context } from "../../contexts/Web3";
import { contracts } from "../../constants/contracts";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { ZERO, ONE } from "../../constants/misc";
import safeParseFixed from "../../utils/safeParseFixed";
import multicall from "../../utils/multicall";
import { Web3FallbackContext } from "../../contexts/Web3Fallback";
import { Multicall } from "../../../types/typechain";
import useThrottle from "../useThrottle";

const useGydToken = (gydPrice: BigNumber | null) => {
  const { selectedNetworkConfig, account, readOnlyProvider } =
    useContext(Web3Context);
  const { reportFailedRequest } = useContext(Web3FallbackContext);

  const rollbar = useRollbar();

  const [gydTokenData, setGydTokenData] = useState<WalletTokenDataType | null>(
    null
  );

  const [updateGydTokenDataTrigger, setUpdateGYDTokenTrigger] = useState(0);

  const [fetchGYDDataStatus, setFetchGYDDataStatus] =
    useState<FetchType>("success");

  const { throttle } = useThrottle();

  useEffect(() => {
    (async () => {
      setGydTokenData(null);
      setFetchGYDDataStatus("fetching");
      const pass = await throttle();
      if (!pass) return;

      const multicallContract = new Contract(
        contracts["MULTICALL"].address[selectedNetworkConfig.chainId],
        contracts["MULTICALL"].abi,
        readOnlyProvider
      ) as Multicall;

      try {
        let name: string,
          symbol: string,
          decimals: number,
          totalSupply: BigNumber,
          balance = ZERO,
          allowance = ZERO;

        if (account) {
          [name, symbol, decimals, totalSupply, balance, allowance] =
            await multicall(
              multicallContract,
              {
                abi: contracts["GYD_TOKEN"].abi,
                address:
                  contracts["GYD_TOKEN"].address[selectedNetworkConfig.chainId],
              },
              [
                "name",
                "symbol",
                "decimals",
                "totalSupply",
                ["balanceOf", account],
                [
                  "allowance",
                  account,
                  contracts["MOTHERBOARD"].address[
                    selectedNetworkConfig.chainId
                  ],
                ],
              ]
            );
        } else {
          [name, symbol, decimals, totalSupply] = await multicall(
            multicallContract,
            {
              abi: contracts["GYD_TOKEN"].abi,
              address:
                contracts["GYD_TOKEN"].address[selectedNetworkConfig.chainId],
            },
            ["name", "symbol", "decimals", "totalSupply"]
          );
        }

        const allowed = allowance.gt(1000000000);
        const normalizedBalance = balance
          .mul(ONE)
          .div(safeParseFixed("1", decimals || 18));
        const value = gydPrice
          ? normalizedBalance.mul(gydPrice).div(ONE)
          : normalizedBalance;

        const newGydTokenData = {
          name,
          address:
            contracts["GYD_TOKEN"].address[selectedNetworkConfig.chainId],
          symbol,
          balance,
          decimals,
          price: gydPrice ?? ONE,
          value,
          allowed,
          limitedAllowance: null,
          totalSupply,
        };

        setGydTokenData(newGydTokenData);
        setFetchGYDDataStatus("success");
      } catch (e: any) {
        setFetchGYDDataStatus("failed");
        const errorMessage =
          "Failed to fetch GYD Token Data: " + (e.message ?? e);
        console.error(errorMessage);
        if (await reportFailedRequest(readOnlyProvider)) {
          rollbar.critical(errorMessage);
        }
      }
    })();
  }, [account, updateGydTokenDataTrigger, readOnlyProvider]);

  return {
    gydTokenData,
    setUpdateGYDTokenTrigger,
    fetchGYDDataStatus,
  };
};

export default useGydToken;
