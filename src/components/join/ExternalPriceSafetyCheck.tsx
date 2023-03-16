import styled from "styled-components";
import { useContext, useEffect } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import Row from "../UI/Row";
import { WalletContext } from "../../contexts/Wallet";
import { PoolDataContext } from "../../contexts/PoolData";
import { ONE } from "../../constants/misc";
import calculateSpotPrice, {
  destructureRequiredPoolParams,
} from "../../utils/pools/calculateSpotPrice";
import { GyroPoolTypes } from "../../../types/pool";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import { mulDown } from "../../utils/sor/gyroHelpers/gyroSignedFixedPoint";
import logPriceDeviation from "../../utils/api/logPriceDeviation";
import { Web3Context } from "../../contexts/Web3";

const ALLOWED_DEVIATION_FACTOR = 10;

let once = false;

const ExternalPriceSafetyCheck = ({ exit }: { exit?: boolean }) => {
  const { data: walletData } = useContext(WalletContext);
  const { data: poolData } = useContext(PoolDataContext);
  const { selectedNetworkConfig } = useContext(Web3Context);

  const externalSpotPrice =
    walletData && walletData[0]?.price && walletData[1]?.price
      ? walletData[1].price.mul(ONE).div(walletData[0].price)
      : null;

  const params = poolData?.pool
    ? destructureRequiredPoolParams(poolData.pool)
    : null;

  const poolSpotPrice = params
    ? calculateSpotPrice(poolData?.pool?.poolType as GyroPoolTypes, params)
    : null;

  const swapFee = parseFixed(poolData?.pool?.swapFee ?? "1", 18);

  const warningMessage = exit
    ? "The current pool spot price significantly deviates from the Coingecko price. A transaction to exit in this setting might not go through if an arbitrage trade is processed earlier. This would cause the user to spend more in gas fees. It is suggested to wait until the pool is more balanced vs. external prices."
    : "The current pool spot price significantly deviates from the Coingecko price. Joining the pool in this setting may lead to loss of value. It is suggested to wait until the pool is more balanced vs. external prices.";

  const outsideAllowedDeviation =
    externalSpotPrice &&
    poolSpotPrice &&
    (externalSpotPrice.gt(
      mulDown(poolSpotPrice, ONE.add(swapFee.mul(ALLOWED_DEVIATION_FACTOR)))
    ) ||
      externalSpotPrice.lt(
        mulDown(poolSpotPrice, ONE.sub(swapFee.mul(ALLOWED_DEVIATION_FACTOR)))
      ));

  useEffect(() => {
    if (!once && outsideAllowedDeviation && poolData && selectedNetworkConfig) {
      logPriceDeviation({
        poolId: poolData.pool?.id as string,
        poolSpotPrice: formatFixed(poolSpotPrice, 18),
        swapFee: formatFixed(swapFee, 18),
        externalPrice: formatFixed(externalSpotPrice, 18),
        network: selectedNetworkConfig.chainName,
        poolPair: walletData[1].symbol + "/" + walletData[0].symbol,
      });
      once = true;
    }
  }, [outsideAllowedDeviation]);

  return outsideAllowedDeviation ? (
    <Container>
      <Row>
        <AiOutlineWarning fontSize="20px" style={{ marginRight: "10px" }} />
        <b>WARNING</b>
      </Row>
      <Row margin="10px 0 0">{warningMessage}</Row>
    </Container>
  ) : null;
};

export default ExternalPriceSafetyCheck;

const Container = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.warning};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  margin-bottom: 20px;
`;
