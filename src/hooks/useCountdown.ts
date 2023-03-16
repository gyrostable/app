import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import moment from "moment";

const useCountDown = (endTime?: BigNumber) => {
  const [timeStatement, setTimeStatement] = useState("");

  useEffect(() => {
    setInterval(() => {
      let unitDecided = false;

      if (!endTime) return;
      for (let [timeType, timeFormat] of [
        ["year", "YYYY"],
        ["month", "M"],
        ["day", "D"],
        ["hour", "HH"],
        ["minute", "mm"],
        ["second", "s"],
      ]) {
        if (
          moment().format(timeFormat) !==
            moment(endTime.toNumber() * 1000).format(timeFormat) &&
          !unitDecided
        ) {
          const diff =
            Number(moment(endTime.toNumber() * 1000).format(timeFormat)) -
            Number(moment().format(timeFormat));

          setTimeStatement(`in ${diff} ${timeType}${diff > 1 ? "s" : ""}`);
          unitDecided = true;
        }
      }
    }, 1000);
  }, []);

  return timeStatement;
};

export default useCountDown;
