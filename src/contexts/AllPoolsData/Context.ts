import { BigNumber } from "ethers";
import { createContext } from "react";

interface PoolDataProps {
  loading: boolean;
  data?: any[];
  prices: { [key: string]: BigNumber } | null;
}

const Context = createContext<PoolDataProps>({
  loading: true,
  prices: null,
});

export default Context;
