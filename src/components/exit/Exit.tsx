import styled from "styled-components";
import { useEffect, useContext, useRef, useState } from "react";
import { useRollbar } from "@rollbar/react";
import { BigNumber } from "ethers";
import { formatFixed } from "@ethersproject/bignumber";
import { PoolDataContext } from "../../contexts/PoolData";
import { Web3Context } from "../../contexts/Web3";
import { BalancerContext } from "../../contexts/Balancer";
import { UserShareContext } from "../../contexts/UserShare";
import balanceInputValues from "../../utils/pools/balanceInputValues";
import calculateBptDesired from "../../utils/pools/calculateBptDesired";
import QuantityInput from "../UI/QuantityInput";
import HorizontalRule from "../UI/HorizontalRule";
import Tooltip from "../UI/Tooltip";
import Row from "../UI/Row";
import LoadingAnimation from "../UI/LoadingAnimation";
import theme from "../../styles/theme";
import { ZERO, ONE } from "../../constants/misc";
import formatBigNumberString from "../../utils/formatBigNumberString";
import Column from "../UI/Column";
import ExternalPriceSafetyCheck from "../join/ExternalPriceSafetyCheck";
import { PoolToken } from "../../../types/subgraph/__generated__/types";
import { Web3FallbackContext } from "../../contexts/Web3Fallback";

const Exit = () => {
  const rollbar = useRollbar();

  const { data, subgraphOutOfSync } = useContext(UserShareContext);
  const { data: poolData } = useContext(PoolDataContext);
  const { isNetworkMismatch, provider } = useContext(Web3Context);
  const { exitPool } = useContext(BalancerContext);
  const { reportFailedRequest } = useContext(Web3FallbackContext);

  const [transactionState, setTransactionState] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<(BigNumber | null)[]>([]);
  const prevBalancedInputValues = useRef<(BigNumber | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const assets = data.map(({ address }: { address: string }) => address);

  const loading = transactionState === "loading";
  const complete = transactionState === "complete";

  const exceedsBalance = inputValues.some((inputValue, index) => {
    if (!inputValue) return;
    return inputValue.gt(data[index].balance);
  });

  const anyZerosOrNulls = inputValues.some(
    (inputValue) => !inputValue || inputValue.isZero()
  );

  const allTokensWithPrices: boolean =
    !!data.length && data.every(({ price }) => price);

  const totalExitValue = allTokensWithPrices
    ? inputValues
        .map((input, index) =>
          (input || ZERO).mul(data[index].price as BigNumber).div(ONE)
        )
        .reduce((acc, el) => acc.add(el), ZERO)
    : null;

  const exitDisabled =
    !subgraphOutOfSync &&
    (isNetworkMismatch ||
      exceedsBalance ||
      anyZerosOrNulls ||
      !poolData?.pool?.id ||
      loading ||
      complete);

  useEffect(() => {
    if (poolData) {
      balanceInputValues(
        inputValues,
        setInputValues,
        prevBalancedInputValues,
        poolData
      );
    }
  }, [inputValues, poolData]);

  async function onExitPool() {
    if (poolData?.pool?.id && !exitDisabled) {
      try {
        setErrorMessage("");
        setTransactionState("loading");

        const bptIn = calculateBptDesired(
          poolData.pool.totalShares,
          poolData.pool.tokens as PoolToken[],
          inputValues as BigNumber[]
        );

        await exitPool(poolData.pool.id, assets, bptIn);

        setTransactionState("complete");
        setInputValues(new Array(data.length).fill(ZERO));
        setTimeout(() => {
          setTransactionState(null);
        }, 5000);
      } catch (e: any) {
        console.error(e);
        if (e?.message && e?.message.includes("User denied transaction"))
          setErrorMessage("Error: User denied transaction");
        else {
          const errorMessage = "Error during exit transaction: " + e.message;
          setErrorMessage(errorMessage);
          if (!provider || (await reportFailedRequest(provider))) {
            rollbar.critical(errorMessage);
          }
        }
        setTransactionState(null);
      }
    }
  }

  return (
    <Column maxWidth={"440px"}>
      <ExternalPriceSafetyCheck exit />
      <Container>
        <Row margin="0 0 30px 0">
          <Header>Exit pool</Header>
          <Tooltip message="Only proportional exits allowed at the moment" />
        </Row>
        <HorizontalRule />
        <Spacer />
        {data.map((token, index) => (
          <QuantityInput
            key={index}
            index={index}
            token={token}
            inputValue={inputValues[index]}
            setInputValues={setInputValues}
            exceedsBalance={
              !!(inputValues[index] && inputValues[index]?.gt(token.balance))
            }
          />
        ))}

        <TotalContainer>
          <TotalText flex="1">TOTAL</TotalText>
          <VerticalBar />
          <TotalText flex="4">
            {totalExitValue
              ? "$ " +
                formatBigNumberString(formatFixed(totalExitValue, 18), 2, 2)
              : "-"}
          </TotalText>
          <VerticalBar />
          <MaxButton
            id="max-exit-button"
            disabled={inputValues.every((bn, index) =>
              bn?.eq(data[index].balance)
            )}
            onClick={() => {
              prevBalancedInputValues.current = data.map(
                ({ balance }) => balance
              );
              setInputValues(data.map(({ balance }) => balance));
            }}
          >
            Max
          </MaxButton>
        </TotalContainer>

        <Button id="exit-button" onClick={onExitPool} disabled={exitDisabled}>
          {complete ? (
            "EXIT POOL SUCCESSFUL"
          ) : loading ? (
            <Row alignItems="center">
              <LoadingAnimation
                size="30"
                color={theme.colors.dark}
                margin="0 10px 0 0"
              />
              EXITING POOL ... this may take some time
            </Row>
          ) : (
            "EXIT POOL"
          )}
        </Button>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Container>
    </Column>
  );
};

const Button = styled.div<{ disabled?: boolean }>`
  align-items: center;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  color: ${({ theme }) => theme.colors.dark};
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  display: flex;
  font-weight: 900;
  justify-content: center;
  padding: 20px;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.offWhite};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  padding: 28px;
`;

const Header = styled.h5`
  margin: 0;
`;

const Spacer = styled.div`
  height: 20px;
`;

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

export default Exit;
