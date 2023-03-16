import { formatFixed } from "@ethersproject/bignumber";
import { BigNumber } from "ethers";
import { useContext, useState } from "react";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import styled from "styled-components";
import { SystemParamsType } from "../../../../types/dsm";
import { ZERO, ONE } from "../../../constants/misc";
import { PAMMContext } from "../../../contexts/PAMM";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import LoadingAnimation from "../../UI/LoadingAnimation";
import Row from "../../UI/Row";
import accumulateFetchStatus from "../../../utils/accumulateFetchStatus";

const STATS_INFO = [
  { label: "Min reserve ratio", keyString: "thetaBar", decimals: 1 },
  {
    label: "Max underreserved redemption at peg",
    keyString: "xuBar",
    decimals: 1,
  },
  {
    label: "Min redemption price decay",
    keyString: "alphaBar",
    decimals: 1,
  },
  {
    label: "Redemption pressure decay per block",
    keyString: "outflowMemory",
    subtractFromOne: true,
    decimals: 6,
  },
];

const AdvancedStats = () => {
  const [open, setOpen] = useState(false);

  const {
    systemParams: systemParamsReserveState,
    redemptionLevel: redemptionLeveLReserveState,
    gydTokenData,
    fetchReserveStateStatus,
    fetchGYDDataStatus,
    backupData,
  } = useContext(PAMMContext);

  const redemptionLevel = backupData
    ? backupData.redemptionLevel
    : redemptionLeveLReserveState;

  const systemParams = backupData
    ? backupData.systemParams
    : systemParamsReserveState;

  const totalSupply = backupData
    ? backupData.gydTotalSupply
    : gydTokenData?.totalSupply;

  const redemptionPressure =
    totalSupply && redemptionLevel
      ? redemptionLevel.mul(ONE).div(totalSupply.add(redemptionLevel))
      : ZERO;

  const fetchStatus = accumulateFetchStatus(
    fetchReserveStateStatus,
    fetchGYDDataStatus
  );

  return fetchStatus !== "failed" ? (
    <Container open={open}>
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Subtitle>Advanced Stats</Subtitle>
        {open ? (
          <BsFillCaretUpFill color="white" />
        ) : (
          <BsFillCaretDownFill color="white" />
        )}
      </Row>
      {open &&
        (fetchStatus === "success" && systemParams ? (
          <>
            <StatRow
              label="Redemption Pressure"
              value={redemptionPressure}
              decimals={6}
            />
            <Subtitle>System Parameters</Subtitle>
            {STATS_INFO.map(
              ({ label, keyString, subtractFromOne, decimals }, index) => (
                <StatRow
                  label={label}
                  key={index}
                  systemParams={systemParams}
                  keyString={keyString}
                  subtractFromOne={subtractFromOne}
                  decimals={decimals}
                />
              )
            )}
          </>
        ) : (
          <LoadingContainer>
            <LoadingAnimation size={50} />
          </LoadingContainer>
        ))}
    </Container>
  ) : null;
};

export default AdvancedStats;

const StatRow = ({
  label,
  value,
  systemParams,
  keyString,
  subtractFromOne,
  decimals,
}: {
  label: string;
  value?: BigNumber;
  systemParams?: SystemParamsType;
  keyString?: string;
  subtractFromOne?: boolean;
  decimals?: number;
}) => {
  const valueBN = value
    ? value
    : systemParams
    ? systemParams[keyString as any]
    : ZERO;

  return (
    <Row justifyContent="space-between" margin="10px 0">
      <Label>{label}</Label>
      <Stat>
        {formatBigNumberString(
          formatFixed(subtractFromOne ? ONE.sub(valueBN ?? ZERO) : valueBN, 16),
          decimals,
          decimals
        )}
        <Percentage> %</Percentage>
      </Stat>
    </Row>
  );
};

const Container = styled.div<{ open?: boolean }>`
  align-items: left;
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 8px;
  box-sizing: border-box;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: ${({ open }) => (open ? "580px" : "65px")};
  justify-content: flex-start;
  margin-top: 22px;
  overflow-y: hidden;
  padding: 20px;
  position: relative;
  transition: all 0.5s ease-in-out;
  width: 100%;
`;

const Stat = styled.h4`
  color: ${({ theme }) => theme.colors.white};
  font-size: 28px;
  margin: auto 0;
  margin-left: 30px;
  white-space: nowrap;
`;

const Label = styled.h6`
  color: ${({ theme }) => theme.colors.white};
  margin: 0;
`;

const Subtitle = styled.h6`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  margin: 0;
`;

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: 200px;
  justify-content: center;
`;

const Percentage = styled.span`
  font-size: 18px;
`;
