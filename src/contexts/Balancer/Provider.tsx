import { useContext, ReactNode } from "react";
import { Web3Context } from "../Web3";
import Context from "./Context";
import { BigNumber, ethers, Signer } from "ethers";
import { contracts } from "../../constants/contracts";
import { ONE, ZERO } from "../../constants/misc";
import { generateUserData, JoinKind, ExitKind } from "./helpers";
import { erc20 } from "../../abis";
import { MAX_UINT_256 } from "../../constants/misc";
import { WalletContext } from "../Wallet";
import safeParseFixed from "../../utils/safeParseFixed";
import { ChainsValue } from "../../constants/chains";
import { Provider as WagmiProvider } from "@wagmi/core";

const MAX_ALLOWED_SLIPPAGE = "0.01"; // Allow only maximum 1% slippage

const Provider = ({ children }: { children: ReactNode }) => {
  const { provider, chainId, account, signer } = useContext(Web3Context);
  const { updateWallet } = useContext(WalletContext);

  async function joinPool(
    poolId: string,
    assets: string[],
    desiredBptOut: BigNumber
  ) {
    if (provider && chainId && account && signer) {
      const contract = new ethers.Contract(
        contracts.VAULT.address[chainId as ChainsValue],
        contracts.VAULT.abi,
        provider
      );

      let maxAmountsIn = assets.map(() => ethers.constants.MaxUint256);

      const userData = generateUserData(
        true,
        JoinKind["ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"],
        undefined,
        desiredBptOut
      );

      let request = [assets, maxAmountsIn, userData, false];

      let { amountsIn } = await queryPool(
        provider,
        signer,
        poolId,
        request,
        "join"
      );

      maxAmountsIn = amountsIn.map((amount: BigNumber) =>
        amount.mul(safeParseFixed(MAX_ALLOWED_SLIPPAGE, 18).add(ONE)).div(ONE)
      );

      request = [assets, maxAmountsIn, userData, false];

      const unsignedTx = await contract.populateTransaction.joinPool(
        poolId,
        account,
        account,
        request
      );

      const tx = await signer.sendTransaction({ ...unsignedTx, chainId });

      await tx.wait();
      await updateWallet();
    }
  }

  async function exitPool(
    poolId: string,
    assets: string[],
    desiredBptIn: BigNumber
  ) {
    if (provider && chainId && account && signer) {
      const contract = new ethers.Contract(
        contracts.VAULT.address[chainId as ChainsValue],
        contracts.VAULT.abi,
        provider
      );

      let minAmountsOut = assets.map(() => ZERO);

      const userData = generateUserData(
        false,
        ExitKind["EXACT_BPT_IN_FOR_TOKENS_OUT"],
        undefined,
        desiredBptIn
      );

      let request = [assets, minAmountsOut, userData, false];

      let { amountsOut } = await queryPool(
        provider,
        signer,
        poolId,
        request,
        "exit"
      );

      minAmountsOut = amountsOut.map((amount: BigNumber) =>
        amount.mul(ONE).div(safeParseFixed(MAX_ALLOWED_SLIPPAGE, 18).add(ONE))
      );

      request = [assets, minAmountsOut, userData, false];

      const unsignedTx = await contract.populateTransaction.exitPool(
        poolId,
        account,
        account,
        request
      );

      const tx = await signer.sendTransaction({ ...unsignedTx, chainId });

      await tx.wait();
      await updateWallet();
    }
  }

  async function approveToken(tokenAddress: string) {
    if (provider && chainId && signer) {
      const contract = new ethers.Contract(tokenAddress, erc20, provider);
      const tx = await contract
        .connect(signer)
        .approve(contracts.VAULT.address[chainId as ChainsValue], MAX_UINT_256);
      await tx.wait();
      await updateWallet();
    }
  }

  const queryPool = async (
    provider: WagmiProvider,
    signer: Signer,
    poolId: string,
    request: (string | boolean | string[] | BigNumber[])[],
    joinOrExit: "join" | "exit"
  ) => {
    if (chainId) {
      const balancerHelpersContract = new ethers.Contract(
        contracts.BALANCER_HELPERS.address[chainId as ChainsValue],
        contracts.BALANCER_HELPERS.abi,
        provider
      ).connect(signer);

      const res = await balancerHelpersContract.callStatic[
        joinOrExit === "join" ? "queryJoin" : "queryExit"
      ](poolId, account, account, request);

      return res;
    }

    throw new Error("Chain ID required to query pool (queryJoin/queryExit)");
  };

  return (
    <Context.Provider value={{ joinPool, exitPool, approveToken }}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
