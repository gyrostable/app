import styled from "styled-components";
import { BigNumber } from "@ethersproject/bignumber";
import { BsArrowUpRight } from "react-icons/bs";
import HorizontalRule from "../../../UI/HorizontalRule";
import Row from "../../../UI/Row";
import { useContext } from "react";
import { PoolDataContext } from "../../../../contexts/PoolData";
import Loading from "../../../UI/Loading";
import formatBigNumberString from "../../../../utils/formatBigNumberString";
import { formatFixed } from "@ethersproject/bignumber";
import { Web3Context } from "../../../../contexts/Web3";
import theme from "../../../../styles/theme";
import safeParseFixed from "../../../../utils/safeParseFixed";

const Composition = () => {
  const { loading, data, prices } = useContext(PoolDataContext);
  const { selectedNetworkConfig } = useContext(Web3Context);

  return (
    <Container>
      <Header>
        <Title>Pool Composition</Title>{" "}
      </Header>
      <HorizontalRule />
      <Row margin="24px 0 0 0">
        <Cell header flex="2">
          ASSET
        </Cell>
        <Cell header flex="1">
          BALANCE
        </Cell>
        <Cell header flex="1">
          VALUE
        </Cell>
      </Row>

      {loading ? (
        <LoadingRows />
      ) : (
        data?.pool?.tokens?.map(({ symbol, balance, address }, index) => (
          <Row margin="24px 0 0 0" key={index}>
            <Cell flex="2">
              {symbol}
              <a
                href={
                  selectedNetworkConfig.blockExplorerUrls +
                    "address/" +
                    address || ""
                }
                target="_blank"
                rel="noreferrer"
              >
                <BsArrowUpRight
                  style={{
                    color: theme.colors.white,
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />
              </a>
            </Cell>
            <Cell flex="1">{formatBigNumberString(balance, 6, 6)}</Cell>
            <Cell flex="1">
              {(prices &&
                prices[address] &&
                "$ " +
                  formatBigNumberString(
                    formatFixed(
                      (prices[address] as BigNumber)
                        .mul(safeParseFixed(balance, 18))
                        .div(safeParseFixed("1", 18)),
                      18
                    ).toString(),
                    2,
                    2
                  )) ||
                "-"}
            </Cell>
          </Row>
        ))
      )}
    </Container>
  );
};

export default Composition;

const LoadingRows = () => {
  return (
    <>
      <Row margin="24px 0 0 0">
        <Loading height="24px" width="100%" />
      </Row>
      <Row margin="24px 0 0 0">
        <Loading height="24px" width="100%" />
      </Row>
      <Row margin="24px 0 0 0">
        <Loading height="24px" width="100%" />
      </Row>
    </>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  margin-bottom: 24px;
  padding: 28px;
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  position: relative;
  margin-bottom: 28px;
`;

const Title = styled.h5`
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  margin: 0;
`;

const Cell = styled.div<{ flex?: string | number; header?: boolean }>`
  align-items: center;
  display: flex;
  flex: ${({ flex }) => (flex ? flex : "")};
  font-weight: ${({ header }) => (header ? 900 : "")};
`;
