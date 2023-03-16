import { Provider } from "@wagmi/core";
import { ethers } from "ethers";
import Rollbar from "rollbar";
import { GyroPoolTypes } from "../../../types/pool";
import { ABI_MAP } from "../../abis";

const fetchPausedData = async (
  poolAddress: string,
  poolType: GyroPoolTypes,
  provider: Provider | ethers.providers.JsonRpcProvider,
  rollbar: Rollbar
) => {
  if (!provider) return null;
  const abi = ABI_MAP[poolType];
  const pool = new ethers.Contract(poolAddress, abi, provider);
  try {
    const data = await pool.getPausedState();
    return {
      paused: data.paused,
      pauseWindowEndTime: data.pauseWindowEndTime,
    };
  } catch (e: any) {
    const errorMessage = "Error in isPoolPaused: " + (e.message ?? e);
    console.error(errorMessage);
    rollbar.warning(errorMessage);
    return null;
  }
};

export default fetchPausedData;
