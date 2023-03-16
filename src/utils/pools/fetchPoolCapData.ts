import { Provider } from "@wagmi/core";
import { BigNumber, ethers } from "ethers";
import Rollbar from "rollbar";
import { GyroPoolTypes } from "../../../types/pool";
import { ABI_MAP } from "../../abis";

export const POOL_CAP_NULL_VALUE = {
  capEnabled: false,
  perAddressCap: null,
  globalCap: null,
};

export type PoolCapDataType = {
  capEnabled: boolean;
  perAddressCap: BigNumber | null;
  globalCap: BigNumber | null;
};

const fetchPoolCapData = async (
  poolAddress: string,
  poolType: GyroPoolTypes,
  provider: Provider | ethers.providers.JsonRpcProvider,
  rollbar: Rollbar
): Promise<PoolCapDataType> => {
  if (!provider) return POOL_CAP_NULL_VALUE;
  const abi = ABI_MAP[poolType];
  const pool = new ethers.Contract(poolAddress, abi, provider);
  try {
    const data = await pool.capParams();

    return {
      capEnabled: data.capEnabled ?? false,
      perAddressCap: data.perAddressCap ?? null,
      globalCap: data.globalCap ?? null,
    };
  } catch (e: any) {
    const errorMessage =
      "Error in retrieving pool cap data: " + (e.message ?? e);
    console.error(errorMessage);
    rollbar.warning(errorMessage);
    return POOL_CAP_NULL_VALUE;
  }
};

export default fetchPoolCapData;
