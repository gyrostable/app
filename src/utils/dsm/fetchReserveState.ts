import { Contract, providers } from "ethers";
import { Provider } from "@wagmi/core";
import { contracts } from "../../constants/contracts";
import { ChainConfig } from "../../constants/chains";
import { ReserveSystemRead } from "../../../types/typechain";

async function fetchReserveState(
  selectedNetworkConfig: ChainConfig,
  readOnlyProvider: Provider | providers.JsonRpcProvider
) {
  const reserveSystemReadContract = new Contract(
    contracts["RESERVE_SYSTEM_READ"].address[selectedNetworkConfig.chainId],
    contracts["RESERVE_SYSTEM_READ"].abi,
    readOnlyProvider
  ) as ReserveSystemRead;

  const { reserveState, systemParams, redemptionLevel, redemptionPrice } =
    await reserveSystemReadContract.read();

  return { reserveState, systemParams, redemptionLevel, redemptionPrice };
}

export default fetchReserveState;
