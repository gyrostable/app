import { useContext } from "react";
import Link from "next/link";
import styled from "styled-components";

import { Web3Context } from "../../contexts/Web3";
import calculatePriceRange from "../../utils/pools/calculatePriceRange";
import capitalise from "../../utils/capitalise";
import { AllPoolsDataContext } from "../../contexts/AllPoolsData";
import { formatFixed } from "@ethersproject/bignumber";
import formatBigNumberString from "../../utils/formatBigNumberString";
import Column from "./Column";
import Row from "./Row";
import convertPoolType from "../../utils/pools/convertPoolType";
import WarningIcon from "../table/WarningIcon";
import { NEW_POOL_IDS } from "../../constants/misc";

const HEADERS = [
  "assets",
  "price range",
  "pool type",
  "pool value",
  "volume (total)",
  "swap fee",
];

const Table = () => {
  const { selectedNetworkConfig } = useContext(Web3Context);
  const { loading, data } = useContext(AllPoolsDataContext);

  return (
    <Container>
      <TableContainer id="pools-table">
        <thead>
          <TableRow>
            {HEADERS.map((header, index) => (
              <TableHeader key={index}>{header.toUpperCase()}</TableHeader>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {loading ? (
            <LoadingTableRows />
          ) : data?.length ? (
            data?.map((pool, index) => {
              const priceRange = calculatePriceRange(pool);

              return (
                <Link
                  key={index}
                  href={`/pools/${selectedNetworkConfig.chainName.toLowerCase()}/${convertPoolType(
                    pool.poolType
                  ).toLowerCase()}/${pool.address}`}
                >
                  <TableRow selectable={true}>
                    <TableData>
                      <Row alignItems="center" gap="10px">
                        {pool.paused && (
                          <WarningIcon
                            message={
                              "Pool is currently paused. Only exits are allowed"
                            }
                          />
                        )}
                        {pool.tokens
                          ?.map(({ symbol }: { symbol: string }) => symbol)
                          .join(" / ")}

                        {NEW_POOL_IDS.includes(pool.id) && (
                          <NewContainerBorderWrap>
                            <NewContainer>New</NewContainer>
                          </NewContainerBorderWrap>
                        )}
                      </Row>
                    </TableData>
                    <TableData>
                      <Column>
                        {priceRange[0]} - {priceRange[1]}
                        <p style={{ marginTop: "5px", fontSize: "12px" }}>
                          {pool.tokens.length < 3
                            ? pool.tokens
                                ?.map(
                                  ({ symbol }: { symbol: string }) => symbol
                                )
                                .join(" / ")
                            : "All asset pairs"}
                        </p>
                      </Column>
                    </TableData>
                    <TableData>{convertPoolType(pool.poolType)}</TableData>
                    <TableData>
                      ${" "}
                      {pool.poolValue
                        ? formatBigNumberString(
                            formatFixed(pool.poolValue, 18),
                            2,
                            2
                          )
                        : "-"}
                    </TableData>
                    <TableData>
                      ${" "}
                      {formatBigNumberString(
                        formatFixed(pool.swapVolume24Hours, 18),
                        2,
                        2
                      )}
                    </TableData>
                    <TableData>{Number(pool.swapFee) * 100 + "%"}</TableData>
                  </TableRow>
                </Link>
              );
            })
          ) : (
            <TableRow>
              <td>
                No pools exist on {capitalise(selectedNetworkConfig.name)}
              </td>
            </TableRow>
          )}
        </tbody>
      </TableContainer>
      {/* {data && data.length > 8 && <Button>+ Load more Pools</Button>} TODO: Implement Load more */}
    </Container>
  );
};

const LoadingTableRows = () => {
  return (
    <>
      <TableRow loadingState>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td />
      </TableRow>
      <TableRow loadingState>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td />
      </TableRow>
      <TableRow loadingState>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td />
      </TableRow>
      <TableRow loadingState>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td />
      </TableRow>
      <TableRow loadingState>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td />
      </TableRow>
    </>
  );
};

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TableContainer = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableRow = styled.tr<{ selectable?: boolean; loadingState?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.highlight};
  height: 80px;
  transition: all 0.2s ease-in-out;

  ${({ selectable, theme }) =>
    selectable &&
    `cursor:pointer; 
    &:hover {
        background: ${theme.colors.highlightDark};
      };`}

  ${({ loadingState, theme }) =>
    loadingState &&
    `
  animation: shimmerBackground 10s infinite;
  background: linear-gradient(
    to right,
    ${theme.colors.dark} 4%,
    ${theme.colors.highlightDark} 25%,
    ${theme.colors.dark} 36%
  );
  background-size: 1000px 100%;
  `}

  @keyframes shimmerBackground {
    0% {
      background-position: -5000px 0;
    }
    100% {
      background-position: 5000px 0;
    }
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding-left: 20px;
`;

const TableData = styled.td`
  text-align: left;
  padding-left: 20px;

  p {
    margin: 0;
  }
`;

export const NewContainer = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 86px;
  display: flex;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  justify-content: center;
  line-height: 12px;
  padding: 4px 8px;
`;

export const NewContainerBorderWrap = styled.div`
  background: linear-gradient(
    90deg,
    rgba(243, 255, 167) 0%,
    rgba(242, 227, 196) 35.94%,
    rgba(237, 187, 250) 63.54%,
    rgba(170, 241, 244) 100%
  );
  border-radius: 86px;
  margin-left: 8px;
  padding: 1px;
`;

export default Table;
