import { BigNumber } from "ethers";
import { formatFixed } from "@ethersproject/bignumber";
import { useContext } from "react";
import styled from "styled-components";
import { WalletContext } from "../../contexts/Wallet";
import { UserShareContext } from "../../contexts/UserShare";
import Column from "../UI/Column";
import HorizontalRule from "../UI/HorizontalRule";
import Row from "../UI/Row";
import formatBigNumberString from "../../utils/formatBigNumberString";
import Loading from "../UI/Loading";
import Tooltip from "../UI/Tooltip";

interface TokensElement {
  name: string;
  balance: BigNumber;
  value?: BigNumber;
  symbol: string;
}

const Tokens = () => {
  const {
    loading: userShareLoading,
    data: tokensShareData,
    totalValue: totalValueUserBalance,
  } = useContext(UserShareContext);

  const {
    loading: walletLoading,
    data: walletData,
    totalValue: totalValueWalletBalance,
  } = useContext(WalletContext);

  return (
    <Container>
      <TokenList
        title="Wallet Balance"
        tokens={walletData}
        total={totalValueWalletBalance}
        loading={walletLoading || userShareLoading}
      />
      <ColumnSpacer />
      <TokenList
        title="Pool Balance"
        tokens={tokensShareData}
        total={totalValueUserBalance}
        loading={walletLoading || userShareLoading}
      />
    </Container>
  );
};

const TokenList = ({
  title,
  tokens,
  total,
  loading,
}: {
  title: string;
  tokens: TokensElement[];
  total?: BigNumber;
  loading: boolean;
}) => {
  return (
    <Column flex="1">
      <Header>{title}</Header>
      <HorizontalRule />
      {loading ? (
        <LoadingRows />
      ) : (
        <>
          {tokens.map(({ name, balance, value, symbol }, index) => (
            <Column margin="30px 0 0 0" key={index}>
              <Row justifyContent="space-between">
                <RowElement>{symbol}</RowElement>
                <RowElement>
                  {formatBigNumberString(
                    formatFixed(balance, 18).toString(),
                    6,
                    6
                  )}
                </RowElement>
              </Row>
              <Row justifyContent="space-between">
                <p>{name}</p>
                <p>
                  ${" "}
                  {value
                    ? formatBigNumberString(
                        formatFixed(value, 18).toString(),
                        2,
                        2
                      )
                    : "-"}
                </p>
              </Row>
            </Column>
          ))}
          <Spacer />
          <HorizontalRule />
          <Row
            alignItems="center"
            height="50px"
            margin="15px 0 0 0"
            justifyContent="space-between"
          >
            <RowElement>Total:</RowElement>
            <RowElement>
              ${" "}
              {total
                ? formatBigNumberString(formatFixed(total, 18).toString(), 2, 2)
                : "-"}
            </RowElement>
          </Row>
        </>
      )}
    </Column>
  );
};

const LoadingRows = () => {
  return (
    <Column>
      <Loading width="336px" height="53.5px" margin="30px 0 0 0" />
      <Loading width="336px" height="53.5px" margin="30px 0 0 0" />
      <Spacer />
      <HorizontalRule />
      <Loading width="336px" height="53.5px" margin="15px 0 0 0" />
    </Column>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  box-sizing: border-box;
  display: flex;
  max-width: 1000px;
  padding: 28px;
  width: 100%;
  p {
    margin: 0;
  }
`;

const Header = styled.h5`
  margin: 0;
  margin-bottom: 30px;
`;

const RowElement = styled.h5`
  margin: 0;
`;

const Spacer = styled.div`
  height: 30px;
`;

const ColumnSpacer = styled.div`
  width: 70px;
`;

export default Tokens;
