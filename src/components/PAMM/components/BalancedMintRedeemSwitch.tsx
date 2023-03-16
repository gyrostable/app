import { useContext } from "react";
import styled from "styled-components";
import { PAMMContext } from "../../../contexts/PAMM";
import capitalise from "../../../utils/capitalise";

const BalancedMintRedeemSwitch = () => {
  const {
    isBalancedMint,
    toggleMintBalanced,
    mintOrRedeem,
    isBalancedRedemption,
    toggleRedeemBalanced,
  } = useContext(PAMMContext);

  const isActive =
    mintOrRedeem === "mint" ? isBalancedMint : isBalancedRedemption;

  const onClick =
    mintOrRedeem === "mint" ? toggleMintBalanced : toggleRedeemBalanced;

  return (
    <Container mintOrRedeem={mintOrRedeem}>
      <p>Balanced {capitalise(mintOrRedeem)}</p>
      <SwitchContainer
        active={isActive}
        onClick={onClick}
        id="balanced-mint-redeem-switch"
      >
        <Switch active={isActive} />
      </SwitchContainer>
    </Container>
  );
};

export default BalancedMintRedeemSwitch;

const Container = styled.div<{ mintOrRedeem: "mint" | "redeem" }>`
  align-items: center;
  display: flex;
  gap: 12px;
  height: 20px;
  position: absolute;
  right: ${({ mintOrRedeem }) => (mintOrRedeem === "mint" ? "58px" : "25px")};
  top: 93px;
  p {
    font-size: 12px;
    margin: 0;
  }
`;

const SwitchContainer = styled.div<{ active: boolean }>`
  background: ${({ theme, active }) =>
    active
      ? `linear-gradient(
    90deg,
    #f3ffa7 0%,
    #f2e3c4 35.94%,
    #edbbfa 63.54%,
    #aaf1f4 100%
  )`
      : theme.colors.highlightLight};
  border-radius: 87px;
  cursor: pointer;
  height: 20px;
  position: relative;
  width: 36px;
`;

const Switch = styled.div<{ active: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.25),
    -2px -2px 3px 0 rgba(255, 255, 255, 0.3);
  height: 16px;
  left: ${({ active }) => (active ? "18px" : "2px")};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;
  width: 16px;
`;
