import { Chains, ChainsValue } from "./chains";
import {
  vault as vaultABI,
  balancerHelpers as balancerHelpersABI,
  reserveManager as reserveManagerABI,
  motherboard as motherboardABI,
  primaryAMMV1 as primaryAMMV1ABI,
  gydToken as gydTokenABI,
  gyroConfig as gyroConfigABI,
  capAuthentication as capAuthenticationABI,
  multicall as multicallABI,
  reserveSystemRead as reserveSystemReadABI,
  balancer2CLPPriceOracle as balancer2CLPPriceOracleABI,
  balancer3CLPPriceOracle as balancer3CLPPriceOracleABI,
  balancerECLPPriceOracle as balancerECLPPriceOracleABI,
} from "../abis";

export type AppContractInfo = {
  address: { [key in ChainsValue]: string };
  abi: any[];
};

function constantContracts<T extends { [key in string]: AppContractInfo }>(
  o: T
): T {
  return o;
}

export const contracts = constantContracts({
  VAULT: {
    address: {
      [Chains.mainnet]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      [Chains.kovan]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      [Chains.goerli]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      [Chains.polygon]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      [Chains.localhost]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    },
    abi: vaultABI,
  },
  BALANCER_HELPERS: {
    address: {
      [Chains.mainnet]: "0x5aDDCCa35b7A0D07C74063c48700C8590E87864E",
      [Chains.kovan]: "0x94905e703fEAd7f0fD0eEe355D267eE909784e6d",
      [Chains.goerli]: "0x5aDDCCa35b7A0D07C74063c48700C8590E87864E",
      [Chains.polygon]: "0x239e55F427D44C3cc793f49bFB507ebe76638a2b",
      [Chains.localhost]: "0x5aDDCCa35b7A0D07C74063c48700C8590E87864E",
    },
    abi: balancerHelpersABI,
  },
  RESERVE_MANAGER: {
    address: {
      [Chains.mainnet]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.kovan]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.goerli]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.polygon]: "0xa9bD43E98b184C66AFb83F75348eB041df81BB15",
      [Chains.localhost]: process.env
        .NEXT_PUBLIC_LOCALHOST_RESERVE_MANAGER_ADDRESS as string,
    },
    abi: reserveManagerABI,
  },
  MOTHERBOARD: {
    address: {
      [Chains.mainnet]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.kovan]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.goerli]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.polygon]: "0x68BDeE1bF95AD730F379A05eB8c51fb5dFA07748",
      [Chains.localhost]: process.env
        .NEXT_PUBLIC_LOCALHOST_MOTHERBOARD_ADDRESS as string,
    },
    abi: motherboardABI,
  },
  PRIMARY_AMM_V1: {
    address: {
      [Chains.mainnet]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.kovan]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.goerli]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.polygon]: "0x0917C486CAfdE993B95b8c283b79fc228CB5b655",
      [Chains.localhost]: process.env
        .NEXT_PUBLIC_LOCALHOST_PRIMARY_AMM_V1_ADDRESS as string,
    },
    abi: primaryAMMV1ABI,
  },
  GYD_TOKEN: {
    address: {
      [Chains.mainnet]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.kovan]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.goerli]: "0xEd447aCB0CEb49d77f317dD6D37CB64da7a7E7F8",
      [Chains.polygon]: "0x37b8E1152fB90A867F3dccA6e8d537681B04705E",
      [Chains.localhost]: process.env
        .NEXT_PUBLIC_LOCALHOST_GYD_TOKEN_ADDRESS as string,
    },
    abi: gydTokenABI,
  },
  GYRO_CONFIG: {
    address: {
      [Chains.mainnet]: "0x3c00e4663be7262E50251380EBE5fE4A17e68B51",
      [Chains.kovan]: "0x3c00e4663be7262E50251380EBE5fE4A17e68B51",
      [Chains.goerli]: "0x3c00e4663be7262E50251380EBE5fE4A17e68B51",
      [Chains.polygon]: "0x3c00e4663be7262E50251380EBE5fE4A17e68B51",
      [Chains.localhost]: process.env
        .NEXT_PUBLIC_LOCALHOST_GYRO_CONFIG_ADDRESS as string,
    },
    abi: gyroConfigABI,
  },
  CAP_AUTHENTICATION: {
    address: {
      [Chains.mainnet]: "0x8d84f2255E2970BcBEdc6348fB08d65f76d8cc67",
      [Chains.kovan]: "0x8d84f2255E2970BcBEdc6348fB08d65f76d8cc67",
      [Chains.goerli]: "0x8d84f2255E2970BcBEdc6348fB08d65f76d8cc67",
      [Chains.polygon]: "0x8d84f2255E2970BcBEdc6348fB08d65f76d8cc67",
      [Chains.localhost]: process.env
        .NEXT_PUBLIC_LOCALHOST_CAP_AUTHENTICATION_ADDRESS as string,
    },
    abi: capAuthenticationABI,
  },
  MULTICALL: {
    address: {
      [Chains.mainnet]: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
      [Chains.kovan]: "0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a",
      [Chains.goerli]: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
      [Chains.polygon]: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
      [Chains.localhost]: process.env
        .NEXT_PUBLIC_LOCALHOST_CAP_AUTHENTICATION_ADDRESS as string,
    },
    abi: multicallABI,
  },
  RESERVE_SYSTEM_READ: {
    address: {
      [Chains.mainnet]: "",
      [Chains.kovan]: "",
      [Chains.goerli]: "",
      [Chains.polygon]: "0xCF6fc35A81D928E713cC9e66674C5e62049670A1",
      // Use below to simulate 45 error
      // [Chains.polygon]: "0x36B0f37710Da7E678bc3b2aeF5F05Bf43E714610",
      [Chains.localhost]: "",
    },
    abi: reserveSystemReadABI,
  },
  BALANCER_2CLP_PRICE_ORACLE: {
    address: {
      [Chains.mainnet]: "",
      [Chains.kovan]: "",
      [Chains.goerli]: "",
      [Chains.polygon]: "0x28D3eb84EF9c6691a61007A5171E80D3aB12CeC2",
      [Chains.localhost]: "",
    },
    abi: balancer2CLPPriceOracleABI,
  },
  BALANCER_3CLP_PRICE_ORACLE: {
    address: {
      [Chains.mainnet]: "",
      [Chains.kovan]: "",
      [Chains.goerli]: "",
      [Chains.polygon]: "0xF7643D17e42a2b34898509f02c7bd0a1b4dBb57a",
      [Chains.localhost]: "",
    },
    abi: balancer3CLPPriceOracleABI,
  },
  BALANCER_ECLP_PRICE_ORACLE: {
    address: {
      [Chains.mainnet]: "",
      [Chains.kovan]: "",
      [Chains.goerli]: "",
      [Chains.polygon]: "0xD622086d17A60563550F302E95515503652dc2C5",
      [Chains.localhost]: "",
    },
    abi: balancerECLPPriceOracleABI,
  },
});

export type ContractKeyType = keyof typeof contracts;
