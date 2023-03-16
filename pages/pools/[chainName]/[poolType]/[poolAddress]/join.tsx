import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import Row from "../../../../../src/components/UI/Row";
import Column from "../../../../../src/components/UI/Column";
import Join from "../../../../../src/components/join/Join";
import Tokens from "../../../../../src/components/join/Tokens";
import { useContext } from "react";
import { PoolDataContext } from "../../../../../src/contexts/PoolData";
import BackButton from "../../../../../src/components/UI/BackButton";
import capitalise from "../../../../../src/utils/capitalise";
import { Web3Context } from "../../../../../src/contexts/Web3";
import Disclaimer from "../../../../../src/components/UI/Disclaimer";
import withGeoBlock from "../../../../../src/components/UI/GeoBlock";
import useRequireAccount from "../../../../../src/hooks/pools/useRequireAccount";
import ExternalPriceSafetyCheck from "../../../../../src/components/join/ExternalPriceSafetyCheck";
import POOLS_DISCLAIMER from "../../../../../src/constants/disclaimer/pools";
import SUBGRAPH_ERROR_DISCLAIMER from "../../../../../src/constants/disclaimer/subgraph-error";
import { UserShareContext } from "../../../../../src/contexts/UserShare";

const JoinPage: NextPage = () => {
  const { data } = useContext(PoolDataContext);
  const { selectedNetworkConfig } = useContext(Web3Context);
  const { subgraphOutOfSync } = useContext(UserShareContext);

  useRequireAccount();

  return (
    <>
      <Head>
        <title>Join | Gyroscope</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BodyContainer>
        <Header>
          <h3>
            {capitalise(selectedNetworkConfig.chainName)} Pools <Span>/</Span>{" "}
            {data?.pool && (
              <>
                <SmallSpan>
                  {data?.pool?.tokens
                    ?.map(({ symbol }: { symbol: string }) => symbol)
                    ?.join("-")}
                </SmallSpan>{" "}
                <Span>/</Span> <SmallSpan> Join </SmallSpan>
              </>
            )}
          </h3>
        </Header>
        <Disclaimer input={POOLS_DISCLAIMER} />
        {subgraphOutOfSync && (
          <Disclaimer input={SUBGRAPH_ERROR_DISCLAIMER} noClose />
        )}
        <BackButton />

        <Row>
          <Column flex="3" margin="0 10px 0 0">
            <Tokens />
          </Column>
          <Column flex="2" margin="0 0 0 10px ">
            <ExternalPriceSafetyCheck />
            <Join />
          </Column>
        </Row>
      </BodyContainer>
    </>
  );
};

const BodyContainer = styled.div`
  padding: 0 50px 50px;
`;

const Header = styled.div`
  align-items: flex-end;
  display: flex;
  padding-top: 40px;
  width: 100%;

  h3 {
    margin: 0;
  }
`;

const Span = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
`;

const SmallSpan = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
  font-size: 24px;
`;

export default withGeoBlock(JoinPage);
