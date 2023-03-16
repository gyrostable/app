import styled from "styled-components";
// import { FiSettings } from "react-icons/fi"; // TODO - implement settings
import HorizontalRule from "../../UI/HorizontalRule";
import Row from "../../UI/Row";
import Column from "../../UI/Column";
import QuantityInput from "../../UI/QuantityInput";
import { useContext, useEffect, useState, useRef } from "react";
import { WalletContext } from "../../../contexts/Wallet";
import { Web3Context } from "../../../contexts/Web3";
import Loading from "../../UI/Loading";
import { ModalContext } from "../../../contexts/Modal";
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { ZERO, ONE } from "../../../constants/misc";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import { PoolDataContext } from "../../../contexts/PoolData";
import Tooltip from "../../UI/Tooltip";
import balanceInputValues from "../../../utils/pools/balanceInputValues";
import findConstrainedMax from "../../../utils/pools/findConstrainedMax";
import JoinModal from "../../UI/Modal/components/JoinModal";
import { UserShareContext } from "../../../contexts/UserShare";

const Join = () => {
  const { loading, data } = useContext(WalletContext);
  const { data: poolData } = useContext(PoolDataContext);
  const { isNetworkMismatch } = useContext(Web3Context);
  const { setModalOpen, setModalPayload } = useContext(ModalContext);
  const { subgraphOutOfSync } = useContext(UserShareContext);

  // Form state
  const [inputValues, setInputValues] = useState<(BigNumber | null)[]>([]);
  const prevBalancedInputValues = useRef<(BigNumber | null)[]>([]);

  const exceedsBalance = inputValues.some((inputValue, index) => {
    if (!inputValue) return;
    return inputValue.gt((data.length && data[index].balance) || ZERO);
  });

  const exceedsAllowance = inputValues.some((inputValue, index) => {
    if (!inputValue || !data[index]?.limitedAllowance) return;
    return inputValue.gt(data[index].limitedAllowance as BigNumber);
  });

  const anyZerosOrNulls = inputValues.some(
    (inputValue) => !inputValue || inputValue.isZero()
  );

  const allTokensWithPrices: boolean =
    !!data.length && data.every(({ price }) => price);
  const totalJoinValue = allTokensWithPrices
    ? inputValues
        .map((input, index) =>
          (input || ZERO).mul(data[index].price as BigNumber).div(ONE)
        )
        .reduce((acc, el) => acc.add(el), ZERO)
    : null;

  const constrainedMaxInputValues = findConstrainedMax(data, poolData);

  const balancedMaxValues = constrainedMaxInputValues
    ? balanceInputValues(
        constrainedMaxInputValues,
        () => {},
        undefined,
        poolData
      )
    : null;

  useEffect(() => {
    balanceInputValues(
      inputValues,
      setInputValues,
      prevBalancedInputValues,
      poolData
    );
  }, [inputValues, poolData]);

  return (
    <Container>
      <Row
        alignItems="center"
        margin="0 0 28px 0"
        justifyContent="space-between"
      >
        <Row alignItems="center">
          <h5>Join Pool</h5>
          <Tooltip message="Only proportional joins allowed at the moment" />
        </Row>

        {/* <SettingsContainer>
          <FiSettings />
        </SettingsContainer> */}
      </Row>

      <HorizontalRule />
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <Column padding="24px 0 0 0">
            {data.map((token, index) => (
              <QuantityInput
                key={index}
                index={index}
                token={token}
                inputValue={inputValues[index]}
                setInputValues={setInputValues}
                exceedsBalance={Boolean(
                  inputValues[index] && inputValues[index]?.gt(token.balance)
                )}
                exceedsAllowance={Boolean(
                  inputValues[index] &&
                    token?.limitedAllowance &&
                    inputValues[index]?.gt(token.limitedAllowance)
                )}
                join
              />
            ))}
          </Column>
          {allTokensWithPrices && (
            <TotalContainer>
              <TotalText flex="1">TOTAL</TotalText>
              <VerticalBar />
              <TotalText flex="4">
                ${" "}
                {formatBigNumberString(
                  formatFixed(totalJoinValue || ZERO, 18),
                  2,
                  2
                )}
              </TotalText>
              <VerticalBar />
              <MaxButton
                id="max-join-button"
                disabled={inputValues.some(
                  (bn, index) =>
                    constrainedMaxInputValues &&
                    bn?.eq(constrainedMaxInputValues[index])
                )}
                onClick={() => {
                  if (balancedMaxValues) {
                    setInputValues(balancedMaxValues);
                  }
                }}
              >
                Max
              </MaxButton>
            </TotalContainer>
          )}
          <Button
            id="join-button-1"
            onClick={() => {
              if (
                !(
                  isNetworkMismatch ||
                  exceedsBalance ||
                  exceedsAllowance ||
                  anyZerosOrNulls
                )
              ) {
                setModalPayload({
                  walletData: data,
                  inputValues,
                  totalJoinValue,
                  noCloseOnClickOutside: true,
                  setInputValues,
                  header: `Join ${data
                    .map(({ symbol }) => symbol)
                    .join(" / ")} Pool`,
                  body: <JoinModal />,
                });
                setModalOpen("join");
              }
            }}
            disabled={
              !subgraphOutOfSync &&
              (isNetworkMismatch ||
                exceedsBalance ||
                exceedsAllowance ||
                anyZerosOrNulls)
            }
          >
            JOIN POOL
          </Button>
        </>
      )}
    </Container>
  );
};

const LoadingComponent = () => {
  return (
    <>
      <Loading height="90px" width="100%" margin="24px 0 0 0 " />
      <Loading height="90px" width="100%" margin="24px 0 0 0 " />
      <Loading height="90px" width="100%" margin="24px 0 0 0 " />
    </>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  margin-bottom: 24px;
  padding: 28px;

  h5 {
    margin: 0;
  }
`;

// const SettingsContainer = styled.div`
//   align-items: center;
//   background: ${({ theme }) => theme.colors.highlight};
//   border: 1px solid ${({ theme }) => theme.colors.highlightVeryLight};
//   border-radius: 8px;
//   cursor: pointer;
//   display: flex;
//   height: 36px;
//   justify-content: center;
//   transition: all 0.2s ease-in-out;
//   width: 36px;

//   &:hover {
//     background: ${({ theme }) => theme.colors.highlightLight};
//   }
// `;

const TotalContainer = styled.div`
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  display: flex;
  margin-bottom: 20px;
  position: relative;
`;

const TotalText = styled.p<{ flex: number | string }>`
  margin: 10px;
  flex: ${({ flex }) => flex};
  width: 100px;
`;

const VerticalBar = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  height: 40px;
  width: 1px;
`;

const Button = styled.div<{ disabled?: boolean }>`
  align-items: center;
  box-sizing: border-box;
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.highlightDark : theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.highlight : theme.colors.dark};
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  display: flex;
  font-weight: 900;
  justify-content: center;
  padding: 20px;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    background: ${({ theme, disabled }) =>
      disabled ? theme.colors.highlightDark : theme.colors.offWhite};
  }
`;

const MaxButton = styled.button`
  border: 1px solid;
  outline: none;

  align-items: center;
  background: ${({ theme }) => theme.colors.highlightLight};
  border: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  font-weight: 900;
  justify-content: center;
  padding: 8px 16px;
  position: relative;
`;

export default Join;
