import styled from "styled-components";
import { useContext } from "react";
import MintRedeemSwitch from "./components/MintRedeemSwitch";
import MintGyro from "./components/MintGyro";
import { PAMMContext } from "../../contexts/PAMM";
import RedeemGyro from "./components/RedeemGyro";
import ActionButton from "./components/ActionButton";
import BackButton from "../UI/BackButton";
import ErrorBox from "./components/ErrorBox";
import Column from "../UI/Column";
import Row from "../UI/Row";
import PAMMCappedWarning from "./components/PAMMCappedWarning";
import Disclaimer from "../UI/Disclaimer";
import PAMMStats from "./components/PAMMStats";
import GyroReserveWarning from "./components/GyroReserveWarning";
import GYDBalance from "./components/GYDBalance";
import AdvancedStats from "./components/AdvancedStats";
import DSM_DISCLAIMER from "../../constants/disclaimer/dsm";
import ExternalPricesWarning from "./components/ExternalPricesWarning";

const PAMM = () => {
  const { mintOrRedeem, redeemStage, setRedeemStage } = useContext(PAMMContext);

  return (
    <>
      <Disclaimer input={DSM_DISCLAIMER} />
      <Row justifyContent="center" gap="20px" alignItems="flex-start">
        <Column>
          <ExternalPricesWarning />
          <PAMMStats />
        </Column>
        <Column>
          <Container>
            {redeemStage === "slippageSelection" ? (
              <>
                <BackButton
                  onClick={() => setRedeemStage("tokenSelection")}
                  light
                />
                <Title>Redeem Gyro Dollars</Title>
              </>
            ) : (
              <MintRedeemSwitch />
            )}
            {mintOrRedeem === "mint" ? <MintGyro /> : <RedeemGyro />}
            <ActionButton />
          </Container>
          <ErrorBox />
        </Column>
        <Column maxWidth="340px">
          <GYDBalance />
          <PAMMCappedWarning />
          <GyroReserveWarning />
          <AdvancedStats />
        </Column>
      </Row>
    </>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 20px auto 20px;
  padding: 24px;
  position: relative;
  width: 500px;
`;

const Title = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export default PAMM;
