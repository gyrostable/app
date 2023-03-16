import styled from "styled-components";
import { useContext } from "react";
import Row from "../../../../Row";
import Column from "../../../../Column";
import TokenSymbolRow from "../../../../TokenSymbolRow";
import { WalletTokenDataType } from "../../../../../../contexts/Wallet/Context";
import Checkbox from "../../../../Checkbox";
import { formatFixed } from "@ethersproject/bignumber";
import { ZERO } from "../../../../../../constants/misc";
import formatBigNumberString from "../../../../../../utils/formatBigNumberString";
import { Web3Context } from "../../../../../../contexts/Web3";
import destructureUnderlierSymbols from "../../../../../../utils/destructureUnderlierSymbols";

const SelectTokenRow = ({
  data,
  onClick,
  selectable,
  selected = false,
  isRedeem,
}: {
  data: WalletTokenDataType;
  onClick: () => void;
  selectable?: boolean;
  selected?: boolean;
  isRedeem?: boolean;
}) => {
  const { account } = useContext(Web3Context);

  return (
    <Container onClick={onClick}>
      <Row gap="16px" alignItems="center">
        <TokenSymbolRow symbols={destructureUnderlierSymbols(data.symbol)} />
        <Row alignItems="center">
          <Tokens>{data.symbol}</Tokens>
        </Row>
      </Row>
      {!isRedeem && (
        <Row alignItems="center" gap="24px">
          <Column alignItems="flex-end">
            <Balance>
              {formatBigNumberString(
                formatFixed(data.balance, data.decimals),
                6,
                6
              )}
            </Balance>
            <Value>
              {account
                ? "~$" +
                  formatBigNumberString(
                    formatFixed(data.value || ZERO, 18),
                    2,
                    2
                  )
                : "Connect Wallet"}
            </Value>
          </Column>
          {selectable && <Checkbox isChecked={selected} />}
        </Row>
      )}
    </Container>
  );
};

export default SelectTokenRow;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 12px;
  transition: all 0.2s ease-in-out;
  outline: none;

  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
  }
`;

const Balance = styled.p`
  margin: 0;
  margin-bottom: 3px;
`;

const Value = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
  margin: 0;
`;

const Tokens = styled.p`
  font-weight: 700;
  margin: 0;
  margin-left: 5px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.colors.highlightLight};
`;
