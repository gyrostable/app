import styled from "styled-components";
import { useContext, useEffect, useState, useRef } from "react";
import { PAMMContext } from "../../../contexts/PAMM";
import { Title } from "./StyledComponents";
import QuantityInputSingle from "../../UI/QuantityInputSingle";
import SlippageDisplay from "./SlippageDisplay";
import { Web3Context } from "../../../contexts/Web3";
import Tooltip from "../../UI/Tooltip";
import BalancedMintRedeemSwitch from "./BalancedMintRedeemSwitch";
import balanceMintBalances from "../../../utils/dsm/balanceMintBalances";
import generateSetMaxBalancedMint from "../../../utils/dsm/generateSetMaxBalancedMint";
import MintAllowanceWarning from "./MintAllowanceWarning";
import Button from "../../UI/Button";
import { ONE, ZERO } from "../../../constants/misc";

const MintGyro = () => {
  const { provider } = useContext(Web3Context);
  const {
    onSelectMintToken,
    selectedMintTokens,
    underlierTokens,
    setSelectedMintTokens,
    mintBalances,
    setMintBalances,
    stablecoinSymbol,
    isBalancedMint,
    reserveState,
    userCap,
    isMintAllowed,
    gydTokenData,
  } = useContext(PAMMContext);

  const remainingCap = userCap?.sub(gydTokenData?.balance || ZERO);

  const prevBalancedMintBalances = useRef<string[]>([]);

  const [fieldValues, setFieldValues] = useState<string[]>([]);

  useEffect(() => {
    if (isBalancedMint) {
      setFieldValues(new Array(selectedMintTokens.length).fill(""));
      setMintBalances(new Array(selectedMintTokens.length).fill("0"));
    }
  }, [isBalancedMint]);

  useEffect(() => {
    if (isBalancedMint && reserveState) {
      const [balanceSuccess, balancedMintBalances] = balanceMintBalances(
        fieldValues,
        reserveState,
        prevBalancedMintBalances
      );
      if (balanceSuccess) {
        setMintBalances(balancedMintBalances);
        setFieldValues(balancedMintBalances);
      }
    }
  }, [fieldValues]);

  useEffect(() => {
    if (mintBalances.length > fieldValues.length) {
      setFieldValues((prev) => [...prev, ""]);
    }
  }, [mintBalances]);

  useEffect(() => {
    if (selectedMintTokens.length)
      prevBalancedMintBalances.current = new Array(
        selectedMintTokens.length
      ).fill("0");
  }, [selectedMintTokens]);

  const setMaxBalancedMint = generateSetMaxBalancedMint(
    fieldValues,
    setFieldValues,
    reserveState,
    selectedMintTokens,
    userCap,
    gydTokenData
  );

  const unselectToken = (index: number) => {
    setSelectedMintTokens((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1, prev.length),
    ]);
    setMintBalances((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1, prev.length),
    ]);
    setFieldValues((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1, prev.length),
    ]);
  };

  function mintBalanceSetterGenerator(index: number) {
    return function mintBalanceSetter(newValue: string) {
      setMintBalances((prev) => [
        ...prev.slice(0, index),
        newValue,
        ...prev.slice(index + 1, mintBalances.length),
      ]);
    };
  }

  function setFieldValueGenerator(index: number) {
    return function setFieldValue(newValue: string) {
      setFieldValues((prev) => [
        ...prev.slice(0, index),
        newValue,
        ...prev.slice(index + 1, prev.length),
      ]);
    };
  }

  const LP_MESSAGE = `Vault assets required to mint ${stablecoinSymbol} can be attained from the 'Pools' section`;

  return (
    <>
      <Title>Add Mint Asset(s)</Title>
      <MintAllowanceWarning />
      <BalancedMintRedeemSwitch />
      <TooltipContainer>
        <Tooltip message={LP_MESSAGE} toLeft />
      </TooltipContainer>
      {isBalancedMint && (
        <Button
          onClick={setMaxBalancedMint}
          id="select-max-balanced-mint-button"
        >
          Select maximum balanced mint
        </Button>
      )}

      {selectedMintTokens.map((tokenData, index) => {
        const maxConstraint =
          remainingCap &&
          tokenData?.price &&
          remainingCap.mul(ONE).div(tokenData?.price ?? ONE);

        return (
          <QuantityInputSingle
            key={index}
            tokenData={tokenData}
            unselect={() => unselectToken(index)}
            fieldValue={fieldValues[index]}
            setFieldValue={setFieldValueGenerator(index)}
            value={mintBalances[index]}
            setValue={mintBalanceSetterGenerator(index)}
            tokenMaxAllowed={!isBalancedMint}
            maxConstraint={maxConstraint}
          />
        );
      })}
      {(!underlierTokens.length ||
        selectedMintTokens.length < underlierTokens.length) && (
        <QuantityInputSingle
          onSelectToken={
            provider && underlierTokens.length ? onSelectMintToken : undefined
          }
          selectable
          tokenMaxAllowed={false}
        />
      )}
      {isMintAllowed && (
        <>
          <Title>Minimum Gyro Dollars</Title>
          <SlippageDisplay />
        </>
      )}
    </>
  );
};

export default MintGyro;

const TooltipContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 95px;
`;
