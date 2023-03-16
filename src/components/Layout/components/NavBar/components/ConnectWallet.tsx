import { useContext } from "react";
import { useAccount } from "wagmi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import styled from "styled-components";
import { Web3Context } from "../../../../../contexts/Web3";
import formatWalletAddress from "../../../../../utils/formatWalletAddress";

const ConnectWallet = () => {
  const {
    isConnected,
    provider,
    account,
    ensName,
    loadWeb3Modal,
    logoutOfWeb3Modal,
  } = useContext(Web3Context);

  return (
    <Button onClick={isConnected ? logoutOfWeb3Modal : loadWeb3Modal}>
      <MdOutlineAccountBalanceWallet
        size={"21px"}
        style={{ marginRight: "7px" }}
      />
      {provider && account
        ? ensName
          ? ensName
          : formatWalletAddress(account)
        : "Connect Wallet"}
    </Button>
  );
};

export default ConnectWallet;

const Button = styled.div`
  align-items: center;
  background: linear-gradient(
    90deg,
    rgba(243, 255, 167) 0%,
    rgba(242, 227, 196) 35.94%,
    rgba(237, 187, 250) 63.54%,
    rgba(170, 241, 244) 100%
  );
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.dark};
  cursor: pointer;
  height: 44px;
  display: flex;
  font-weight: 500;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease-in-out;
  padding: 0 12px;
  width: 160px;
  z-index: 2;
`;
