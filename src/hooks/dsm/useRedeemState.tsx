import { useContext, useState, useEffect } from "react";
import { BigNumber } from "ethers";
import { ModalContext } from "../../contexts/Modal";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import RedeemTokenSelect from "../../components/UI/Modal/components/TokenSelect/RedeemTokenSelect";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { ZERO, ONE } from "../../constants/misc";
import { Web3Context } from "../../contexts/Web3";

export type RedeemStageType = "tokenSelection" | "slippageSelection";

const useRedeemState = (
  underlierTokens: WalletTokenDataType[],
  fetchReserveStateStatus: FetchType,
  reserveState: DataTypes.ReserveStateStructOutput | null
) => {
  const { setModalOpen, modalPayload, setModalPayload } =
    useContext(ModalContext);

  const [redeeming, setRedeeming] = useState(false);
  const [selectedRedeemTokens, setSelectedRedeemTokens] = useState<
    WalletTokenDataType[]
  >([]);
  const [redeemStage, setRedeemStage] =
    useState<RedeemStageType>("tokenSelection");
  const [redeemBalance, setRedeemBalance] = useState("0");
  const [redeemSlippages, setRedeemSlippages] = useState<number[]>([]);
  const [redeemProportions, setRedeemProportions] = useState<BigNumber[]>([]);
  const [isBalancedRedemption, setIsBalancedRedemption] = useState(false);
  const [redeemAllowed, setRedeemAllowed] = useState(false);

  const { account } = useContext(Web3Context);

  useEffect(() => {
    // Ensure modal payload is up-to-date
    if (modalPayload?.header === "Select Redeem Asset(s)" && reserveState) {
      setModalPayload({
        header: "Select Redeem Asset(s)",
        body: <RedeemTokenSelect />,
        underlierTokens,
        setSelectedRedeemTokens,
        selectedRedeemTokens,
        fetchReserveStateStatus,
        reserveState,
      });
    }
  }, [
    underlierTokens,
    setSelectedRedeemTokens,
    selectedRedeemTokens,
    fetchReserveStateStatus,
    reserveState,
  ]);

  useEffect(() => {
    if (!account) setIsBalancedRedemption(false);
  }, [account]);

  useEffect(() => {
    if (isBalancedRedemption && reserveState) {
      const balancedRedeemTokens = findBalancedRedeemTokens(reserveState);
      setSelectedRedeemTokens(balancedRedeemTokens);
    }
  }, [isBalancedRedemption]);

  useEffect(() => {
    if (reserveState) {
      const balancedRedeemTokens = findBalancedRedeemTokens(reserveState);

      if (balancedRedeemTokens.length !== selectedRedeemTokens.length) {
        setIsBalancedRedemption(false);
      }
    }
  }, [selectedRedeemTokens]);

  function onSelectRedeemTokens() {
    if (reserveState) {
      setModalPayload({
        header: "Select Redeem Asset(s)",
        body: <RedeemTokenSelect />,
        underlierTokens,
        setSelectedRedeemTokens,
        selectedRedeemTokens,
        fetchReserveStateStatus,
        reserveState,
      });
      setModalOpen("redeemTokenSelect");
    }
  }

  function setAutoRedeemSlippage(index: number) {
    setRedeemSlippages([0.15]);
  }

  function findBalancedRedeemTokens(
    reserveState: DataTypes.ReserveStateStructOutput
  ) {
    return underlierTokens.filter(({ address }) => {
      const vault = reserveState.vaults.find(
        ({ underlying }) => underlying === address
      );
      return vault && !vault.idealWeight.isZero();
    });
  }

  // NOTE: Equal and balanced proportions are not the same
  function findEqualProportions() {
    const equalProportions: BigNumber[] =
      selectedRedeemTokens.length > 1
        ? new Array(selectedRedeemTokens.length - 1).fill(
            ONE.div(selectedRedeemTokens.length)
          )
        : [];

    equalProportions.push(
      ONE.sub(equalProportions.reduce((acc, el) => acc.add(el), ZERO))
    );

    return equalProportions;
  }

  function setCustomRedemption() {
    setRedeemStage("slippageSelection");
    setIsBalancedRedemption(false);
    const equalProportions = findEqualProportions();
    setRedeemProportions(equalProportions);
    setRedeemSlippages(new Array(selectedRedeemTokens.length).fill(0.15));
  }

  function setBalancedRedemption() {
    if (reserveState) {
      const balancedRedeemTokens = findBalancedRedeemTokens(reserveState);
      setRedeemStage("slippageSelection");
      setRedeemSlippages(new Array(balancedRedeemTokens.length).fill(0.15));
      const balancedProportions = reserveState.vaults
        .map(({ idealWeight }) => idealWeight)
        .filter((idealWeight) => !idealWeight.isZero());
      setRedeemProportions(balancedProportions);
    }
  }

  function toggleRedeemBalanced() {
    setIsBalancedRedemption((prev) =>
      account && reserveState ? !prev : false
    );
  }

  return {
    selectedRedeemTokens,
    setSelectedRedeemTokens,
    redeeming,
    setRedeeming,
    redeemSlippages,
    setRedeemSlippages,
    onSelectRedeemTokens,
    setAutoRedeemSlippage,
    redeemStage,
    setRedeemStage,
    redeemBalance,
    setRedeemBalance,
    redeemProportions,
    setRedeemProportions,
    isBalancedRedemption,
    setBalancedRedemption,
    redeemAllowed,
    setRedeemAllowed,
    setCustomRedemption,
    toggleRedeemBalanced,
  };
};

export default useRedeemState;
