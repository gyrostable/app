import Link from "next/link";
import { useContext } from "react";
import styled from "styled-components";
import { PoolDataContext } from "../../../../contexts/PoolData";
import useQueryParam from "../../../../hooks/useQueryParam";
import Column from "../../../UI/Column";
import Row from "../../../UI/Row";

const JoinExitButtons = () => {
  const poolAddress = useQueryParam("poolAddress");
  const chainName = useQueryParam("chainName");
  const poolType = useQueryParam("poolType");

  const { loading, pauseData, globalCapValueExceeded } =
    useContext(PoolDataContext);

  return (
    <Column gap="20px">
      <Row justifyContent="space-between">
        {loading || pauseData?.paused || globalCapValueExceeded ? (
          <Button left inverted disabled>
            JOIN
          </Button>
        ) : (
          <Link href={`/pools/${chainName}/${poolType}/${poolAddress}/join`}>
            <Button id="join-pool-button" left inverted>
              JOIN
            </Button>
          </Link>
        )}
        {loading ? (
          <Button id="exit-pool-button" disabled>
            EXIT
          </Button>
        ) : (
          <Link href={`/pools/${chainName}/${poolType}/${poolAddress}/exit`}>
            <Button id="exit-pool-button">EXIT</Button>
          </Link>
        )}
      </Row>
    </Column>
  );
};

export default JoinExitButtons;

const Button = styled.div<{
  inverted?: boolean;
  left?: boolean;
  disabled?: boolean;
}>`
  align-items: center;
  background: ${({ theme, inverted, disabled }) =>
    disabled
      ? theme.colors.highlightDark
      : inverted
      ? theme.colors.white
      : theme.colors.highlight};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highlightLight};
  color: ${({ theme, inverted, disabled }) =>
    inverted || disabled ? theme.colors.highlight : theme.colors.white};
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  display: flex;
  height: 60px;
  justify-content: center;
  margin-right: ${({ left }) => (left ? "5px" : "")};
  margin-left: ${({ left }) => (left ? "" : "5px")};
  width: 155px;
`;
