import styled from "styled-components";
import { useContext } from "react";
import { formatFixed } from "@ethersproject/bignumber";
import { PoolDataContext } from "../../../../contexts/PoolData";
import { UserShareContext } from "../../../../contexts/UserShare";
import { Web3Context } from "../../../../contexts/Web3";
import { ONE, ZERO } from "../../../../constants/misc";
import Row from "../../../UI/Row";
import { AiOutlineWarning } from "react-icons/ai";
import formatBigNumberString from "../../../../utils/formatBigNumberString";

const PoolCappedWarning = () => {
  const {
    pauseData,
    poolCapData,
    totalShares,
    valuePerShare,
    globalCapValueExceeded,
  } = useContext(PoolDataContext);
  const { userShareBalance } = useContext(UserShareContext);
  const { account } = useContext(Web3Context);

  const totalPercToCap =
    (poolCapData.capEnabled &&
      poolCapData.globalCap &&
      totalShares.mul(100).div(poolCapData.globalCap)) ??
    ZERO;

  const userPercToCap =
    (poolCapData.capEnabled &&
      poolCapData.perAddressCap &&
      userShareBalance.mul(100).div(poolCapData.perAddressCap)) ??
    ZERO;

  return !pauseData?.paused && poolCapData.capEnabled ? (
    <WarningContainer>
      <Row alignItems="center" justifyContent="center">
        <AiOutlineWarning size="18" style={{ marginRight: "5px" }} />
        <h5>Pool is capped</h5>
      </Row>
      <p>
        Pool is at {globalCapValueExceeded ? "100" : totalPercToCap.toString()}%
        of global cap.
      </p>
      {account && (
        <p>User is at {userPercToCap.toString()}% of per address cap.</p>
      )}
      {poolCapData.globalCap && (
        <p>
          Pool cap is{" "}
          {formatBigNumberString(formatFixed(poolCapData.globalCap, 18), 0)} LP
          shares which is currently worth $
          {formatBigNumberString(
            formatFixed(valuePerShare.mul(poolCapData.globalCap).div(ONE), 18),
            2,
            2
          )}
          .
        </p>
      )}
    </WarningContainer>
  ) : null;
};

export default PoolCappedWarning;

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
