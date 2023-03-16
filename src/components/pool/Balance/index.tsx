import { useContext } from "react";
import styled from "styled-components";
import { Web3Context } from "../../../contexts/Web3";
import HorizontalRule from "../../UI/HorizontalRule";
import Row from "../../UI/Row";
import ConnectWallet from "./components/ConnectWallet";
import Loading from "../../UI/Loading";
import Column from "../../UI/Column";
import { UserShareContext } from "../../../contexts/UserShare";
import { PoolDataContext } from "../../../contexts/PoolData";
import { formatFixed } from "@ethersproject/bignumber";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import { WalletContext } from "../../../contexts/Wallet";
import JoinExitButtons from "./components/JoinExitButtons";
import PoolPausedWarning from "./components/PoolPausedWarning";
import PoolCappedWarning from "./components/PoolCappedWarning";
import findConstrainedMax from "../../../utils/pools/findConstrainedMax";
import balanceInputValues from "../../../utils/pools/balanceInputValues";
import { ONE, ZERO } from "../../../constants/misc";

const FIXED_OFFSET_MARGIN = 50;

const Balance = () => {
  const { account } = useContext(Web3Context);

  const {
    loading: userShareLoading,
    data: tokensShareData,
    totalValue: totalValueUserBalance,
  } = useContext(UserShareContext);

  const { loading: walletLoading, data: walletData } =
    useContext(WalletContext);

  const { data: poolData } = useContext(PoolDataContext);

  const constrainedMaxInputValues = findConstrainedMax(walletData, poolData);

  const balancedMaxValues = constrainedMaxInputValues
    ? balanceInputValues(
        constrainedMaxInputValues,
        () => {},
        undefined,
        poolData
      )
    : null;

  const maxInputValues = balancedMaxValues?.map((maxValue, index) => {
    const value = walletData[index].price
      ? walletData[index].price?.mul(maxValue).div(ONE)
      : undefined;
    return value;
  });

  const totalMaxValue = maxInputValues?.reduce(
    (acc, el) => (acc ? el?.add(acc) : undefined),
    ZERO
  );

  return (
    <Container>
      <Header>
        <Title>My pool balance</Title>
      </Header>
      <HorizontalRule />
      {userShareLoading || walletLoading ? (
        <LoadingBars />
      ) : (
        <>
          {tokensShareData.map(({ name, symbol, value, balance }, index) => (
            <div key={index}>
              <Row
                margin="28px 0 0 0"
                justifyContent="space-between"
                alignItems="center"
              >
                <Crypto>{symbol}</Crypto>
                <h5>
                  {account
                    ? formatBigNumberString(formatFixed(balance, 18), 6, 6)
                    : "-"}
                </h5>
              </Row>

              <Row justifyContent="space-between" alignItems="center">
                <p>{name}</p>
                <p>
                  {value && account
                    ? "$ " + formatBigNumberString(formatFixed(value, 18), 2, 2)
                    : "-"}
                </p>
              </Row>
            </div>
          ))}

          <Row
            margin="28px 0 0 0"
            justifyContent="space-between"
            alignItems="center"
          >
            <h5>Total</h5>
            <h5>
              {totalValueUserBalance && account
                ? "$ " +
                  formatBigNumberString(
                    formatFixed(totalValueUserBalance, 18),
                    2,
                    2
                  )
                : "-"}
            </h5>
          </Row>
          <Spacer />
          <HorizontalRule />
          <Row
            margin="28px 0 0 0"
            justifyContent="space-between"
            alignItems="center"
          >
            <p style={{ fontSize: "14px", marginBottom: "2px" }}>
              Based on the pool assets in your wallet
            </p>
          </Row>
          <Row
            margin="0 0 28px 0"
            justifyContent="space-between"
            alignItems="center"
          >
            <h5 style={{ fontSize: "20px" }}>You can put in</h5>
            <h5 style={{ fontSize: "20px" }}>
              {account && totalMaxValue
                ? "$ " +
                  formatBigNumberString(formatFixed(totalMaxValue, 18), 2, 2)
                : "-"}
            </h5>
          </Row>
        </>
      )}
      {account ? <JoinExitButtons /> : <ConnectWallet />}
      <PoolCappedWarning />
      <PoolPausedWarning />
    </Container>
  );
};

export default Balance;

const LoadingBars = () => {
  return (
    <Column>
      <Row margin="28px 0 0 0">
        <Loading width="100%" height="48.5px" />
      </Row>
      <Row margin="28px 0 0 0">
        <Loading width="100%" height="48.5px" />
      </Row>
      <Row margin="28px 0 0 0">
        <Loading width="100%" height="48.5px" />
      </Row>
      <Spacer />
      <HorizontalRule />
      <Row margin="28px 0 28px 0">
        <Loading width="100%" height="48.5px" />
      </Row>
    </Column>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  padding: 28px;
  position: sticky;
  top: ${FIXED_OFFSET_MARGIN}px;

  h5,
  p {
    margin: 0;
  }
`;

const Header = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 28px;
`;

const Title = styled.h5`
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  margin: 0;
`;

const Crypto = styled.h5`
  font-size: 28px;
  margin: 0;
`;

const Spacer = styled.div`
  height: 28px;
`;
