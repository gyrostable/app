import { useContext } from "react";
import styled from "styled-components";
import { Web3Context } from "../../../../contexts/Web3";

const ConnectWallet = () => {
  const { loadWeb3Modal } = useContext(Web3Context);
  return (
    <ConnectWalletWrapper onClick={loadWeb3Modal}>
      <ConnectWalletBackground>
        <ConnectWalletText>CONNECT WALLET</ConnectWalletText>
      </ConnectWalletBackground>
      <ConnectWalletButton></ConnectWalletButton>
    </ConnectWalletWrapper>
  );
};

const ConnectWalletButton = styled.div`
  background: linear-gradient(
    90deg,
    rgba(243, 255, 167) 0%,
    rgba(242, 227, 196) 35.94%,
    rgba(237, 187, 250) 63.54%,
    rgba(170, 241, 244) 100%
  );
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  cursor: pointer;
  height: 59px;
  opacity: 0.2;
  position: absolute;
  transition: all 0.2s ease-in-out;
  top: 0;
  width: 100%;

  &:hover {
    opacity: 0.3;
  }
`;

const ConnectWalletWrapper = styled.div`
  background: linear-gradient(
    90deg,
    rgba(243, 255, 167) 0%,
    rgba(242, 227, 196) 35.94%,
    rgba(237, 187, 250) 63.54%,
    rgba(170, 241, 244) 100%
  );
  border-radius: 8px;
  padding: 1px;
  position: relative;
  min-width: 300px;
`;

const ConnectWalletBackground = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.dark};
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  padding: 20px 0;
`;

const ConnectWalletText = styled.p`
  background: linear-gradient(
    90deg,
    #f3ffa7 0%,
    #f2e3c4 35.94%,
    #edbbfa 63.54%,
    #aaf1f4 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin: 0;
`;

export default ConnectWallet;
