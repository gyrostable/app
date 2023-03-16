import type { NextPage } from "next";
import { useContext } from "react";
import styled from "styled-components";
import Head from "next/head";
import Row from "../../../../../src/components/UI/Row";
import Column from "../../../../../src/components/UI/Column";
import PoolStats from "../../../../../src/components/pool/PoolStats";
import JoinsAndExits from "../../../../../src/components/pool/JoinsAndExits";
import Balance from "../../../../../src/components/pool/Balance";
import { PoolDataContext } from "../../../../../src/contexts/PoolData";
import BackButton from "../../../../../src/components/UI/BackButton";
import { Web3Context } from "../../../../../src/contexts/Web3";
import capitalise from "../../../../../src/utils/capitalise";
import Disclaimer from "../../../../../src/components/UI/Disclaimer";
import POOLS_DISCLAIMER from "../../../../../src/constants/disclaimer/pools";
import SUBGRAPH_ERROR_DISCLAIMER from "../../../../../src/constants/disclaimer/subgraph-error";
import { UserShareContext } from "../../../../../src/contexts/UserShare";

const PoolPage: NextPage = () => {
  const { data } = useContext(PoolDataContext);
  const { selectedNetworkConfig } = useContext(Web3Context);
  const { subgraphOutOfSync } = useContext(UserShareContext);

  return (
    <>
      <Head>
        <title>Pool | Gyroscope</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BodyContainer>
        <Header>
          <h3>
            {capitalise(selectedNetworkConfig.chainName)} Pools <Span>/</Span>{" "}
            <SmallSpan>
              {data?.pool?.tokens
                ?.map(({ symbol }: { symbol: string }) => symbol)
                ?.join("-")}
            </SmallSpan>
          </h3>
        </Header>
        <Disclaimer input={POOLS_DISCLAIMER} />
        {subgraphOutOfSync && (
          <Disclaimer input={SUBGRAPH_ERROR_DISCLAIMER} noClose />
        )}
        <BackButton />
        <Row>
          <Column flex="5" margin="0 10px 0 0">
            <PoolStats />
            <JoinsAndExits />
          </Column>
          <Column flex="2" margin="0 0 0 10px">
            <Balance />
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

export default PoolPage;
