import { useContext } from "react";
import styled from "styled-components";
import { PAMMContext } from "../../../contexts/PAMM";

const MintRedeemSwitch = () => {
  const { mintOrRedeem, setMintOrRedeem } = useContext(PAMMContext);
  return (
    <Container>
      <Button
        active={mintOrRedeem === "mint"}
        onClick={() => {
          if (mintOrRedeem === "redeem") {
            setMintOrRedeem("mint");
          }
        }}
      >
        Mint
      </Button>
      <Button
        id="mint-redeem-switch-redeem-button"
        active={mintOrRedeem === "redeem"}
        onClick={() => {
          if (mintOrRedeem === "mint") {
            setMintOrRedeem("redeem");
          }
        }}
      >
        Redeem
      </Button>
    </Container>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  border: 0.5px solid ${({ theme }) => theme.colors.highlightLight};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  height: 50px;
  margin: 0 auto;
  padding: 4px;
  width: 246px;
`;

const Button = styled.button<{ active?: boolean }>`
  background: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.highlight};
  border: none;
  border-radius: 4px;
  color: ${({ active, theme }) =>
    active ? theme.colors.dark : theme.colors.white};
  cursor: pointer;
  font-weight: 700;
  height: 40px;
  outline: none;
  transition: all 0.2s ease-in-out;
  width: 119px;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.white : theme.colors.highlightLight};
  }
`;

export default MintRedeemSwitch;
