import styled from "styled-components";
import { useContext } from "react";
import { Web3Context } from "../../../contexts/Web3";
import { PAMMContext } from "../../../contexts/PAMM";
import { ZERO } from "../../../constants/misc";
import { formatFixed } from "@ethersproject/bignumber";
import formatBigNumberString from "../../../utils/formatBigNumberString";

const GYDBalance = () => {
  const { stablecoinSymbol, gydTokenData } = useContext(PAMMContext);
  const { account } = useContext(Web3Context);

  return (
    <Container>
      Your {stablecoinSymbol} balance:
      <h3>
        {account
          ? formatBigNumberString(
              formatFixed(gydTokenData?.balance ?? ZERO, 18),
              2,
              2
            )
          : "-"}
      </h3>
    </Container>
  );
};

export default GYDBalance;

const Container = styled.div`
  align-items: left;
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 8px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors[4]};
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  margin-top: 22px;
  padding: 20px;
  position: relative;
  width: 340px;

  h3 {
    margin: 0;
  }
`;
