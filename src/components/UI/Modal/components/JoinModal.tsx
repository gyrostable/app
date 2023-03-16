import { BigNumber, formatFixed, parseFixed } from "@ethersproject/bignumber";
import { useRollbar } from "@rollbar/react";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import styled from "styled-components";
import { ModalContext } from "../../../../contexts/Modal";
import { WalletTokenDataType } from "../../../../contexts/Wallet/Context";
import formatBigNumberString from "../../../../utils/formatBigNumberString";
import Row from "../../Row";
import { ONE, ZERO } from "../../../../constants/misc";
import LoadingAnimation from "../../LoadingAnimation";
import theme from "../../../../styles/theme";
import { BalancerContext } from "../../../../contexts/Balancer";
import { TransactionsContext } from "../../../../contexts/Transactions";
import { PoolDataContext } from "../../../../contexts/PoolData";
import calculateBptDesired from "../../../../utils/pools/calculateBptDesired";
import safeParseFixed from "../../../../utils/safeParseFixed";
import { PoolQuery_PoolTokenFieldsFragment } from "../../../../../types/subgraph/__generated__/types";
import { Web3Context } from "../../../../contexts/Web3";
import { Web3FallbackContext } from "../../../../contexts/Web3Fallback";

const BPT_MULTIPLIER = safeParseFixed("0.9999999999999", 18); // Found from experimentation

const JoinModal = () => {
  const rollbar = useRollbar();

  const {
    modalPayload,
    setModalPayload,
  }: {
    modalPayload: {
      inputValues: BigNumber[];
      totalJoinValue: BigNumber | null;
      walletData: WalletTokenDataType[];
      setInputValues: Dispatch<SetStateAction<(BigNumber | null)[]>>;
    };
    setModalPayload: Dispatch<SetStateAction<any>>;
  } = useContext(ModalContext);
  const { joins, setTransactionState } = useContext(TransactionsContext);
  const { data: poolData } = useContext(PoolDataContext);
  const { joinPool, approveToken } = useContext(BalancerContext);
  const { provider } = useContext(Web3Context);
  const { reportFailedRequest } = useContext(Web3FallbackContext);

  const [errorMessage, setErrorMessage] = useState("");

  const assets = modalPayload.walletData.map(
    ({ address }: { address: string }) => address
  );

  const transactionKey =
    (poolData?.pool?.id || "") + JSON.stringify(modalPayload.inputValues);

  const loading = joins[transactionKey] === "loading";
  const complete = joins[transactionKey] === "complete";

  return (
    <Container>
      {modalPayload.totalJoinValue && (
        <TotalJoinValueContainer>
          <h3>
            ${" "}
            {formatBigNumberString(
              formatFixed(modalPayload.totalJoinValue, 18),
              2,
              2
            )}
          </h3>
        </TotalJoinValueContainer>
      )}
      <TokensContainer>
        {modalPayload.walletData.map(
          (token: WalletTokenDataType, index: number) => {
            const inputValue = modalPayload.inputValues[index];
            return (
              !inputValue.isZero() && (
                <div key={index}>
                  <Row justifyContent="space-between" alignItems="center">
                    <Label>{token.symbol}</Label>
                    <h3>
                      {formatBigNumberString(
                        formatFixed(formatInputValue(inputValue), 18)
                      )}
                    </h3>
                  </Row>
                  <Row
                    justifyContent="flex-end"
                    key={index}
                    margin="0 0 20px 0"
                  >
                    {token.price && (
                      <>
                        ${" "}
                        {formatBigNumberString(
                          formatFixed(inputValue.mul(token.price).div(ONE), 18),
                          2,
                          2
                        )}
                      </>
                    )}
                  </Row>
                </div>
              )
            );
          }
        )}
      </TokensContainer>
      <Button
        id="join-button-2"
        onClick={async () => {
          if (poolData?.pool?.id && !loading && !complete) {
            try {
              setErrorMessage("");
              setModalPayload((prev: any) => ({
                ...prev,
                noCloseButton: true,
              }));
              setTransactionState("joins", transactionKey, "loading");

              await Promise.all(
                modalPayload.walletData.map(async ({ address, allowed }) => {
                  if (!allowed) {
                    await approveToken(address);
                  }
                })
              );

              const bptOut = calculateBptDesired(
                poolData.pool.totalShares,
                poolData.pool.tokens as PoolQuery_PoolTokenFieldsFragment[],
                modalPayload.inputValues
              );

              await joinPool(
                poolData.pool.id,
                assets,
                bptOut.mul(BPT_MULTIPLIER).div(ONE) // Ensures 'transfer amount exceeds balance' error avoided
              );
              setTransactionState("joins", transactionKey, "complete");
              setModalPayload((prev: any) => ({
                ...prev,
                noCloseButton: false,
                onClose: () => {
                  setTransactionState("joins", transactionKey, null);
                  modalPayload.setInputValues(
                    new Array(modalPayload.walletData.length).fill(ZERO)
                  );
                },
              }));
            } catch (e: any) {
              console.error(e);
              if (e?.message && e?.message.includes("User denied transaction"))
                setErrorMessage("Error: User denied transaction");
              else {
                const errorMessage =
                  "Error during join transaction: " + e.message.split("(")[0];
                setErrorMessage(errorMessage);
                if (!provider || (await reportFailedRequest(provider))) {
                  rollbar.critical(errorMessage);
                }
              }
              setTransactionState("joins", transactionKey, null);
              setModalPayload((prev: any) => ({
                ...prev,
                noCloseButton: false,
              }));
            }
          }
        }}
        disabled={!poolData?.pool?.id || loading || complete}
      >
        {complete ? (
          "JOIN POOL SUCCESSFUL"
        ) : loading ? (
          <Row alignItems="center">
            <LoadingAnimation
              size="30"
              color={theme.colors.dark}
              margin="0 10px 0 0"
            />
            JOINING POOL ... this may take some time
          </Row>
        ) : (
          "JOIN POOL"
        )}
      </Button>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </Container>
  );
};

const Container = styled.div`
  h3 {
    margin: 0;
  }
`;

const TotalJoinValueContainer = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
  text-align: right;
`;

const TokensContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 10px 15px;
`;

const Label = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.highlightLight};
  border: 1px solid ${({ theme }) => theme.colors.highlightVeryLight};
  border-radius: 8px;
  display: flex;
  font-weight: 900;
  justify-content: center;
  padding: 8px 16px;
  position: relative;
`;

const Button = styled.div<{ disabled?: boolean }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  display: flex;
  color: ${({ theme }) => theme.colors.dark};
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  font-weight: 900;
  justify-content: center;
  height: 60px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme, disabled }) =>
      disabled ? "" : theme.colors.offWhite};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin: 10px auto;
  max-width: 500px;
`;

function formatInputValue(inputValue: BigNumber) {
  if (inputValue.gt(parseFixed("1", 12))) {
    return inputValue.sub(inputValue.mod(parseFixed("1", 12)));
  }
  return inputValue;
}

export default JoinModal;
