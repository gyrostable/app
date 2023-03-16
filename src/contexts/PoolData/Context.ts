import { BigNumber } from "ethers";
import { createContext } from "react";
import { PoolQuery } from "../../../types/subgraph/__generated__/types";
import { ZERO } from "../../constants/misc";
import {
  PoolCapDataType,
  POOL_CAP_NULL_VALUE,
} from "../../utils/pools/fetchPoolCapData";

export type PauseDataType = {
  paused: boolean;
  pauseWindowEndTime: BigNumber;
} | null;

interface PoolDataProps {
  loading: boolean;
  data?: PoolQuery;
  prices: { [key: string]: BigNumber | undefined } | null;
  totalValue?: BigNumber;
  pauseData: PauseDataType;
  poolCapData: PoolCapDataType;
  totalShares: BigNumber;
  valuePerShare: BigNumber;
  globalCapValueExceeded: boolean;
}

const Context = createContext<PoolDataProps>({
  loading: true,
  prices: null,
  pauseData: null,
  poolCapData: POOL_CAP_NULL_VALUE,
  totalShares: ZERO,
  valuePerShare: ZERO,
  globalCapValueExceeded: false,
});

export default Context;
