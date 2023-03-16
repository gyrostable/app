import { useContext, useEffect } from "react";
import { useRollbar } from "@rollbar/react";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import { formatFixed } from "@ethersproject/bignumber";
import styled from "styled-components";
import { PAMMContext } from "../../../contexts/PAMM";
import { ONE, ZERO } from "../../../constants/misc";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import LoadingAnimation from "../../UI/LoadingAnimation";
import Column from "../../UI/Column";
import accumulateFetchStatus from "../../../utils/accumulateFetchStatus";
import Row from "../../UI/Row";
import theme from "../../../styles/theme";
import { Web3Context } from "../../../contexts/Web3";
import destructureBlockExplorer from "../../../utils/destructureBlockExplorer";
import { contracts } from "../../../constants/contracts";
import { MIN_THRESHOLD_GYRO_RESERVE_RATIO } from "../../../constants/misc";
import { DataTypes } from "../../../../types/typechain/ReserveManager";
import { BackupDataType } from "../../../hooks/dsm/useReserveState";
import { WalletTokenDataType } from "../../../contexts/Wallet/Context";

const PAMMStats = () => {
  const { selectedNetworkConfig } = useContext(Web3Context);

  const {
    stablecoinSymbol,
    reserveState,
    gydTokenData,
    fetchReserveStateStatus,
    fetchGYDDataStatus,
    underlierTokens,
    backupData,
  } = useContext(PAMMContext);

  const totalUSDValue = backupData
    ? backupData.totalUSDValue
    : reserveState?.totalUSDValue;

  const totalSupply = backupData
    ? backupData.gydTotalSupply
    : gydTokenData?.totalSupply;

  const gydTotalSupply = formatBigNumberString(
    formatFixed(totalSupply ?? ZERO, 18),
    2,
    2
  );

  const reserveRatio = formatBigNumberString(
    formatFixed(
      totalUSDValue && totalSupply
        ? totalUSDValue.mul(ONE).div(totalSupply)
        : ZERO,
      18
    ),
    4,
    4
  );

  const redemptionPrice = backupData
    ? backupData.redemptionPrice
    : gydTokenData?.price;

  const fetchStatus = accumulateFetchStatus(
    fetchReserveStateStatus,
    fetchGYDDataStatus
  );

  const rollbar = useRollbar();

  const isReserveUnderCollateralized =
    Number(reserveRatio) > 0 &&
    Number(reserveRatio) < MIN_THRESHOLD_GYRO_RESERVE_RATIO;

  useEffect(() => {
    if (isReserveUnderCollateralized) {
      rollbar.critical(
        `Gyro reserve ratio at ${reserveRatio} below threshold value ${MIN_THRESHOLD_GYRO_RESERVE_RATIO} `
      );
    }
  }, [reserveRatio]);

  const vaultInfo = calculateVaultInfo(
    reserveState,
    backupData,
    underlierTokens
  );

  return {
    fetching: (
      <Container>
        <LoadingContainer>
          <LoadingAnimation size={50} />
        </LoadingContainer>
      </Container>
    ),
    success: (
      <Container>
        <Stat>{gydTotalSupply}</Stat>
        <Label>{stablecoinSymbol} supply</Label>
        <Spacer />

        <Stat>{reserveRatio}</Stat>
        <Label>Current reserve ratio</Label>
        <Spacer />

        <Stat>
          {formatBigNumberString(
            formatFixed(redemptionPrice ?? ZERO, 18),
            4,
            4
          )}
        </Stat>
        <Label>Redemption spot price (approximate)</Label>
        <Spacer />

        <Subtitle>
          Gyro {stablecoinSymbol === "p-GYD" ? "Proto" : ""} Reserve
        </Subtitle>
        <Column>
          {vaultInfo.map(
            (
              { value, symbol, underlying, currentWeight, idealWeight },
              index
            ) => {
              const poolTypeLink = symbol.split("-")[0];
              const formattedPoolTypeLink =
                poolTypeLink &&
                (
                  poolTypeLink[0] +
                  "-" +
                  poolTypeLink.slice(1, poolTypeLink.length)
                ).toLowerCase();

              const link =
                formattedPoolTypeLink &&
                [
                  "pools",
                  selectedNetworkConfig.name,
                  formattedPoolTypeLink,
                  underlying,
                ].join("/");

              return (
                <ReserveValueContainer key={index}>
                  <Label>
                    ${formatBigNumberString(formatFixed(value, 18), 2, 2)}
                  </Label>
                  <Row alignItems="center" gap="6px">
                    <Label>{symbol.replace("-", "  ")}</Label>
                    {symbol.includes("CLP") && link && (
                      <Link href={link}>
                        <div>
                          <BsArrowUpRight
                            color={theme.colors.white}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </Link>
                    )}
                  </Row>
                  {currentWeight && (
                    <Label>
                      Current Weight:{" "}
                      {(
                        Math.round(Number(formatFixed(currentWeight, 15))) / 10
                      ).toFixed(1) + " %"}
                    </Label>
                  )}

                  {idealWeight && (
                    <Label>
                      Target Weight:{" "}
                      {(
                        Math.round(Number(formatFixed(idealWeight, 15))) / 10
                      ).toFixed(1) + " %"}
                    </Label>
                  )}
                </ReserveValueContainer>
              );
            }
          )}
          <a
            href={
              selectedNetworkConfig.blockExplorerUrls +
              "address/" +
              contracts["MOTHERBOARD"].address[selectedNetworkConfig.chainId]
            }
            target="_blank"
            rel="noreferrer"
          >
            <ContractLink>
              View motherboard on{" "}
              {destructureBlockExplorer(
                selectedNetworkConfig.blockExplorerUrls
              )}
            </ContractLink>
          </a>
        </Column>
      </Container>
    ),
    failed: <div style={{ width: "340px" }} />,
  }[fetchStatus];
};

export default PAMMStats;

const Container = styled.div`
  align-items: left;
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 8px;
  box-sizing: border-box;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  margin-top: 22px;
  padding: 20px;
  position: relative;
  width: 340px;
`;

const Stat = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  height: 40px;
  margin: 0;
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

const Spacer = styled.div`
  height: 10px;
`;

const ReserveValueContainer = styled.div`
  box-sizing: border-box;
  margin-bottom: 20px;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: 200px;
  justify-content: center;
`;

const ContractLink = styled.p`
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  text-decoration: underline;
`;

function calculateVaultInfo(
  reserveState: DataTypes.ReserveStateStructOutput | null,
  backupData: BackupDataType | null,
  underlierTokens: WalletTokenDataType[]
) {
  if (backupData) {
    return backupData.vaultsWithValues.map((el) => {
      const currentWeight = el.value.mul(ONE).div(backupData.totalUSDValue);
      return { ...el, currentWeight, idealWeight: null };
    });
  }

  if (reserveState) {
    return reserveState.vaults.map((el, index) => {
      const value = el.price.mul(el.reserveBalance).div(ONE);
      const symbol = underlierTokens[index].symbol;
      return { ...el, value, symbol };
    });
  }

  return [];
}
