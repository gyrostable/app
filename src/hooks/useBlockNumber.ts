import { useEffect, useState, useContext } from "react";
import { Web3Context } from "../contexts/Web3";
import useThrottle from "./useThrottle";

const useBlockNumber = () => {
  const [blockNumber24HoursAgo, setBlockNumber24HoursAgo] = useState(0);
  const { selectedNetworkConfig, readOnlyProvider } = useContext(Web3Context);
  const { throttle } = useThrottle();

  useEffect(() => {
    (async () => {
      const pass = await throttle();
      if (!pass) return;

      const currentBlockNumber = await readOnlyProvider.getBlockNumber();
      const blocksPerDay = Math.floor(
        86400 / selectedNetworkConfig.averageSecondsPerBlock
      );

      return setBlockNumber24HoursAgo(currentBlockNumber - blocksPerDay);
    })();
  }, [selectedNetworkConfig, readOnlyProvider]);

  return { blockNumber24HoursAgo };
};

export default useBlockNumber;
