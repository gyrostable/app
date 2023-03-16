import { ethers } from "ethers";
import { useState, ReactNode } from "react";
import Context from "./Context";
import { FAILED_WEB3_REQUEST_LIMIT, ZERO_ADDRESS } from "../../constants/misc";
import { contracts } from "../../constants/contracts";
import { Chains } from "../../constants/chains";
import { GydToken } from "../../../types/typechain";
import { Provider as WagmiProvider } from "@wagmi/core";

let numberOfFailedRequests = 0;

const Provider = ({ children }: { children: ReactNode }) => {
  const [renderFallbackUI, setRenderFallbackUI] = useState(false);

  async function reportFailedRequest(
    provider?: WagmiProvider | ethers.providers.JsonRpcProvider
  ) {
    numberOfFailedRequests++;
    console.error("Failed request: " + numberOfFailedRequests);

    if (numberOfFailedRequests > FAILED_WEB3_REQUEST_LIMIT) {
      console.error("Rendering Web3 Fallback UI");
      setRenderFallbackUI(true);
    }

    // Front-end sanity check
    if (provider) {
      try {
        const gydTokenContract = new ethers.Contract(
          contracts["GYD_TOKEN"].address[Chains["polygon"]],
          contracts["GYD_TOKEN"].abi,
          provider
        ) as GydToken;
        const zeroBalance = await gydTokenContract.balanceOf(ZERO_ADDRESS);
        return zeroBalance.isZero();
      } catch (e) {}
    }
    return false;
  }

  return (
    <Context.Provider
      value={{
        renderFallbackUI,
        reportFailedRequest,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
