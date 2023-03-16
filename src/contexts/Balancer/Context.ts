import { createContext } from "react";
import { BigNumber } from "ethers";

interface BalancerProps {
  joinPool: (
    poolId: string,
    assets: string[],
    desiredBptOut: BigNumber
  ) => Promise<void>;
  exitPool: (
    poolId: string,
    assets: string[],
    desiredBptIn: BigNumber
  ) => Promise<void>;
  approveToken: (tokenAddress: string) => Promise<void>;
}

const Context = createContext<BalancerProps>({
  joinPool: async () => {},
  exitPool: async () => {},
  approveToken: async () => {},
});

export default Context;
