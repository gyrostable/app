import Column from "../../UI/Column";
import SwapFees from "./components/SwapFees";
import Chart from "./components/Chart";
import StatsRow from "./components/StatsRow";
import Composition from "./components/Composition";

const PoolStats = () => {
  return (
    <Column>
      <SwapFees />
      {/* <Chart /> */}
      <StatsRow />
      <Composition />
    </Column>
  );
};

export default PoolStats;
