import { CLOUD_FUNCTIONS_BASE_URL } from "../../constants/misc";

async function storeAcceptance(ip: string, address: string) {
  fetch(CLOUD_FUNCTIONS_BASE_URL + "acceptTerms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip, address }),
  });
}

export default storeAcceptance;
