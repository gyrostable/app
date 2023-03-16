import { ethers } from "ethers";

export const ONE = ethers.constants.WeiPerEther;
export const ZERO = ethers.constants.Zero;
export const MAX_UINT_256 = ethers.constants.MaxUint256;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const DEFAULT_CHAIN_ID = 1;
export const SUBGRAPH_KOVAN =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan-v2-beta";
export const SUBGRAPH_MAINNET =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2";
export const SUBGRAPH_POLYGON =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2-beta";
export const SUBGRAPH_GOERLI =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-goerli-v2";

export const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3/";

export const BLOCKED_REGION_MESSAGE =
  "This Gyroscope user interface is only supported in some jurisdictions, as outlined in the Terms of Service.";
export const BLOCKED_USER_MESSAGE =
  "The connected account has been sanctioned and restricted.";
export const BLOCKED_DEVICE_MESSAGE =
  "The Gyroscope User Interface is currently not available on mobile or tablet.";
export const REACT_ERROR_MESSAGE =
  "Something went wrong! Please try refreshing the page.";

export const CONNECT_WALLET_MESSAGE =
  "To continue using the Gyroscope User Interface, please connect your Web3 wallet.";

export const MAX_AMOUNT_BUFFER = 100000; // Required to prevent Max amount join errors

export const CLOUD_FUNCTIONS_BASE_URL =
  "https://europe-west2-gyroscope-ui.cloudfunctions.net/";

export const MIN_THRESHOLD_GYRO_RESERVE_RATIO = 0.999;

export const GAS_MULTIPLIER = 1.5;

export const SUM_OF_WEIGHTS_TOLERANCE = 10;

export const ATTEMPT_MULTIPLIER = 0.9999;

export const ALLOWED_NUMERIC_CHARACTERS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
];

export const NEW_POOL_IDS = [
  "0xdac42eeb17758daa38caf9a3540c808247527ae3000200000000000000000a2b",
];

export const MISC_ERRORS = ["Minified React Error", "Script Error"];

export const FAILED_WEB3_REQUEST_LIMIT = 3;
