import { CLOUD_FUNCTIONS_BASE_URL } from "../../constants/misc";

interface PriceDeviationPayload {
  poolId: string;
  poolPair: string;
  poolSpotPrice: string;
  externalPrice: string;
  swapFee: string;
  network: string;
}

async function logPriceDeviation(payload: PriceDeviationPayload) {
  fetch(CLOUD_FUNCTIONS_BASE_URL + "logPriceDeviations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, timestamp: Date.now() }),
  });
}

export default logPriceDeviation;
