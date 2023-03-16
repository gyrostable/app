import styled from "styled-components";
import { AiOutlineWarning } from "react-icons/ai";
import Row from "../../UI/Row";
import { useContext } from "react";
import { formatFixed } from "@ethersproject/bignumber";
import { PAMMContext } from "../../../contexts/PAMM";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import { ZERO, ONE } from "../../../constants/misc";
import { MIN_THRESHOLD_GYRO_RESERVE_RATIO } from "../../../constants/misc";

const GyroReserveWarning = () => {
  const { reserveState, gydTokenData } = useContext(PAMMContext);

  const reserveRatio = formatBigNumberString(
    formatFixed(
      gydTokenData?.totalSupply && reserveState?.totalUSDValue
        ? reserveState.totalUSDValue.mul(ONE).div(gydTokenData.totalSupply)
        : ZERO,
      18
    ),
    6,
    6
  );

  const isReserveUnderCollateralized =
    Number(reserveRatio) > 0 &&
    Number(reserveRatio) < MIN_THRESHOLD_GYRO_RESERVE_RATIO;

  return isReserveUnderCollateralized ? (
    <Container>
      <Row alignItems="center" justifyContent="center" height="35px">
        <AiOutlineWarning size="32" style={{ marginRight: "5px" }} />
      </Row>
      <p>
        In order to test in a variety of settings, Gyro Proto is calibrated so
        that the reserve ratio may vary over time. More information on Gyro
        Proto design and risks can be found{" "}
        <a
          href="https://docs.gyro.finance/gyro-proto/gyro-proto#risks-of-using-gyro-proto"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </p>
    </Container>
  ) : null;
};

export default GyroReserveWarning;

const Container = styled.div`
  align-items: left;
  background: ${({ theme }) => theme.colors.warning};
  border-radius: 8px;
  box-sizing: border-box;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  margin-top: 22px;
  padding: 20px;
  width: 340px;

  p {
    margin: 0;
  }

  a {
    text-decoration: underline;
  }
`;
