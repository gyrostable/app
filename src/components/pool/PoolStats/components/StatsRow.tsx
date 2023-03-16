import { useContext } from "react";
import styled from "styled-components";
import { PoolDataContext } from "../../../../contexts/PoolData";
import Row from "../../../UI/Row";
import Loading from "../../../UI/Loading";
import { formatFixed } from "@ethersproject/bignumber";
import formatBigNumberString from "../../../../utils/formatBigNumberString";
// import { Pool } from "../../../../../types/subgraph/__generated__/Pool";
// import { ZERO } from "../../../../constants/misc";

const StatsRow = () => {
  const { loading, totalValue, data } = useContext(PoolDataContext);

  // const { swapFee24Hours, swapVolume24Hours } = calculate24HourValues(data);

  return (
    <Row margin="0 0 24px 0">
      <StatContainer>
        <h6>Pool Value</h6>
        {loading ? (
          <Loading height="34px" width="200px" margin="24px 0 0 0" />
        ) : (
          <h5>
            {totalValue
              ? "$ " + formatBigNumberString(formatFixed(totalValue, 18), 2, 2)
              : "-"}
          </h5>
        )}
      </StatContainer>
      <Spacer />
      <StatContainer>
        <h6>Volume (Total)</h6>
        {loading ? (
          <Loading height="34px" width="200px" margin="24px 0 0 0" />
        ) : (
          <h5>
            $ {formatBigNumberString(data?.pool?.totalSwapVolume || "0", 2, 2)}
          </h5>
        )}
      </StatContainer>
      <Spacer />
      <StatContainer>
        <h6>Fees (Total)</h6>
        {loading ? (
          <Loading height="34px" width="200px" margin="24px 0 0 0" />
        ) : (
          <h5>
            $ {formatBigNumberString(data?.pool?.totalSwapFee || "0", 2, 2)}
          </h5>
        )}
      </StatContainer>
    </Row>
  );
};

export default StatsRow;

const StatContainer = styled.div`
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 12px;
  flex: 1;
  padding: 30px;

  h5,
  h6 {
    margin: 0;
  }

  h5 {
    margin-top: 24px;
    font-size: 28px;
  }
`;

const Spacer = styled.div`
  width: 24px;
`;

// Helper functions ----------------------------------------------

// function calculate24HourValues(data?: Pool) {
//   if (!data) {
//     return {
//       swapFee24Hours: ZERO,
//       swapVolume24Hours: ZERO,
//     };
//   }

//   const values = ["totalSwapFee", "totalSwapVolume"].map((key) => {
//     const oneDayAgoValue =
//       data.oneDayAgoPool && ((data.oneDayAgoPool as any)[key] as string);
//     const currentValue = data.pool && ((data.pool as any)[key] as string);

//     if (!currentValue || !oneDayAgoValue) return ZERO;

//     return safeParseFixed(currentValue, 18).sub(
//       safeParseFixed(oneDayAgoValue, 18)
//     );
//   });

//   return {
//     swapFee24Hours: values[0],
//     swapVolume24Hours: values[1],
//   };
// }
