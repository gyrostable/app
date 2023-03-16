import { Contract, providers } from "ethers";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { ChainConfig } from "../../constants/chains";
import { ZERO, ONE } from "../../constants/misc";
import multicall from "../multicall";
import { contracts } from "../../constants/contracts";
import { Multicall } from "../../../types/typechain";
import { erc20 as erc20ABI } from "../../abis";
import safeParseFixed from "../safeParseFixed";
import { Provider } from "@wagmi/core";

async function updateUnderlierTokens(
  selectedNetworkConfig: ChainConfig,
  readOnlyProvider: Provider | providers.JsonRpcProvider,
  account: `0x${string}` | undefined,
  reserveState: DataTypes.ReserveStateStructOutput
) {
  const multicallContract = new Contract(
    contracts["MULTICALL"].address[selectedNetworkConfig.chainId],
    contracts["MULTICALL"].abi,
    readOnlyProvider
  ) as Multicall;

  const underlierData = await Promise.all(
    reserveState.vaults.map(async (vaultData) => {
      let name: string,
        symbol: string,
        decimals: number,
        balance = ZERO,
        allowance = ZERO;

      if (account) {
        [name, symbol, decimals, balance, allowance] = await multicall(
          multicallContract,
          {
            abi: erc20ABI,
            address: vaultData.underlying,
          },
          [
            "name",
            "symbol",
            "decimals",
            ["balanceOf", account],
            [
              "allowance",
              account,
              contracts["MOTHERBOARD"].address[selectedNetworkConfig.chainId],
            ],
          ]
        );
      } else {
        [name, symbol, decimals] = await multicall(
          multicallContract,
          {
            abi: erc20ABI,
            address: vaultData.underlying,
          },
          ["name", "symbol", "decimals"]
        );
      }

      const allowed = allowance.gt(1000000000);
      const normalizedBalance = balance
        .mul(ONE)
        .div(safeParseFixed("1", decimals));
      const price = vaultData.price;
      const value = price ? normalizedBalance.mul(price).div(ONE) : undefined;

      return {
        name,
        address: vaultData.underlying,
        symbol,
        balance,
        decimals,
        price,
        value,
        allowed,
        limitedAllowance: null,
      };
    })
  );

  return underlierData;
}

export default updateUnderlierTokens;
