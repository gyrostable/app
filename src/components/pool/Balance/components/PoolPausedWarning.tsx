import styled from "styled-components";
import { useContext } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { PoolDataContext } from "../../../../contexts/PoolData";
import useCountDown from "../../../../hooks/useCountdown";
import Row from "../../../UI/Row";

const PoolPausedWarning = () => {
  const { pauseData } = useContext(PoolDataContext);

  const timeStatement = useCountDown(pauseData?.pauseWindowEndTime);
  return pauseData?.paused ? (
    <WarningContainer>
      <Row alignItems="center" justifyContent="center">
        <AiOutlineWarning size="18" style={{ marginRight: "5px" }} />
        <h5>Pool has been paused</h5>
      </Row>

      <p>Trading and joins are not allowed but exits are still possible.</p>
      {timeStatement && <p>Pause ending {timeStatement}.</p>}
    </WarningContainer>
  ) : null;
};

export default PoolPausedWarning;

const WarningContainer = styled.div`
  align-items: left;
  background: ${({ theme }) => theme.colors.warning};
  border-radius: 8px;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;

  p {
    margin: 0;
  }
`;
