import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { BigNumber } from "ethers";
import { useRollbar } from "@rollbar/react";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { Web3Context } from "../../contexts/Web3";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { SystemParamsType } from "../../../types/dsm";
import { Web3FallbackContext } from "../../contexts/Web3Fallback";
import fetchReserveState from "../../utils/dsm/fetchReserveState";
import updateUnderlierTokens from "../../utils/dsm/updateUnderlierTokens";
import useThrottle from "../useThrottle";
import DSM_ERRORS from "../../constants/dsm/errors";
import fetchBackupData, {
  VaultWithValue,
} from "../../utils/dsm/fetchBackupData";

export type BackupDataType = {
  vaultsWithValues: VaultWithValue[];
  gydTotalSupply: BigNumber;
  systemParams: SystemParamsType;
  redemptionLevel: BigNumber;
  redemptionPrice: BigNumber;
  totalUSDValue: BigNumber;
};

const useReserveState = (setError: Dispatch<SetStateAction<string>>) => {
  const [underlierTokens, setUnderlierTokens] = useState<WalletTokenDataType[]>(
    []
  );
  const [reserveState, setReserveState] =
    useState<DataTypes.ReserveStateStructOutput | null>(null);
  const [gydPrice, setGYDPrice] = useState<BigNumber | null>(null);
  const [fetchReserveStateStatus, setFetchReserveStateStatus] =
    useState<FetchType>("success");
  const [systemParams, setSystemParams] = useState<SystemParamsType | null>(
    null
  );
  const [redemptionLevel, setRedemptionLevel] = useState<BigNumber | null>(
    null
  );
  const [updateReserveTrigger, setUpdateReserveTrigger] = useState(0);

  const [backupData, setBackupData] = useState<BackupDataType | null>(null);

  const { selectedNetworkConfig, account, readOnlyProvider } =
    useContext(Web3Context);
  const { reportFailedRequest } = useContext(Web3FallbackContext);

  const rollbar = useRollbar();

  const { throttle } = useThrottle();

  useEffect(() => {
    (async function fetchReserveData() {
      try {
        setReserveState(null);
        setFetchReserveStateStatus("fetching");
        const pass = await throttle();
        if (!pass) return;

        const {
          reserveState,
          redemptionLevel,
          systemParams,
          redemptionPrice: gydPrice,
        } = await fetchReserveState(selectedNetworkConfig, readOnlyProvider);

        const underlierData = await updateUnderlierTokens(
          selectedNetworkConfig,
          readOnlyProvider,
          account,
          reserveState
        );

        setError("");
        setReserveState(reserveState);
        setSystemParams(systemParams);
        setRedemptionLevel(redemptionLevel);
        setGYDPrice(gydPrice);
        setUnderlierTokens(
          underlierData.filter((el) => el).length === underlierData.length
            ? underlierData
            : []
        );
        setBackupData(null);
        setFetchReserveStateStatus("success");
      } catch (e: any) {
        let errorMessage;
        if (e?.errorArgs?.length) {
          errorMessage =
            "RESERVE INFO: " +
            `${DSM_ERRORS[Number(e.errorArgs[0])]} (${Number(e.errorArgs[0])})`;
          setError(errorMessage);
        } else {
          errorMessage =
            "Failed to fetch Gyro Reserve State: " + (e.message ?? e);
          setError(
            "Failed to fetch Gyro Reserve State. Check out the console for more details."
          );
        }
        console.error(errorMessage);
        fetchBackupData(
          selectedNetworkConfig,
          readOnlyProvider,
          setBackupData,
          setFetchReserveStateStatus
        );

        if (await reportFailedRequest(readOnlyProvider)) {
          rollbar.critical(errorMessage);
        }
      }
    })();
  }, [updateReserveTrigger, selectedNetworkConfig, readOnlyProvider, account]);

  return {
    underlierTokens,
    reserveState,
    gydPrice,
    fetchReserveStateStatus,
    setUpdateReserveTrigger,
    systemParams,
    redemptionLevel,
    backupData,
  };
};

export default useReserveState;
