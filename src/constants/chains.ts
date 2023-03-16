import {
  DEFAULT_CHAIN_ID,
  SUBGRAPH_KOVAN,
  SUBGRAPH_MAINNET,
  SUBGRAPH_POLYGON,
  SUBGRAPH_GOERLI,
} from "./misc";

export const Chains = {
  localhost: 1337,
  mainnet: 1,
  kovan: 42,
  polygon: 137,
  goerli: 5,
} as const;

export type ChainsValue = typeof Chains[keyof typeof Chains];
export type ChainsKey = keyof typeof Chains;

export type ChainConfig = {
  chainId: ChainsValue;
  name: string;
  chainName: string;
  subgraphApi: string;
  isDev: boolean;
  supported: boolean;
  coingeckoId: string;
  rpcUrl?: string;
  nativeCurrency?: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  blockExplorerUrls?: string;
  icon?: string;
  averageSecondsPerBlock: number;
  metamaskRPC?: string;
};

// Default chain id from env var
export const INITIAL_APP_CHAIN_ID = Number(DEFAULT_CHAIN_ID) as ChainsValue;

export const chainsConfig: Record<ChainsValue, ChainConfig> = {
  [Chains.localhost]: {
    chainId: Chains.localhost,
    name: "localhost",
    chainName: "Localhost",
    subgraphApi: SUBGRAPH_MAINNET,
    isDev: true,
    supported: true,
    icon: "ethereum",
    coingeckoId: "ethereum",
    averageSecondsPerBlock: 15,
    rpcUrl: "http://127.0.0.1:9545",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH", // 2-6 characters long
      decimals: 18,
    },
    blockExplorerUrls: "https://etherscan.io/",
  },
  [Chains.mainnet]: {
    chainId: Chains.mainnet,
    name: "ethereum",
    subgraphApi: SUBGRAPH_MAINNET,
    isDev: false,
    supported: true,
    icon: "ethereum",
    chainName: "Ethereum",
    rpcUrl:
      // "https://eth-mainnet.g.alchemy.com/v2/8jQtnNfSKiO2Cke9fHGbwo5Hc9S9O8wc",
      "https://eth-mainnet.g.alchemy.com/v2/t0aumdpjEYRonvcR7PFZhD8TJGjoTil9",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH", // 2-6 characters long
      decimals: 18,
    },
    blockExplorerUrls: "https://etherscan.io/",
    coingeckoId: "ethereum",
    averageSecondsPerBlock: 13.5,
    metamaskRPC:
      "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  [Chains.polygon]: {
    chainId: Chains.polygon,
    name: "polygon",
    subgraphApi: SUBGRAPH_POLYGON,
    isDev: false,
    supported: true,
    icon: "polygon",
    chainName: "Polygon",
    rpcUrl:
      "https://polygon-mainnet.g.alchemy.com/v2/1XASB8W08knvap5YS91I7ZgSSuWY072s",
    // "https://polygon-mainnet.g.alchemy.com/v2/5RhbxHGv1PCMTnG9iZRQ9T7tzYIuy1eS",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC", // 2-6 characters long
      decimals: 18,
    },
    blockExplorerUrls: "https://polygonscan.com/",
    coingeckoId: "polygon-pos",
    averageSecondsPerBlock: 2.3,
    metamaskRPC: "https://polygon-rpc.com",
  },
  [Chains.kovan]: {
    chainId: Chains.kovan,
    name: "kovan",
    subgraphApi: SUBGRAPH_KOVAN,
    isDev: true,
    supported: true,
    icon: "ethereum",
    chainName: "Kovan Testnet",
    rpcUrl: "https://kovan.infura.io/v3/ef843aa2b4a94679aa559fae038cb07b",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH", // 2-6 characters long
      decimals: 18,
    },
    blockExplorerUrls: "https://kovan.etherscan.io/",
    coingeckoId: "ethereum",
    averageSecondsPerBlock: 4,
  },
  [Chains.goerli]: {
    chainId: Chains.goerli,
    name: "goerli",
    subgraphApi: SUBGRAPH_GOERLI,
    isDev: true,
    supported: true,
    icon: "ethereum",
    chainName: "Goerli Testnet",
    rpcUrl: "https://goerli.infura.io/v3/271565b761a04498968a9463e41f494e",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH", // 2-6 characters long
      decimals: 18,
    },
    blockExplorerUrls: "https://goerli.etherscan.io/",
    coingeckoId: "ethereum",
    averageSecondsPerBlock: 4,
  },
};

export const ALLOWED_CHAINS = Object.values(chainsConfig)
  .filter(({ supported }) => supported)
  .filter(({ isDev }) => process.env.NODE_ENV === "development" || !isDev);

export function getNetworkConfig(
  chainId: ChainsValue
): ChainConfig | undefined {
  const networkConfig = chainsConfig[chainId as ChainsValue] ?? undefined;

  if (chainId === undefined) {
    console.warn(`No config for unsupported chainId: ${chainId}`);
  }
  return networkConfig;
}

export const isValidChain = (chain: any) => {
  const chainConfig = getNetworkConfig(chain);
  return chainConfig ? chainConfig.supported : false;
};

export const VALID_DSM_CHAIN_IDS = [137];
