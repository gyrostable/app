import styled from "styled-components";
import { BigNumber } from "ethers";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import { useState, useContext } from "react";
import { PAMMContext } from "../../../contexts/PAMM";
import TokenSymbolRow from "../../UI/TokenSymbolRow";
import { WalletTokenDataType } from "../../../contexts/Wallet/Context";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import { ONE } from "../../../constants/misc";
import safeParseFixed from "../../../utils/safeParseFixed";
import destructureUnderlierSymbols from "../../../utils/destructureUnderlierSymbols";
import Column from "../../UI/Column";

const SlippageTable = () => {
  const {
    selectedRedeemTokens,
    redeemSlippages,
    setRedeemSlippages,
    redeemProportions,
    setRedeemProportions,
    expectedOutputAmounts,
  } = useContext(PAMMContext);

  function setSingleRedeemSlippageGenerator(index: number) {
    function setSingleRedeemSlippage(newValue: number) {
      setRedeemSlippages((prev) => [
        ...prev.slice(0, index),
        newValue,
        ...prev.slice(index + 1, prev.length),
      ]);
    }
    return setSingleRedeemSlippage;
  }

  function setSingleRedeemProportionGenerator(index: number) {
    function setSingleRedeemProportion(newValue: number) {
      setRedeemProportions((prev) => [
        ...prev.slice(0, index),
        parseFixed(String(newValue / 100), 18),
        ...prev.slice(index + 1, prev.length),
      ]);
    }
    return setSingleRedeemProportion;
  }

  return (
    <table>
      <thead>
        <tr>
          <TableHeader>Token</TableHeader>
          <TableHeader>Slippage</TableHeader>
          <TableHeader>Weight</TableHeader>
          <TableHeader>Minimum Amount</TableHeader>
        </tr>
      </thead>
      <tbody>
        {selectedRedeemTokens.map((tokenData, index) => (
          <TableRow
            tokenData={tokenData}
            key={index}
            slippage={redeemSlippages[index]}
            setSlippage={setSingleRedeemSlippageGenerator(index)}
            proportion={
              Math.round(Number(formatFixed(redeemProportions[index], 14))) /
              100
            }
            setProportion={setSingleRedeemProportionGenerator(index)}
            expectedTokenOutput={
              expectedOutputAmounts && expectedOutputAmounts[index]
            }
          />
        ))}
      </tbody>
    </table>
  );
};

export default SlippageTable;

const TableHeader = styled.th`
  font-size: 10px;
  text-align: left;
  text-transform: uppercase;
  padding-bottom: 8px;
`;

const TableRow = ({
  tokenData,
  slippage,
  setSlippage,
  proportion,
  setProportion,
  expectedTokenOutput,
}: {
  tokenData: WalletTokenDataType;
  slippage: number;
  setSlippage: (newValue: number) => void;
  proportion: number;
  setProportion: (newValue: number) => void;
  expectedTokenOutput: BigNumber | null;
}) => {
  const { isBalancedRedemption } = useContext(PAMMContext);

  const minTokenOutput =
    expectedTokenOutput &&
    formatBigNumberString(
      formatFixed(
        expectedTokenOutput
          .mul(safeParseFixed(String(100 - slippage), 16))
          .div(ONE),
        18
      ),
      6,
      6
    );

  const minTokenOutputValue =
    tokenData.price &&
    expectedTokenOutput &&
    "$ " +
      formatBigNumberString(
        formatFixed(
          expectedTokenOutput
            .mul(safeParseFixed(String(100 - slippage), 16))
            .div(ONE)
            .mul(tokenData.price)
            .div(ONE),
          18
        ),
        2,
        2
      );

  return (
    <tr>
      <TokenLabel>
        <Column alignItems="center" gap="5px">
          <TokenSymbolRow
            symbols={destructureUnderlierSymbols(tokenData.symbol)}
            size={20}
          />
          {tokenData.name}
        </Column>
      </TokenLabel>
      <PercentageSelect contextValue={slippage} setContextValue={setSlippage} />
      <PercentageSelect
        disabled={!!isBalancedRedemption}
        contextValue={proportion}
        setContextValue={setProportion}
      />
      <td>
        <Amount>
          <Column>
            {minTokenOutput}
            {minTokenOutputValue && <Value>{minTokenOutputValue}</Value>}
          </Column>
        </Amount>
      </td>
    </tr>
  );
};

const TokenLabel = styled.td`
  align-items: center;
  background: ${({ theme }) => theme.colors.highlightLight};
  border-radius: 4px;
  display: flex;
  font-size: 12px;
  justify-content: center;
  gap: 3px;
  margin: 8px 0;
  max-width: 110px;
  padding: 10px;
  text-align: center;
`;

const Amount = styled.div`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.highlightLight};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  color: white;
  justify-content: flex-start;
  font-size: 13px;
  height: 40px;
  outline: none;
  padding: 10px;
  padding-left: 20px;
  position: relative;
  width: 112px;
`;

const Value = styled.div`
  color: ${({ theme }) => theme.colors.highlightVeryLight};
  font-size: 12px;
`;

const PercentageSelect = ({
  contextValue,
  setContextValue,
  disabled,
}: {
  contextValue: number;
  setContextValue: (newValue: number) => void;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState(String(contextValue));

  return (
    <td>
      <InputContainer>
        <PercentageInput
          disabled={!!disabled}
          value={value}
          type="number"
          onChange={(e) => {
            const num = Number(e.target.value);
            const decimals = e.target.value.split(".")[1];
            if (num >= 0 && num <= 100 && (!decimals || decimals.length <= 2)) {
              setValue(e.target.value);
              setContextValue(num);
            }
          }}
        />
        <Percentage>%</Percentage>
      </InputContainer>
    </td>
  );
};

const PercentageInput = styled.input<{ disabled: boolean }>`
  background: ${({ theme }) => theme.colors.highlightDark};
  border: 1px solid
    ${({ theme, disabled }) =>
      disabled ? theme.colors.highlightLight : theme.colors.white};
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: ${({ disabled }) =>
    disabled ? "" : "0px 0px 0px 2px rgba(255, 255, 255, 0.25)"};
  color: ${({ theme }) => theme.colors.white};
  font-family: "noigrotesk", Arial, sans-serif;
  height: 40px;
  outline: none;
  padding: 10px;
  padding-right: 35px;
  width: 72px;
`;

const Percentage = styled.p`
  margin: 0;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translate(-50%, -55%);
`;

const InputContainer = styled.div`
  position: relative;
  width: 72px;
`;

const PercentagePlaceholder = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.25);
  color: white;
  height: 40px;
  width: 72px;
`;
