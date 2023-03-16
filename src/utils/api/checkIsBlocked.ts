import { CLOUD_FUNCTIONS_BASE_URL } from "../../constants/misc";
import { WithGeoBlockOptionsType } from "../../components/UI/GeoBlock";

async function checkIsBlocked(ip: string, options: WithGeoBlockOptionsType) {
  const res = await fetch(CLOUD_FUNCTIONS_BASE_URL + "isBlocked", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip, ...options }),
  });

  return res.status !== 200;
}

export default checkIsBlocked;
