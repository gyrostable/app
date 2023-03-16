import { createContext } from "react";
import { BigNumber } from "ethers";

export type WalletTokenDataType = {
  name: string;
  address: string;
  symbol: string;
  balance: BigNumber;
  decimals: number;
  price?: BigNumber;
  value?: BigNumber;
  allowed: boolean;
  tokens?: {
    symbol: string;
  }[];
  limitedAllowance: BigNumber | null;
  totalSupply?: BigNumber;
};

interface WalletProps {
  loading: boolean;
  data: WalletTokenDataType[];
  totalValue?: BigNumber;
  updateWallet: () => Promise<void>;
}

const Context = createContext<WalletProps>({
  loading: true,
  data: [],
  updateWallet: async () => {},
});

export default Context;
