import { ChainsValue } from "../chains";

export type BackUpVault = {
  vault: string;
  type: "Asset" | "E-CLP" | "3-CLP" | "2-CLP";
  symbol: string;
  underlying: string;
  unpricedTokens: { tokenAddress: string; isStable: boolean }[];
};

const RESERVE_VAULTS_BACKUP: Record<ChainsValue, BackUpVault[]> = {
  137: [
    {
      vault: "0x65A978eC2f27bED3C9f0b5C3a59B473ef4FfE3d0",
      type: "Asset",
      symbol: "WETH",
      underlying: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      unpricedTokens: [
        {
          tokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
          isStable: false,
        },
      ],
    },
    {
      vault: "0x67D204645F4639ABFf0a91F45b3236a3D7541829",
      type: "E-CLP",
      symbol: "ECLP-TUSD-USDC",
      underlying: "0x97469E6236bD467cd147065f77752b00EfadCe8a",
      unpricedTokens: [
        {
          tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          isStable: true,
        },
        {
          tokenAddress: "0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756",
          isStable: true,
        },
      ],
    },
    {
      vault: "0x1E6aFF38A1A908b71ad36834895515c9cf3b786b",
      type: "3-CLP",
      symbol: "3CLP-BUSD-USDC-USDT",
      underlying: "0x17f1Ef81707811eA15d9eE7c741179bbE2A63887",
      unpricedTokens: [
        {
          tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          isStable: true,
        },
        {
          tokenAddress: "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
          isStable: true,
        },
        {
          tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          isStable: true,
        },
      ],
    },
    {
      vault: "0x741B6291b4fA578523b15C006eB37531C18e3C8c",
      type: "2-CLP",
      symbol: "2CLP-USDC-DAI",
      underlying: "0xdAC42eeb17758Daa38CAF9A3540c808247527aE3",
      unpricedTokens: [
        {
          tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          isStable: true,
        },
        {
          tokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          isStable: true,
        },
      ],
    },
  ],
  1: [],
  42: [],
  5: [],
  1337: [],
};

export default RESERVE_VAULTS_BACKUP;
