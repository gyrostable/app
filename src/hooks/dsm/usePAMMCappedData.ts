import { useContext, useEffect, useState } from "react";
import { BigNumber, Contract } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { Web3Context } from "../../contexts/Web3";
import { contracts } from "../../constants/contracts";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { ONE, ZERO_ADDRESS } from "../../constants/misc";
import { formatFixed } from "@ethersproject/bignumber";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import multicall from "../../utils/multicall";
import { Web3FallbackContext } from "../../contexts/Web3Fallback";
import { Multicall } from "../../../types/typechain";
import useThrottle from "../useThrottle";

const usePAMMCappedData = (
  reserveState: DataTypes.ReserveStateStructOutput | null,
  gydTokenData: WalletTokenDataType | null
) => {
  const [totalPercCap, setTotalPercCap] = useState<number | null>(null);
  const [userPercCap, setUserPercCap] = useState<number | null>(null);
  const [userCap, setUserCap] = useState<BigNumber | null>(null);
  const [contractPayload, setContractPayload] = useState<{
    totalSupplyCap: BigNumber;
    perAuthenticatedUserCap: BigNumber;
    perUserCap: BigNumber;
    isUserAuthenticated: boolean;
  } | null>(null);

  const { account, selectedNetworkConfig, readOnlyProvider } =
    useContext(Web3Context);
  const { reportFailedRequest } = useContext(Web3FallbackContext);

  const { throttle } = useThrottle();

  useEffect(() => {
    (async () => {
      const pass = await throttle();
      if (!pass) return;

      let totalSupplyCap: BigNumber,
        perAuthenticatedUserCap: BigNumber,
        perUserCap: BigNumber,
        isUserAuthenticated: boolean;

      const gyroConfigInfo = {
        address:
          contracts["GYRO_CONFIG"].address[selectedNetworkConfig.chainId],
        abi: contracts["GYRO_CONFIG"].abi,
      };

      const capAuthenticationInfo = {
        address:
          contracts["CAP_AUTHENTICATION"].address[
            selectedNetworkConfig.chainId
          ],
        abi: contracts["CAP_AUTHENTICATION"].abi,
      };

      const contractInfo = [
        gyroConfigInfo,
        gyroConfigInfo,
        gyroConfigInfo,
        capAuthenticationInfo,
      ];

      const multicallContract = new Contract(
        contracts["MULTICALL"].address[selectedNetworkConfig.chainId],
        contracts["MULTICALL"].abi,
        readOnlyProvider
      ) as Multicall;

      try {
        [
          totalSupplyCap,
          perAuthenticatedUserCap,
          perUserCap,
          isUserAuthenticated,
        ] = await multicall(multicallContract, contractInfo, [
          ["getUint(bytes32)", formatBytes32String("GYD_GLOBAL_SUPPLY_CAP")],
          [
            "getUint(bytes32)",
            formatBytes32String("GYD_AUTHENTICATED_USER_CAP"),
          ],
          ["getUint(bytes32)", formatBytes32String("GYD_USER_CAP")],
          ["isAuthenticated", account ?? ZERO_ADDRESS],
        ]);

        setContractPayload({
          totalSupplyCap,
          perAuthenticatedUserCap,
          perUserCap,
          isUserAuthenticated,
        });
      } catch (e: any) {
        reportFailedRequest();
        console.error("Error fetching DSM Cap data: " + (e.message ?? e));
      }
    })();
  }, [account, readOnlyProvider, selectedNetworkConfig]);

  useEffect(() => {
    if (!reserveState || !contractPayload) return;
    const { totalSupplyCap } = contractPayload;

    const newTotalPercCap = reserveState.totalUSDValue
      .mul(ONE)
      .div(totalSupplyCap);
    setTotalPercCap(Math.floor(Number(formatFixed(newTotalPercCap, 16))));
  }, [selectedNetworkConfig, reserveState, contractPayload]);

  useEffect(() => {
    if (!gydTokenData || !account || !contractPayload) return;

    const { perAuthenticatedUserCap, perUserCap, isUserAuthenticated } =
      contractPayload;

    const newUserCap = isUserAuthenticated
      ? perAuthenticatedUserCap
      : perUserCap;

    setUserCap(newUserCap);

    const newUserPercCap = gydTokenData.balance.mul(ONE).div(newUserCap);
    setUserPercCap(Math.floor(Number(formatFixed(newUserPercCap, 16))));
  }, [selectedNetworkConfig, account, gydTokenData, contractPayload]);
  return {
    totalPercCap,
    userPercCap,
    userCap,
  };
};

export default usePAMMCappedData;
