import { BigNumber } from "@ethersproject/bignumber";
import { CLOUD_FUNCTIONS_BASE_URL } from "../../constants/misc";
import safeParseFixed from "../safeParseFixed";

const FAKE_PRICES: Record<string, string> = {
  "0x2b7c320d7b915d9d10aeb2f93f94720d4f3fff91": "12.4252",
  "0x6a7ddccff3141a337f8819fa9d0922e33c405d6f": "8.3457",
  "0x11fb9071e69628d804bf0b197cc61eeacd4aaecf": "0.03134",
  "0x4ea2110a3e277b10c9b098f61d72f58efa8655db": "35.134",
  "0x5663082e6d6addf940a38ea312b899a5ec86c2dc": "24.3131",
  "0x473226bd982822fa7024e294c706f89f024ea001": "213.232424",
  "0x69551bdc6d4368ea877d668fe92f4628ba27364f": "74.2683",
};

const LEGACY_MAPPINGS: Record<string, string> = {
  "0x9c9e5fd8bbc25984b178fdce6117defa39d2db39":
    "0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7",
};

async function fetchPrice(
  networkId: string,
  address: string
): Promise<BigNumber> {
  if (FAKE_PRICES[address])
    return safeParseFixed(String(FAKE_PRICES[address]), 18);

  if (LEGACY_MAPPINGS[address.toLowerCase()]) {
    address = LEGACY_MAPPINGS[address.toLowerCase()];
  }

  const res = await fetch(CLOUD_FUNCTIONS_BASE_URL + "getPrice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ networkId, tokenAddress: address }),
  });

  if (res.status !== 200) {
    throw new Error(
      `Not able to find price feed for asset of address: ${address} on network ${networkId}`
    );
  }
  const firebasePrice = await res.json();
  return safeParseFixed(String(firebasePrice), 18);
}

export default fetchPrice;
