import styled from "styled-components";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import Row from "./Row";
import { AiOutlineWarning } from "react-icons/ai";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import formatBigNumberString from "../../utils/formatBigNumberString";
import { ONE } from "../../constants/misc";
import { addThousandsSeparators } from "../../utils/formatBigNumberString";
import { TokensShareData } from "../../contexts/UserShare/Context";
import {
  MAX_AMOUNT_BUFFER,
  ALLOWED_NUMERIC_CHARACTERS,
} from "../../constants/misc";
import safeParseFixed from "../../utils/safeParseFixed";

const QuantityInput = ({
  token,
  inputValue,
  setInputValues,
  exceedsBalance,
  index,
  join,
  tokenMaxAllowed,
  exceedsAllowance,
}: {
  token: WalletTokenDataType | TokensShareData;
  inputValue: BigNumber | null;
  setInputValues: Dispatch<SetStateAction<(BigNumber | null)[]>>;
  exceedsBalance: boolean;
  index: number;
  join?: boolean;
  tokenMaxAllowed?: boolean;
  exceedsAllowance?: boolean;
}) => {
  const [inputString, setInputString] = useState("");

  // useCallback
  const setInputValue = useCallback(
    (newValue: BigNumber | null, index: number) =>
      setInputValues((prev) => {
        const prevCopy = [...prev];
        prevCopy[index] = newValue;
        return prevCopy;
      }),
    [setInputValues]
  );

  useEffect(() => {
    if (!inputString) return setInputValue(null, index);
    setInputValue(formattedStringtoBigNumber(inputString), index);
  }, [inputString, setInputValue, index]);

  useEffect(() => {
    if (
      !inputValue ||
      (inputString && formattedStringtoBigNumber(inputString).eq(inputValue))
    )
      return;

    setInputString(bigNumberToFormattedString(inputValue));
  }, [inputValue]);

  return (
    <Container>
      <Row justifyContent="space-between">
        <Label>{token.symbol}</Label>
        {exceedsBalance && <ExceedsWarning message="Exceeds Asset Balance" />}
        {!exceedsBalance && exceedsAllowance && (
          <ExceedsWarning message="Exceeds Asset Allowance" />
        )}

        <Input
          value={formatInputString(inputString)}
          placeholder="0.0"
          onChange={(e) =>
            setInputStringFormatted(e.target.value, setInputString)
          }
        />
      </Row>
      <Row
        margin="10px 0 0 0"
        justifyContent="space-between"
        alignItems="center"
      >
        <Row gap="10px">
          <p style={{ position: "relative" }}>
            Balance:{" "}
            {formatBigNumberString(formatFixed(token.balance, 18), 6, 6)}
          </p>
          {token.allowed && tokenMaxAllowed && (
            <p
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() =>
                setInputString(
                  bigNumberToFormattedString(
                    token.balance.sub(join ? MAX_AMOUNT_BUFFER : 0)
                  )
                )
              }
            >
              Max
            </p>
          )}

          {(token as WalletTokenDataType)?.limitedAllowance && (
            <p>
              Limited Asset Allowance:{" "}
              {formatBigNumberString(
                formatFixed(
                  (token as WalletTokenDataType).limitedAllowance as BigNumber,
                  18
                ),
                6,
                6
              )}
            </p>
          )}
        </Row>

        <p>
          {token.price && inputValue && (
            <>
              ${" "}
              {formatBigNumberString(
                formatFixed(inputValue.mul(token.price).div(ONE), 18),
                2,
                2
              )}
            </>
          )}
        </p>
      </Row>
    </Container>
  );
};

export default QuantityInput;

const ExceedsWarning = ({ message }: { message: string }) => {
  return (
    <WarningContainer>
      <AiOutlineWarning style={{ marginRight: "3px" }} /> {message}
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
  left: 90px;
  transform: translateY(2px);
`;

const Container = styled.div`
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  margin-bottom: 20px;
  padding: 10px;
  position: relative;
  width: 100%;

  p {
    margin: 0;
  }
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

const Input = styled.input`
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: 32px;
  font-family: noigrotesk;
  margin: 0;
  outline: none;
  text-align: right;
  width: 280px;
`;

// Helper functions -------------------------------

function formattedStringtoBigNumber(inputString: string) {
  if (!inputString.includes(".") || inputString[inputString.length - 1] === ".")
    return safeParseFixed(inputString.split(".")[0].split(",").join(""), 18);

  const unformattedString =
    inputString.split(".")[0].split(",").join("") +
    "." +
    inputString.split(".")[1];

  return safeParseFixed(unformattedString, 18);
}

function bigNumberToFormattedString(input: BigNumber) {
  const unformattedString = formatFixed(input, 18);
  return (
    addThousandsSeparators(unformattedString.split(".")[0]) +
    (unformattedString.includes(".") && unformattedString.split(".")[1] !== "0"
      ? "." + unformattedString.split(".")[1]
      : "")
  );
}

function setInputStringFormatted(
  newString: string,
  setInputString: (newString: string) => void
) {
  const arr = Array.from(newString);
  if (!arr.length) return setInputString("");
  if (
    arr.filter((char) => char === ".").length > 1 ||
    arr[0] === "." ||
    (arr[0] === "0" && arr[1] === "0") ||
    (newString.split(".")[1] && newString.split(".")[1].length > 6)
  )
    return;
  const filteredString = arr
    .filter((char) => ALLOWED_NUMERIC_CHARACTERS.includes(char))
    .join("");
  const formattedString =
    addThousandsSeparators(filteredString.split(".")[0]) +
    (filteredString.includes(".") ? "." + filteredString.split(".")[1] : "");
  setInputString(formattedString);
}

function formatInputString(inputString: string) {
  if (inputString.split(".")[1]?.length > 6) {
    return (
      inputString.split(".")[0] + "." + inputString.split(".")[1].slice(0, 6)
    );
  }
  return inputString;
}
