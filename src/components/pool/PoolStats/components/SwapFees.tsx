// import { AiOutlineQuestionCircle } from "react-icons/ai";
import styled from "styled-components";
import HorizontalRule from "../../../UI/HorizontalRule";
import Row from "../../../UI/Row";
import Column from "../../../UI/Column";
import { useContext } from "react";
import { Web3Context } from "../../../../contexts/Web3";
import { PoolDataContext } from "../../../../contexts/PoolData";
import Loading from "../../../UI/Loading";
import calculatePriceRange from "../../../../utils/pools/calculatePriceRange";
import theme from "../../../../styles/theme";
import destructureBlockExplorer from "../../../../utils/destructureBlockExplorer";
import convertPoolType from "../../../../utils/pools/convertPoolType";
import { SubgraphPoolTypeType } from "../../../../utils/pools/convertPoolType";
import Tooltip from "../../../UI/Tooltip";
import findKeyPoolParams from "../../../../utils/pools/findKeyPoolParams";

const SwapFees = () => {
  const { loading, data } = useContext(PoolDataContext);
  const priceRange = calculatePriceRange(data?.pool);
  const { selectedNetworkConfig } = useContext(Web3Context);

  return (
    <Container>
      <Row
        alignItems="center"
        margin="0 0 28px 0"
        justifyContent="space-between"
      >
        <h5>Pool Properties</h5>
        {/* <AiOutlineQuestionCircle
          style={{ marginLeft: "6px", cursor: "pointer" }}
        /> */}
        <a
          href={
            selectedNetworkConfig.blockExplorerUrls +
              "address/" +
              data?.pool?.address || ""
          }
          style={{ color: theme.colors.white }}
          target="_blank"
          rel="noreferrer"
        >
          <p style={{ textDecoration: "underline" }}>
            View pool on{" "}
            {destructureBlockExplorer(selectedNetworkConfig.blockExplorerUrls)}
          </p>
        </a>
      </Row>
      <HorizontalRule />
      <Row padding="24px 0 0 0">
        <Row flex="1">
          <Column>
            <Subtitle>Pool Type</Subtitle>
            {loading ? (
              <Loading height="20px" width="100px" />
            ) : (
              <p>
                {convertPoolType(data?.pool?.poolType as SubgraphPoolTypeType)}
              </p>
            )}
          </Column>
          <Tooltip message={findKeyPoolParams(data)} />
        </Row>

        <Row flex="1">
          <Column>
            <Row>
              <Subtitle>Swap fees</Subtitle>
            </Row>
            {loading ? (
              <Loading height="20px" width="100px" />
            ) : (
              <p>{(Number(data?.pool?.swapFee) * 100).toFixed(2) + "%"}</p>
            )}
          </Column>
          <Tooltip message="Fees charged by the pool on a swap" />
        </Row>

        <Row flex="1">
          <Column>
            <Row>
              <Subtitle>Protocol fees</Subtitle>
            </Row>
            {loading ? (
              <Loading height="20px" width="100px" />
            ) : (
              // <p>{(Number(data?.pool?.totalSwapFee) * 100).toFixed(2) + "%"}</p>
              <p>0.00%</p> // Temporarily hard code 0% protocol fee
            )}
          </Column>
          <Tooltip message="% of swap fees that are directed to Gyroscope or Balancer" />
        </Row>

        <Column flex="1">
          <Subtitle>Price Range</Subtitle>
          {loading ? (
            <Loading height="20px" width="150px" />
          ) : (
            <Column>
              <p>
                {priceRange[0]} - {priceRange[1]}
              </p>
              <p style={{ fontSize: "12px" }}>
                {Number(data?.pool?.tokens?.length) < 3
                  ? data?.pool?.tokens
                      ?.map(({ symbol }: { symbol: string }) => symbol)
                      .join(" / ")
                  : "All asset pairs"}
              </p>
            </Column>
          )}
        </Column>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  margin-bottom: 24px;
  padding: 28px;

  h5 {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;

const Subtitle = styled.h4`
  font-size: 16px;
  font-weight: 900;

  margin: 0;
  margin-bottom: 12px;
`;

export default SwapFees;
