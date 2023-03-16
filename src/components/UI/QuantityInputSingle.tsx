import Image from "./Image";
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import styled from "styled-components";
import { AiOutlineWarning } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { VscClose } from "react-icons/vsc";
import Row from "./Row";
import whiteG from "../../../public/logos/G-white.png";
import ColoredBorder from "./ColoredBorder";
import TokenSymbolRow from "./TokenSymbolRow";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import formatBigNumberString from "../../utils/formatBigNumberString";
import safeParseFixed from "../../utils/safeParseFixed";
import { ZERO, ONE } from "../../constants/misc";
import destructureUnderlierSymbols from "../../utils/destructureUnderlierSymbols";
import { useContext } from "react";
import { PAMMContext } from "../../contexts/PAMM";

type QuantityInputSinglePropsType = {
  redeem?: boolean;
  token?: { symbol?: string };
  fieldValue?: string;
  setFieldValue?: (newValue: string) => void;
  onSelectToken?: () => void;
  tokenData?: WalletTokenDataType;
  unselect?: () => void;
  setValue?: (newValue: string) => void;
  value?: string;
  tokenMaxAllowed: boolean;
  maxConstraint?: BigNumber;
  selectable?: boolean;
};

const QuantityInputSingle = ({
  redeem,
  fieldValue,
  setFieldValue,
  onSelectToken,
  tokenData,
  unselect,
  setValue,
  value,
  tokenMaxAllowed,
  maxConstraint,
  selectable,
}: QuantityInputSinglePropsType) => {
  const { stablecoinSymbol } = useContext(PAMMContext);

  const inputPriceValueBigNumber =
    value && tokenData?.price
      ? safeParseFixed(value, tokenData.decimals).mul(tokenData.price).div(ONE)
      : null;

  const inputPriceValueString = inputPriceValueBigNumber
    ? formatBigNumberString(
        formatFixed(inputPriceValueBigNumber, tokenData?.decimals ?? 18),
        2,
        2
      )
    : "-";

  const exceedsBalance =
    !!(value && tokenData) &&
    safeParseFixed(value, tokenData.decimals).gt(tokenData.balance);

  const disabled = (!redeem && !tokenData) || (redeem && !onSelectToken);

  const tokenBalanceString = tokenData
    ? formatBigNumberString(
        formatFixed(tokenData.balance, tokenData.decimals),
        6,
        6
      )
    : "-";

  const tokenBalanceValueString =
    tokenData && tokenData.price
      ? formatBigNumberString(
          formatFixed(
            tokenData.balance.mul(tokenData.price).div(ONE),
            tokenData.decimals
          ),
          2,
          2
        )
      : null;

  function setMaxBalance() {
    if (setValue && tokenData && setFieldValue) {
      if (maxConstraint && maxConstraint.lt(tokenData.balance)) {
        setFieldValue(formatFixed(maxConstraint, 18));
        setValue(formatFixed(maxConstraint, 18));
      } else {
        setFieldValue(formatFixed(tokenData.balance, tokenData.decimals));
        setValue(formatFixed(tokenData.balance, tokenData.decimals));
      }
    }
  }

  return (
    <Container>
      <Row justifyContent="space-between" alignItems="center">
        {redeem && (
          <>
            <ColoredBorder borderRadius="9px">
              <Label redeem={redeem}>
                <Image src={whiteG} height={16} width={15.26} alt="Gyro icon" />
                {stablecoinSymbol}
              </Label>
            </ColoredBorder>
          </>
        )}

        {!redeem &&
          (tokenData ? (
            <Label>
              <TokenSymbolRow
                size={20}
                symbols={destructureUnderlierSymbols(tokenData.symbol)}
              />
              {tokenData.symbol}
            </Label>
          ) : (
            <Label
              onClick={onSelectToken}
              notAllowed={!onSelectToken}
              selectable={selectable}
            >
              Select Asset{redeem && "(s)"}
              <FiChevronDown style={{ marginLeft: "5px" }} />
            </Label>
          ))}

        {exceedsBalance && <ExceedsBalanceWarning />}

        <Input
          redeem={redeem}
          placeholder="0.0"
          disabled={disabled}
          value={formatInputString(fieldValue ?? "")}
          type="number"
          onChange={(e) => {
            if (!e.target.value) {
              setFieldValue && setFieldValue(e.target.value);
              setValue && setValue("0");
            } else {
              try {
                const bn = safeParseFixed(
                  e.target.value,
                  tokenData?.decimals || 18
                );
                if (
                  tokenData?.decimals &&
                  tokenData.decimals > 6 &&
                  bn.mod(safeParseFixed("1", tokenData.decimals - 6)).gt(ZERO)
                ) {
                  throw "Only up to 6 d.p. allowed";
                }
                if (bn.isNegative()) throw "Only positive values allowed";
                setFieldValue && setFieldValue(e.target.value);
                setValue && setValue(e.target.value);
              } catch (e) {
                console.error("Invalid input value");
              }
            }
          }}
        />
      </Row>
      <Row
        margin="10px 0 0 0"
        justifyContent="space-between"
        alignItems="center"
      >
        <Row gap="10px">
          <p style={{ position: "relative" }}>Balance: {tokenBalanceString}</p>
          {tokenBalanceValueString && <p>(${tokenBalanceValueString})</p>}
          {tokenData && tokenMaxAllowed && (
            <>
              <p
                id="quantity-input-single-max"
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={setMaxBalance}
              >
                Max
              </p>
            </>
          )}
        </Row>

        <p>$ {inputPriceValueString}</p>
      </Row>
      {tokenData && !redeem && (
        <RemoveButton onClick={unselect}>
          <VscClose fontSize="15px" color="white" />
        </RemoveButton>
      )}
    </Container>
  );
};

export default QuantityInputSingle;

const ExceedsBalanceWarning = () => {
  return (
    <WarningContainer>
      <AiOutlineWarning style={{ marginRight: "3px" }} /> Exceeds Asset Balance
    </WarningContainer>
  );
};

const WarningContainer = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  border: 1px solid #e27625;
  border-radius: 36px;
  color: #e27625;
  display: flex;
  font-size: 12px;
  padding: 2px 5px;
  position: absolute;
  left: 50%;
  top: -5px;
  transform: translateX(-50%);
  z-index: 1;
`;

const Container = styled.div`
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.highlight};
  border: 1px solid ${({ theme }) => theme.colors.highlightLight};
  border-radius: 8px;
  padding: 10px;
  position: relative;
  width: 100%;

  p {
    margin: 0;
  }
`;

const Input = styled.input<{ redeem?: boolean }>`
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "")};
  font-size: 32px;
  font-family: noigrotesk;
  margin: 0;
  outline: none;
  text-align: right;
  width: ${({ redeem }) => (redeem ? "150px" : "250px")};
`;

const Label = styled.button<{
  redeem?: boolean;
  notAllowed?: boolean;
  selectable?: boolean;
}>`
  align-items: center;
  background: ${({ theme, selectable, redeem }) =>
    redeem
      ? theme.colors.highlight
      : selectable
      ? theme.colors.highlightLight
      : theme.colors.white};
  border: ${({ theme, redeem }) =>
    redeem ? "none" : "1px solid " + theme.colors.highlightVeryLight};
  border-radius: 8px;
  color: ${({ theme, selectable, redeem }) =>
    selectable || redeem ? theme.colors.white : theme.colors.dark};
  cursor: ${({ notAllowed, redeem }) =>
    redeem ? "default" : notAllowed ? "not-allowed" : "pointer"};
  display: flex;
  font-weight: ${({ redeem }) => (redeem ? "500" : "900")};
  gap: 5px;
  max-width: 170px;
  justify-content: center;
  outline: none;
  padding: 8px 10px;
  position: relative;
`;

const RemoveButton = styled.div`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.highlightLight};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.highlightDark};
  display: flex;
  cursor: pointer;
  height: 18px;
  justify-content: center;
  outline: none;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(30%, -30%);
  width: 18px;
  z-index: 5;
`;

// Helper functions -------------------------------

function formatInputString(inputString: string) {
  if (inputString.split(".")[1]?.length > 6) {
    return (
      inputString.split(".")[0] + "." + inputString.split(".")[1].slice(0, 6)
    );
  }
  return inputString;
}
