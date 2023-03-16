import {
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { useRollbar } from "@rollbar/react";
import { ethers, BigNumber } from "ethers";
import { parseFixed } from "@ethersproject/bignumber";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { Web3Context } from "../../contexts/Web3";
import { erc20 as erc20ABI } from "../../abis";
import { ERC20 } from "../../../types/typechain";
import { contracts } from "../../constants/contracts";
import { MAX_UINT_256, ZERO, ONE, GAS_MULTIPLIER } from "../../constants/misc";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { Motherboard } from "../../../types/typechain";
import { RedeemStageType } from "./useRedeemState";
import safeParseFixed from "../../utils/safeParseFixed";
import {
  SUM_OF_WEIGHTS_TOLERANCE,
  ATTEMPT_MULTIPLIER,
} from "../../constants/misc";
import DSM_ERRORS from "../../constants/dsm/errors";
import { ChainsValue } from "../../constants/chains";

const useMotherboard = (
  reserveState: DataTypes.ReserveStateStructOutput | null,
  setUpdateReserveTrigger: Dispatch<SetStateAction<number>>,
  selectedMintTokens: WalletTokenDataType[],
  mintBalances: string[],
  mintSlippage: number,
  setIsMintAllowed: Dispatch<SetStateAction<boolean>>,
  selectedRedeemTokens: WalletTokenDataType[],
  redeemProportions: BigNumber[],
  redeemBalance: string,
  setRedeemAllowed: Dispatch<SetStateAction<boolean>>,
  redeemSlippages: number[],
  redeemStage: RedeemStageType,
  setError: Dispatch<SetStateAction<string>>,
  mintAttempt: number,
  setMintAttempt: Dispatch<SetStateAction<number>>
) => {
  const { provider, chainId, selectedNetworkConfig, account, signer } =
    useContext(Web3Context);

  const [expectedGYDToReceive, setExpectedGYDToReceive] =
    useState<BigNumber | null>(null);

  const [expectedOutputAmounts, setExpectedOutputAmounts] = useState<
    BigNumber[] | null
  >(null);

  const [verifyingMint, setVerifyingMint] = useState(false);

  const rollbar = useRollbar();

  async function approveToken(underlierAddress: string) {
    if (provider && signer && chainId && reserveState) {
      const erc20 = new ethers.Contract(
        underlierAddress,
        erc20ABI,
        provider
      ) as ERC20;
      const tx = await erc20
        .connect(signer)
        .approve(
          contracts["MOTHERBOARD"].address[chainId as ChainsValue],
          MAX_UINT_256
        );
      await tx.wait();
      setUpdateReserveTrigger((prev) => prev + 1);
    }
  }

  /////////////////
  /// MINT
  /////////////////

  function checkMintValid(): [boolean, string] {
    if (!selectedMintTokens.length)
      return [false, "User must select mint assets"];
    if (mintBalances.length !== selectedMintTokens.length)
      return [
        false,
        "Mint balances array length does not equal selected mint assets array length",
      ];
    if (
      selectedMintTokens.some((tokenData, index) =>
        safeParseFixed(mintBalances[index], tokenData.decimals).gt(
          tokenData.balance
        )
      )
    )
      return [false, "Mint balance(s) exceed asset balance(s)"];
    try {
      selectedMintTokens.map((tokenData, index) => {
        const bn = parseFixed(mintBalances[index], tokenData?.decimals || 18);
        if (bn.isNegative() || bn.isZero()) throw new Error("Zero value");
      });
    } catch (e) {
      return [false, "Invalid mint balance value(s)"];
    }
    if (!provider || !account) return [false, "Invalid Web3 provider"];
    if (!reserveState) return [false, "Invalid reserve state"];

    return [true, ""];
  }

  function mintSetup(attempt: number) {
    const [, error] = checkMintValid();
    if (error) {
      throw new Error(error);
    }

    const assets = selectedMintTokens.map((tokenData, index) => {
      const reserveAsset = (
        reserveState as DataTypes.ReserveStateStructOutput
      ).vaults.find(
        ({ underlying }) => underlying === tokenData.address
      ) as DataTypes.VaultInfoStructOutput;

      const destinationVault = reserveAsset.vault;

      const inputAmount = safeParseFixed(
        mintBalances[index],
        tokenData?.decimals || 18
      )
        .mul(safeParseFixed(String(Math.pow(ATTEMPT_MULTIPLIER, attempt)), 18))
        .div(ONE);

      return {
        inputToken: tokenData.address,
        inputAmount,
        destinationVault,
      };
    });

    const motherboard = new ethers.Contract(
      contracts["MOTHERBOARD"].address[selectedNetworkConfig.chainId],
      contracts["MOTHERBOARD"].abi,
      provider
    ) as Motherboard;

    return {
      motherboard,
      assets,
    };
  }

  async function dryMint(attempt = 0): Promise<
    [
      BigNumber,
      string,
      {
        inputToken: string;
        inputAmount: ethers.BigNumber;
        destinationVault: string;
      }[]
    ]
  > {
    const { motherboard, assets } = mintSetup(attempt);
    const result = await motherboard.dryMint(assets, ZERO, account as string);

    return [result.mintedGYDAmount, result.err, assets];
  }

  async function mint() {
    if (provider && chainId && signer) {
      const { motherboard, assets } = mintSetup(mintAttempt);
      const minGYDAcceptable = expectedGYDToReceive
        ?.mul(safeParseFixed(String(100 - mintSlippage), 16))
        .div(ONE);
      await Promise.all(
        selectedMintTokens.map(async ({ address, allowed }) => {
          if (!allowed) await approveToken(address);
        })
      );
      const estimatedGas = await motherboard
        .connect(signer)
        .estimateGas.mint(assets, minGYDAcceptable ?? ZERO);

      const unsignedTx = await motherboard.populateTransaction.mint(
        assets,
        minGYDAcceptable ?? ZERO,
        {
          gasLimit: Math.floor(Number(estimatedGas) * GAS_MULTIPLIER),
        }
      );
      const tx = await signer.sendTransaction({ ...unsignedTx, chainId });
      await tx.wait();
    }
  }

  const verifyMint = useCallback(
    async (attempt = 0): Promise<void> => {
      setVerifyingMint(true);
      try {
        const [success, checkMintError] = checkMintValid();
        if (!success) throw checkMintError;

        const [expectedGYD, errorCode, assets] = await dryMint(attempt);
        if (errorCode) {
          if (errorCode === "64" && attempt <= 3) {
            console.error(
              "Mint balances too large, reducing by factor 0.9999. Attempt:",
              attempt
            );
            return await verifyMint(attempt + 1);
          }
          console.error(
            "DRY MINT INFO: " +
              `${DSM_ERRORS[Number(errorCode)]} (${Number(errorCode)})`
          );
          setExpectedGYDToReceive(null);
          setError(
            "DRY MINT INFO: " +
              `${DSM_ERRORS[Number(errorCode)]} (${Number(errorCode)})`
          );
          rollbar.warning(`User failed to dry mint. Error code: ${errorCode}.
           Assets input (JSON string): ${JSON.stringify(assets)}
          `);
          setIsMintAllowed(false);
        } else {
          setExpectedGYDToReceive(expectedGYD);
          setError("");
          setIsMintAllowed(true);
          setMintAttempt(attempt);
        }
      } catch (e: any) {
        console.error("DRY MINT ERROR: " + (e.message ?? e));
        setError("DRY MINT ERROR: " + (e.message ?? e));
        rollbar.warning(`User failed to dry mint. ${e.message ?? e}`);
        setIsMintAllowed(false);
      } finally {
        setVerifyingMint(false);
      }
    },
    [mintBalances]
  );

  useEffect(() => {
    setError("");
    setIsMintAllowed(false);
  }, [mintBalances]);

  /////////////////
  /// REDEEM
  /////////////////

  function checkRedeemValid(redeemSlippages?: number[]): [boolean, string] {
    const sumOfWeights = redeemProportions.reduce(
      (acc, el) => acc.add(el),
      ZERO
    );
    if (!selectedRedeemTokens.length)
      return [false, "User must select redeem assets"];
    if (redeemProportions.length !== selectedRedeemTokens.length)
      return [
        false,
        "Redeem proportions array length does not equal selected redeem assets array length",
      ];
    if (
      !(
        sumOfWeights.gte(ONE.sub(SUM_OF_WEIGHTS_TOLERANCE)) &&
        sumOfWeights.lte(ONE.add(SUM_OF_WEIGHTS_TOLERANCE))
      )
    )
      return [false, "Redeem proportions must add up to 100%"];
    try {
      const bn = parseFixed(redeemBalance, 18);
      if (bn.isZero()) throw new Error("Zero value");
    } catch (e) {
      return [false, "Invalid redeem balance value"];
    }
    if (!provider || !account) return [false, "Invalid Web3 provider"];
    if (!reserveState) return [false, "Invalid reserve state"];
    if (
      redeemSlippages &&
      redeemSlippages.length !== selectedRedeemTokens.length
    )
      return [
        false,
        "Redeem slippage array length does not equal selected redeem assets array length",
      ];

    return [true, ""];
  }

  function redeemSetup(
    expectedOutputAmounts?: BigNumber[] | null,
    redeemSlippages?: number[]
  ) {
    const [, error] = checkRedeemValid(redeemSlippages);
    if (error) {
      throw new Error(error);
    }

    const assets = selectedRedeemTokens
      .map((tokenData, index) => {
        const reserveAsset = (
          reserveState as DataTypes.ReserveStateStructOutput
        ).vaults.find(
          ({ underlying }) => underlying === tokenData.address
        ) as DataTypes.VaultInfoStructOutput;

        const originVault = reserveAsset.vault;

        const minOutputAmount =
          expectedOutputAmounts && redeemSlippages
            ? (expectedOutputAmounts[index] ?? ZERO)
                .mul(safeParseFixed(String(100 - redeemSlippages[index]), 16))
                .div(ONE)
            : ZERO;

        return {
          outputToken: tokenData.address,
          minOutputAmount,
          valueRatio: redeemProportions[index],
          originVault,
        };
      })
      .filter(({ valueRatio }) => !valueRatio.isZero());

    const motherboard = new ethers.Contract(
      contracts["MOTHERBOARD"].address[selectedNetworkConfig.chainId],
      contracts["MOTHERBOARD"].abi,
      provider
    ) as Motherboard;

    return {
      motherboard,
      assets,
    };
  }

  async function dryRedeem(): Promise<
    [
      BigNumber[],
      string,
      {
        outputToken: string;
        minOutputAmount: ethers.BigNumber;
        valueRatio: ethers.BigNumber;
        originVault: string;
      }[]
    ]
  > {
    const redeemBalanceBN = safeParseFixed(redeemBalance, 18);
    const { motherboard, assets } = redeemSetup();
    const result = await motherboard.dryRedeem(redeemBalanceBN, assets);

    return [result.outputAmounts, result.err, assets];
  }

  async function redeem() {
    if (provider && chainId && signer) {
      const { motherboard, assets } = redeemSetup(
        expectedOutputAmounts,
        redeemSlippages
      );
      const redeemBalanceBN = safeParseFixed(redeemBalance, 18);
      const estimatedGas = await motherboard
        .connect(signer)
        .estimateGas.redeem(redeemBalanceBN, assets);

      const unsignedTx = await motherboard.populateTransaction.redeem(
        redeemBalanceBN,
        assets,
        {
          gasLimit: Math.floor(Number(estimatedGas) * GAS_MULTIPLIER),
        }
      );

      const tx = await signer.sendTransaction({ ...unsignedTx, chainId });
      await tx.wait();
    }
  }

  const verifyRedeem = useCallback(async () => {
    setRedeemAllowed(false);
    try {
      const [success, checkRedeemError] = checkRedeemValid();
      if (!success) throw checkRedeemError;

      const [expectedOutputAmounts, errorCode, assets] = await dryRedeem();
      if (errorCode) {
        console.error(
          "DRY REDEEM INFO: " +
            `${DSM_ERRORS[Number(errorCode)]} (${Number(errorCode)})`
        );
        setExpectedOutputAmounts(null);
        setError(
          "DRY REDEEM INFO: " +
            `${DSM_ERRORS[Number(errorCode)]} (${Number(errorCode)})`
        );
        rollbar.warning(`User failed to dry redeem. Error code: ${errorCode}.
          Assets input (JSON string): ${JSON.stringify(assets)}
         `);
      } else {
        setExpectedOutputAmounts(expectedOutputAmounts);
        setError("");
        setRedeemAllowed(true);
      }
    } catch (e: any) {
      console.error("DRY REDEEM ERROR: " + (e.message ?? e));
      setError("DRY REDEEM ERROR: " + (e.message ?? e));
      rollbar.warning(`User failed to dry redeem. ${e.message ?? e}`);
    }
  }, [redeemProportions, redeemStage, setError]);

  useEffect(() => {
    setTimeout(() => {
      if (redeemStage === "slippageSelection") {
        verifyRedeem();
      }
    }, 100);
  }, [redeemProportions, redeemStage]);

  return {
    expectedGYDToReceive,
    setExpectedGYDToReceive,
    mint,
    checkRedeemValid,
    expectedOutputAmounts,
    setExpectedOutputAmounts,
    redeem,
    verifyMint,
    verifyingMint,
  };
};

export default useMotherboard;
