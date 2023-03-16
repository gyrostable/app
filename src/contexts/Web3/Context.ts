import { Provider } from "@wagmi/core";
import { providers, Signer, getDefaultProvider } from "ethers";
import { createContext, Dispatch, SetStateAction } from "react";
import { ChainConfig, Chains, chainsConfig } from "../../constants/chains";

interface Web3Props {
  provider: Provider;
  account?: `0x${string}`;
  ensName?: string | null;
  loadWeb3Modal: () => void;
  logoutOfWeb3Modal: () => void;
  chainId?: number;
  selectedNetworkConfig: ChainConfig;
  setSelectedNetworkConfig: Dispatch<SetStateAction<ChainConfig>>;
  checkInvalidAccount: () => Promise<boolean>;
  isNetworkMismatch: boolean;
  readOnlyProvider: Provider | providers.JsonRpcProvider;
  isConnected: boolean;
  signer?: Signer | null;
}

const Context = createContext<Web3Props>({
  provider: getDefaultProvider(),
  loadWeb3Modal: () => {},
  logoutOfWeb3Modal: () => {},
  selectedNetworkConfig: chainsConfig[Chains["mainnet"]],
  setSelectedNetworkConfig: () => {},
  checkInvalidAccount: async () => false,
  isNetworkMismatch: false,
  readOnlyProvider: new providers.JsonRpcProvider(
    chainsConfig[Chains["polygon"]].rpcUrl
  ),
  isConnected: false,
});

export default Context;
