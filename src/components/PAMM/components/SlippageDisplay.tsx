import styled from "styled-components";
import { useState, useEffect } from "react";
import Row from "../../UI/Row";
import Column from "../../UI/Column";
import { InfoText } from "./StyledComponents";
import { useContext } from "react";
import { PAMMContext } from "../../../contexts/PAMM";
import { ONE } from "../../../constants/misc";
import { formatFixed } from "@ethersproject/bignumber";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import safeParseFixed from "../../../utils/safeParseFixed";

const SlippageDisplay = () => {
  const {
    mintSlippage,
    setMintSlippage,
    setAutoMintSlippage,
    expectedGYDToReceive,
    stablecoinSymbol,
  } = useContext(PAMMContext);

  const [customChoiceSelected, setCustomChoiceSelected] = useState(false);
  const [customChoiceValue, setCustomChoiceValue] = useState(
    mintSlippage.toString()
  );

  useEffect(() => {
    if (!customChoiceSelected) setCustomChoiceValue(String(mintSlippage));
  }, [customChoiceSelected]);

  const slippageValue = expectedGYDToReceive
    ? formatBigNumberString(
        formatFixed(
          expectedGYDToReceive
            ?.mul(safeParseFixed(String(mintSlippage), 16))
            .div(ONE),
          18
        ),
        2,
        2
      )
    : "---";

  const minGYDReceived = expectedGYDToReceive
    ? formatBigNumberString(
        formatFixed(
          expectedGYDToReceive
            ?.mul(safeParseFixed(String(100 - mintSlippage), 16))
            .div(ONE),
          18
        ),
        2,
        2
      )
    : "---";

  return (
    <Row gap="16px">
      <Row gap="8px">
        <AutoCustomButton
          active
          onClick={() => {
            setAutoMintSlippage();
            setCustomChoiceSelected(false);
            setCustomChoiceValue(mintSlippage.toString());
          }}
        >
          AUTO
        </AutoCustomButton>
        {customChoiceSelected ? (
          <InputContainer>
            <CustomChoiceInput
              type="number"
              value={customChoiceValue}
              onChange={(e) => {
                const num = Number(e.target.value);
                const decimals = e.target.value.split(".")[1];
                if (
                  num >= 0 &&
                  num < 100 &&
                  (!decimals || decimals.length <= 2)
                ) {
                  setCustomChoiceValue(e.target.value);
                  setMintSlippage(num);
                }
              }}
            />
            <Percentage>%</Percentage>
          </InputContainer>
        ) : (
          <AutoCustomButton onClick={() => setCustomChoiceSelected(true)}>
            Custom
          </AutoCustomButton>
        )}
      </Row>
      <Column flex="1" justifyContent="center">
        <Row justifyContent="space-between" flex="1" alignItems="center">
          <InfoText>Slippage: {mintSlippage}%</InfoText>
          <InfoText>~$ {slippageValue}</InfoText>
        </Row>
        <Row justifyContent="space-between" flex="1" alignItems="center">
          <InfoText>Minimum {stablecoinSymbol} received</InfoText>
          <InfoText>~$ {minGYDReceived}</InfoText>
        </Row>
      </Column>
    </Row>
  );
};

export default SlippageDisplay;

const AutoCustomButton = styled.div<{ active?: boolean }>`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  background: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.highlightDark};
  box-sizing: border-box;
  color: ${({ active, theme }) =>
    active ? theme.colors.dark : theme.colors.offWhite};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  outline: none;
  transition: all 0.2s ease-in-out;
  width: 72px;
`;

const CustomChoiceInput = styled.input`
  background: ${({ theme }) => theme.colors.highlightDark};
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.25);
  color: white;
  height: 40px;
  outline: none;
  padding: 10px;
  padding-right: 35px;
  width: 72px;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Percentage = styled.p`
  margin: 0;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(-50%, -50%);
`;
