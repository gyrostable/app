import { Provider } from "@wagmi/core";
import { ethers } from "ethers";
import { createContext } from "react";

interface Web3Props {
  renderFallbackUI: boolean;
  reportFailedRequest: (
    provider?: Provider | ethers.providers.JsonRpcProvider
  ) => Promise<boolean>;
}

const Context = createContext<Web3Props>({
  renderFallbackUI: false,
  reportFailedRequest: async () => false,
});

export default Context;
