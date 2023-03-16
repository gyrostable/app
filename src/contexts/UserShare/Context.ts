import { createContext } from "react";
import { BigNumber } from "ethers";
import { ZERO } from "../../constants/misc";

export type TokensShareData = {
  name: string;
  symbol: string;
  balance: BigNumber;
  address: string;
  value?: BigNumber;
  price?: BigNumber;
  allowed: boolean;
};

interface UserShareProps {
  loading: boolean;
  data: TokensShareData[];
  totalValue?: BigNumber;
  userShareBalance: BigNumber;
  subgraphOutOfSync: boolean;
}

const Context = createContext<UserShareProps>({
  loading: true,
  data: [],
  userShareBalance: ZERO,
  subgraphOutOfSync: false,
});

export default Context;
