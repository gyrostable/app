import type { NextPage } from "next";
import styled from "styled-components";
import Head from "next/head";
import { useContext } from "react";
import { PAMMContext } from "../src/contexts/PAMM";
import PAMM from "../src/components/PAMM";
import withGeoBlock from "../src/components/UI/GeoBlock";
import { Web3Context } from "../src/contexts/Web3";
import Button from "../src/components/UI/Button";
import { Chains, chainsConfig } from "../src/constants/chains";
import useSwitchNetwork from "../src/hooks/useSwitchNetwork";

const PAMMPage: NextPage = () => {
  const { mintOrRedeem, stablecoinSymbol } = useContext(PAMMContext);

  return (
    <>
      <Head>
        <title>DSM | Gyroscope</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BodyContainer>
        <Header>
          <h3>
            {stablecoinSymbol} DSM <Span>/</Span>{" "}
            <SmallSpan>{mintOrRedeem === "mint" ? "Mint" : "Redeem"}</SmallSpan>
          </h3>
        </Header>
        <PAMM />
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

const Span = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
`;

const SmallSpan = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
  font-size: 24px;
`;

const WrongNetworkContainer = styled.div`
  align-items: center;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const SwitchButtonContainer = styled.div`
  margin: 20px;
  width: 300px;
`;

const WrappedPAMMPage = () => {
  const { selectedNetworkConfig } = useContext(Web3Context);
  const { switchNetwork } = useSwitchNetwork();

  return selectedNetworkConfig.name === "polygon" ? (
    <PAMMPage />
  ) : (
    <WrongNetworkContainer>
      <p>The Gyroscope stablecoin is currently unavailable on this network</p>
      <SwitchButtonContainer>
        <Button
          onClick={async () => {
            switchNetwork(chainsConfig[Chains.polygon]);
          }}
        >
          Switch to Polygon
        </Button>
      </SwitchButtonContainer>
    </WrongNetworkContainer>
  );
};

export default withGeoBlock(WrappedPAMMPage, { isDSM: true });
