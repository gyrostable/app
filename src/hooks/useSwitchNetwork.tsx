import { useContext, useEffect, useState } from "react";
import { useSwitchNetwork as useSwitchNetworkWagmi } from "wagmi";
import { ChainConfig, Chains, chainsConfig } from "../constants/chains";
import { Web3Context } from "../contexts/Web3";
import { ModalContext } from "../contexts/Modal";
import WarningModal from "../components/UI/Modal/components/WarningModal";

const useSwitchNetwork = () => {
  const { isConnected, setSelectedNetworkConfig, chainId } =
    useContext(Web3Context);
  const { setModalOpen, setModalPayload } = useContext(ModalContext);
  const [switchingTo, setSwitchingTo] = useState<ChainConfig>(
    chainsConfig[Chains["polygon"]]
  );

  const { switchNetworkAsync, error, isLoading } = useSwitchNetworkWagmi();

  // Render warning modal on switch network error
  useEffect(() => {
    if (error) {
      setModalPayload({
        warningMessage: error.message,
        warning: `Failed to switch to ${switchingTo.chainName} network`,
        body: <WarningModal />,
        header: "Warning",
      });
      setModalOpen("warning");
    }
  }, [error]);

  async function switchNetwork(config: ChainConfig) {
    setSwitchingTo(config);

    if (!isConnected || (chainId && config.chainId === chainId)) {
      setSelectedNetworkConfig(config);
    } else {
      try {
        if (switchNetworkAsync) {
          await switchNetworkAsync(config.chainId);
          setSelectedNetworkConfig(config);
        }
      } catch (e) {}
    }
  }

  return { switchNetwork, isLoading, switchingTo };
};

export default useSwitchNetwork;
