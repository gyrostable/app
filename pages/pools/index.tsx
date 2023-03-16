import type { NextPage } from "next";
import { useContext } from "react";
import styled from "styled-components";
import Spacer from "../../src/components/UI/Spacer";
// import PoolFilter from "../src/components/pool/PoolFilter";
import Table from "../../src/components/UI/Table";
import { Web3Context } from "../../src/contexts/Web3";
import capitalise from "../../src/utils/capitalise";
import Disclaimer from "../../src/components/UI/Disclaimer";
import Head from "next/head";
import POOLS_DISCLAIMER from "../../src/constants/disclaimer/pools";
import { AllPoolsDataProvider } from "../../src/contexts/AllPoolsData";

const PoolsPage: NextPage = () => {
  const { selectedNetworkConfig } = useContext(Web3Context);

  return (
    <>
      <Head>
        <title>Pools | Gyroscope</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BodyContainer>
        <Header>
          <h3>{capitalise(selectedNetworkConfig.chainName)} Pools</h3>
          <Spacer />
          {/* <PoolFilter /> TODO - complete this pool filter*/}
        </Header>
        <Disclaimer input={POOLS_DISCLAIMER} />
        <Table />
      </BodyContainer>
    </>
  );
};

const Header = styled.div`
  align-items: flex-end;
  box-sizing: border-box;
  display: flex;
  padding-top: 40px;
  width: 100%;

  h3 {
    margin: 0;
  }
`;

const BodyContainer = styled.div`
  padding: 0 50px;
`;

const WrappedPoolsPage = () => {
  return (
    <AllPoolsDataProvider>
      <PoolsPage />
    </AllPoolsDataProvider>
  );
};

export default WrappedPoolsPage;
