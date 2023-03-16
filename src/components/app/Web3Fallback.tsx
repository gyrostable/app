import styled from "styled-components";
import { useContext, ReactNode } from "react";
import { CONNECT_WALLET_MESSAGE } from "../../constants/misc";
import { Web3Context } from "../../contexts/Web3";
import ConnectWallet from "../pool/Balance/components/ConnectWallet";
import Button from "../UI/Button";
import { chainsConfig } from "../../constants/chains";
import { Web3FallbackContext } from "../../contexts/Web3Fallback";
import useSwitchNetwork from "../../hooks/useSwitchNetwork";

const Web3Fallback = ({ children }: { children: ReactNode }) => {
  const { isConnected, chainId, selectedNetworkConfig } =
    useContext(Web3Context);

  const { switchNetwork } = useSwitchNetwork();

  const { renderFallbackUI } = useContext(Web3FallbackContext);

  if (renderFallbackUI && !isConnected)
    return (
      <Container>
        <p>{CONNECT_WALLET_MESSAGE}</p>
        <ConnectWallet />
      </Container>
    );

  if (isConnected && !(chainId === selectedNetworkConfig.chainId))
    return (
      <Container>
        <p>{`To continue using the Gyroscope User Interface, please connect to the ${selectedNetworkConfig.chainName} network`}</p>
        <Button
          width="300px"
          onClick={() => {
            switchNetwork(chainsConfig[selectedNetworkConfig.chainId]);
          }}
        >
          {`Switch to ${selectedNetworkConfig.chainName}`}
        </Button>
      </Container>
    );

  return <>{children}</>;
};

export default Web3Fallback;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  margin: auto;
  height: calc(max(100vh - 430px, 300px));
  max-width: 800px;
  text-align: center;
`;
