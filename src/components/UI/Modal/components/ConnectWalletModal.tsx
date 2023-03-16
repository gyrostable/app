import styled from "styled-components";
import { useConnect } from "wagmi";
import Image from "../../Image";
import metamask from "../../../../../public/icons/metamask.png";
import walletconnect from "../../../../../public/icons/walletconnect.png";

const ConnectWalletModal = ({ visible }: { visible: boolean }) => {
  const { connect, connectors } = useConnect();

  const imgMap = {
    MetaMask: metamask,
    WalletConnect: walletconnect,
  };

  return (
    <Container visible={visible} id="modal-container">
      {connectors.map((connector, index) => (
        <ConnectorOption key={index} onClick={() => connect({ connector })}>
          <ImageContainer>
            <Image
              src={imgMap[connector.name as "MetaMask" | "WalletConnect"]}
              alt="Metamask Logo"
            />
          </ImageContainer>
          <h3>{connector.name}</h3>
          <p> Connect to your {connector.name} wallet</p>
        </ConnectorOption>
      ))}
    </Container>
  );
};

export default ConnectWalletModal;

const Container = styled.div<{ visible: boolean }>`
  background: ${({ theme }) => theme.colors.highlightDark};
  box-shadow: 0px 4px 80px rgba(0, 0, 0, 0.24);
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.highlightDark};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  padding: 10px;
  transition: all 0.2s ease-in-out;
`;

const ConnectorOption = styled.button`
  align-items: center;
  border-style: none;
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 200px;
  justify-content: center;
  outline: none;
  transition: all 0.2s ease-out;
  width: 500px;

  h3,
  p {
    margin: 0;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
  }
`;

const ImageContainer = styled.div`
  height: 70px;
  width: 70px;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;
