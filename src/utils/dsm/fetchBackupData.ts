import { BigNumber, Contract, providers } from "ethers";
import { Provider } from "@wagmi/core";
import { ChainConfig } from "../../constants/chains";
import RESERVE_VAULTS_BACKUP, {
  BackUpVault,
} from "../../constants/dsm/reserveVaultsBackup";
import fetchPrice from "../api/fetchPrice";
import { erc20 as erc20ABI, primaryAMMV1 as primaryAMMV1ABI } from "../../abis";
import multicall from "../multicall";
import { contracts } from "../../constants/contracts";
import {
  Balancer2CLPPriceOracle,
  Multicall,
  PrimaryAMMV1,
} from "../../../types/typechain";
import { ONE, ZERO } from "../../constants/misc";
import { Dispatch, SetStateAction } from "react";
import { BackupDataType } from "../../hooks/dsm/useReserveState";

type PricedTokenVaultsType = {
  pricedTokens: {
    price: BigNumber;
    tokenAddress: string;
    isStable: boolean;
  }[];
  vault: string;
  symbol: string;
  type: "Asset" | "E-CLP" | "3-CLP" | "2-CLP";
  underlying: string;
  unpricedTokens: {
    tokenAddress: string;
    isStable: boolean;
  }[];
}[];

export type VaultWithValue = {
  vault: string;
  underlying: string;
  pricedTokens: {
    price: BigNumber;
    tokenAddress: string;
    isStable: boolean;
  }[];
  price: BigNumber;
  balance: BigNumber;
  symbol: string;
  value: BigNumber;
};

async function fetchBackupData(
  selectedNetworkConfig: ChainConfig,
  readOnlyProvider: Provider | providers.JsonRpcProvider,
  setBackupData: Dispatch<SetStateAction<BackupDataType | null>>,
  setFetchReserveStateStatus: Dispatch<SetStateAction<FetchType>>
) {
  const reserveVaultsBackup =
    RESERVE_VAULTS_BACKUP[selectedNetworkConfig.chainId];

  try {
    const pricedTokenVaults = await fetchVaultTokenPrices(
      reserveVaultsBackup,
      selectedNetworkConfig
    );

    const { vaultsWithValues, gydTotalSupply, systemParams, redemptionLevel } =
      await fetchValues(
        pricedTokenVaults,
        selectedNetworkConfig,
        readOnlyProvider
      );

    const totalUSDValue = vaultsWithValues.reduce(
      (acc, { value }) => value.add(acc),
      ZERO
    );

    const primaryAMMV1Contract = new Contract(
      contracts["PRIMARY_AMM_V1"].address[selectedNetworkConfig.chainId],
      contracts["PRIMARY_AMM_V1"].abi,
      readOnlyProvider
    ) as PrimaryAMMV1;

    const redemptionPrice = await primaryAMMV1Contract.computeRedeemAmount(
      ONE,
      totalUSDValue
    );

    setFetchReserveStateStatus("success");
    setBackupData({
      vaultsWithValues,
      gydTotalSupply,
      systemParams,
      redemptionLevel,
      redemptionPrice,
      totalUSDValue,
    });
  } catch (e) {
    console.error("Failed to fetch backup reserve data");
    setFetchReserveStateStatus("failed");
  }
}

async function fetchVaultTokenPrices(
  reserveVaultsBackup: BackUpVault[],
  selectedNetworkConfig: ChainConfig
) {
  return Promise.all(
    reserveVaultsBackup.map(async (vaultInfo) => ({
      ...vaultInfo,
      pricedTokens: await Promise.all(
        vaultInfo.unpricedTokens.map(async (unpricedToken) => ({
          ...unpricedToken,
          price: await fetchPrice(
            selectedNetworkConfig.coingeckoId,
            unpricedToken.tokenAddress
          ),
        }))
      ),
    }))
  );
}

async function fetchValues(
  pricedTokenVaults: PricedTokenVaultsType,
  selectedNetworkConfig: ChainConfig,
  readOnlyProvider: Provider | providers.JsonRpcProvider
) {
  // Multicall
  const multicallContract = new Contract(
    contracts["MULTICALL"].address[selectedNetworkConfig.chainId],
    contracts["MULTICALL"].abi,
    readOnlyProvider
  ) as Multicall;

  const contractInfoArray = [
    {
      abi: erc20ABI,
      address: contracts["GYD_TOKEN"].address[selectedNetworkConfig.chainId],
    },
    {
      abi: primaryAMMV1ABI,
      address:
        contracts["PRIMARY_AMM_V1"].address[selectedNetworkConfig.chainId],
    },
    {
      abi: primaryAMMV1ABI,
      address:
        contracts["PRIMARY_AMM_V1"].address[selectedNetworkConfig.chainId],
    },
    ...pricedTokenVaults.map(({ underlying }) => ({
      abi: erc20ABI,
      address: underlying,
    })),
  ];

  const argsArray = [
    "totalSupply",
    "systemParams",
    "redemptionLevel",
    ...pricedTokenVaults.map(({ vault }) => ["balanceOf", vault]),
  ];

  const [gydTotalSupply, systemParams, redemptionLevel, ...lpTokenBalances] =
    await multicall(multicallContract, contractInfoArray, argsArray);

  // Fetch LP prices from Oracles
  const filteredPricedTokenVaults = pricedTokenVaults.filter(
    ({ type }) => type !== "Asset"
  );

  const lpPrices: Record<string, BigNumber> = {};

  await Promise.all(
    filteredPricedTokenVaults.map(async ({ vault, type, pricedTokens }) => {
      const contract = constructPriceOracleContract(
        type as "2-CLP" | "3-CLP" | "E-CLP",
        selectedNetworkConfig,
        readOnlyProvider
      );

      const price = await contract.getPoolTokenPriceUSD(vault, pricedTokens);
      lpPrices[vault] = price;
    })
  );

  // Calculate Vault vaults
  const vaultsWithValues = pricedTokenVaults.map(
    ({ vault, symbol, underlying, pricedTokens, type }, index) => {
      const price = type === "Asset" ? pricedTokens[0].price : lpPrices[vault];

      return {
        vault,
        symbol,
        underlying,
        pricedTokens,
        price,
        balance: lpTokenBalances[index],
        value: lpTokenBalances[index].mul(price).div(ONE),
      };
    }
  );

  return { vaultsWithValues, gydTotalSupply, systemParams, redemptionLevel };
}

function constructPriceOracleContract(
  type: "2-CLP" | "3-CLP" | "E-CLP",
  selectedNetworkConfig: ChainConfig,
  readOnlyProvider: Provider | providers.JsonRpcProvider
) {
  const contract = new Contract(
    (contracts as any)[
      "BALANCER_" + type.replace("-", "") + "_PRICE_ORACLE"
    ].address[selectedNetworkConfig.chainId],
    (contracts as any)[
      "BALANCER_" + type.replace("-", "") + "_PRICE_ORACLE"
    ].abi,
    readOnlyProvider
  ) as Balancer2CLPPriceOracle; // type doesn't matter as they all have the same getPoolTokenPriceUSD method ;

  return contract;
}

export default fetchBackupData;
