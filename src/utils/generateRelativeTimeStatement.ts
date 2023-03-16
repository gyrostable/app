import moment from "moment";

function generateRelativeTimeStatement(timestamp: number) {
  const difference = Date.now() / 1000 - timestamp;

  for (let [maxDifference, timeFormat, scaleFactor] of [
    [60, "second", 1],
    [3600, "minute", 60],
    [86400, "hour", 3600],
    [2592000, "day", 86400],
    [31104000, "month", 2592000],
    [Infinity, "year", 31104000],
  ]) {
    if (difference < maxDifference) {
      const value = Math.floor(difference / (scaleFactor as number));

      return `about ${value} ${timeFormat}${value > 1 ? "s" : ""} ago`;
    }
  }
}

export default generateRelativeTimeStatement;
