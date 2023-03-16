import { BigNumber } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { ZERO, ONE } from "../../constants/misc";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { formatFixed } from "@ethersproject/bignumber";

const generateSetMaxBalancedMint = (
  fieldValues: string[],
  setFieldValues: Dispatch<SetStateAction<string[]>>,
  reserveState: DataTypes.ReserveStateStructOutput | null,
  selectedMintTokens: WalletTokenDataType[],
  userCap: BigNumber | null,
  gydTokenData: WalletTokenDataType | null
) => {
  return () => {
    if (
      !reserveState ||
      !userCap ||
      !gydTokenData ||
      !selectedMintTokens.length
    )
      return () => {};

    const relevantVaults = reserveState.vaults.filter(
      ({ idealWeight }) => !idealWeight.isZero()
    );
    const idealWeights = relevantVaults.map(({ idealWeight }) => idealWeight);

    const walletBalanceIdealWeightRatios = selectedMintTokens.map(
      ({ value }, index) =>
        value ? value.mul(ONE).div(idealWeights[index]) : ZERO
    );

    // Limiting token is the one with the minimum value (wallet balance) / idealWeight
    const limitingTokenIndex = walletBalanceIdealWeightRatios.reduce(
      (acc, el, index) => {
        return el.lt(acc.value) ? { value: el, index } : acc;
      },
      {
        value: walletBalanceIdealWeightRatios[0],
        index: 0,
      }
    ).index;

    const remainingUserCap = userCap.gt(gydTokenData.balance)
      ? userCap.sub(gydTokenData.balance)
      : ZERO;

    const isUserCapConstrained = Boolean(
      selectedMintTokens[limitingTokenIndex]?.value?.gt(
        remainingUserCap.mul(idealWeights[limitingTokenIndex]).div(ONE)
      )
    );

    const newFieldValuesBN: BigNumber[] = new Array(
      selectedMintTokens.length
    ).fill(ZERO);

    if (isUserCapConstrained) {
      newFieldValuesBN[limitingTokenIndex] = remainingUserCap
        .mul(idealWeights[limitingTokenIndex])
        .div(relevantVaults[limitingTokenIndex].price)
        // Multiply by 0.9999 to ensure no rounding error
        .mul(9999)
        .div(10000);
    } else {
      newFieldValuesBN[limitingTokenIndex] =
        selectedMintTokens[limitingTokenIndex].balance;
    }

    const newFieldValuesString = newFieldValuesBN.map((bn) =>
      formatFixed(bn, 18)
    );

    // Set only if change in limiting field value
    if (
      fieldValues[limitingTokenIndex] !==
      newFieldValuesString[limitingTokenIndex]
    )
      setFieldValues(newFieldValuesString);
  };
};

export default generateSetMaxBalancedMint;
