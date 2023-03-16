import { BigNumber } from "ethers";

export type SystemParamsType = [BigNumber, BigNumber, BigNumber, BigNumber] & {
  alphaBar: BigNumber;
  xuBar: BigNumber;
  thetaBar: BigNumber;
  outflowMemory: BigNumber;
};
