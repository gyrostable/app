import { useContext, useEffect, useRef, useState } from "react";
import Image from "../../../../UI/Image";
import { formatFixed } from "@ethersproject/bignumber";
import styled from "styled-components";
import { ZERO } from "../../../../../constants/misc";
import { PAMMContext } from "../../../../../contexts/PAMM";
import formatBigNumberString from "../../../../../utils/formatBigNumberString";
import { Web3Context } from "../../../../../contexts/Web3";
import gWhite from "../../../../../../public/logos/G-white.png";

const GYDBalance = () => {
  const [visible, setVisible] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);

  const visibleCounter = useRef(0);

  const { account } = useContext(Web3Context);
  const { gydTokenData } = useContext(PAMMContext);

  const balance = formatBigNumberString(
    formatFixed(gydTokenData?.balance ?? ZERO, 18),
    2,
    2
  );

  useEffect(() => {
    gydTokenData && account ? setVisible(true) : setVisible(false);
  }, [gydTokenData, account]);

  useEffect(() => {
    if (visible) {
      const currentVisibleCounter = visibleCounter.current;
      setTimeout(() => {
        if (currentVisibleCounter === visibleCounter.current) {
          setBalanceVisible(true);
        }
      }, 700);
    } else {
      setBalanceVisible(false);
    }
  }, [visible]);

  return (
    <Container visible={visible} charLength={balance.length}>
      {balanceVisible && (
        <Balance>
          <TokenImageContainer>
            <Image src={gWhite} alt="GYD token" />
          </TokenImageContainer>
          {balance}
        </Balance>
      )}
    </Container>
  );
};

export default GYDBalance;

const Container = styled.div<{ visible?: boolean; charLength: number }>`
  align-items: center;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  max-width: ${({ visible, charLength }) =>
    visible ? charLength * 8 + 50 + "px" : "0px"};
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  width: ${({ visible, charLength }) =>
    visible ? charLength * 8 + 50 + "px" : "0px"};
`;

const Balance = styled.div`
  animation: fadeIn 0.2s;
  align-items: center;
  display: flex;
  gap: 7px;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const TokenImageContainer = styled.div`
  max-height: 15px;
  max-width: 13px;

  img {
    height: 100%;
    width: 100%;
  }
`;
