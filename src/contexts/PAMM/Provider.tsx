import { useContext, useEffect, ReactNode, useState } from "react";
import { useRollbar } from "@rollbar/react";
import MintingRedeemingModal from "../../components/UI/Modal/components/MintingRedeemingModal";
import useMintState from "../../hooks/dsm/useMintState";
import useRedeemState from "../../hooks/dsm/useRedeemState";
import { WalletTokenDataType } from "../Wallet/Context";
import { ModalContext } from "../Modal";
import Context from "./Context";
import { Web3Context } from "../Web3";
import useReserveState from "../../hooks/dsm/useReserveState";
import useMotherboard from "../../hooks/dsm/useMotherboard";
import useGydToken from "../../hooks/dsm/useGydToken";
import usePAMMCappedData from "../../hooks/dsm/usePAMMCappedData";
import addTokenToWeb3Wallet from "../../utils/addTokenToWeb3Wallet";
import { Chains } from "../../constants/chains";
import accumulateFetchStatus from "../../utils/accumulateFetchStatus";

const Provider = ({ children }: { children: ReactNode }) => {
  const { setModalOpen, setModalPayload } = useContext(ModalContext);
  const { provider, account, selectedNetworkConfig } = useContext(Web3Context);
  const [mintOrRedeem, setMintOrRedeem] = useState<"mint" | "redeem">("mint");
  const [error, setError] = useState("");

  const rollbar = useRollbar();

  const {
    underlierTokens,
    reserveState,
    gydPrice,
    fetchReserveStateStatus,
    setUpdateReserveTrigger,
    systemParams,
    redemptionLevel,
    backupData,
  } = useReserveState(setError);

  const {
    onSelectMintToken,
    selectedMintTokens,
    setSelectedMintTokens,
    minting,
    setMinting,
    mintSlippage,
    setMintSlippage,
    setAutoMintSlippage,
    mintBalances,
    setMintBalances,
    isBalancedMint,
    toggleMintBalanced,
    isMintAllowed,
    setIsMintAllowed,
    mintAttempt,
    setMintAttempt,
  } = useMintState(underlierTokens, fetchReserveStateStatus, reserveState);

  const {
    onSelectRedeemTokens,
    selectedRedeemTokens,
    setSelectedRedeemTokens,
    redeeming,
    setRedeeming,
    redeemSlippages,
    setRedeemSlippages,
    setAutoRedeemSlippage,
    redeemStage,
    setRedeemStage,
    redeemBalance,
    setRedeemBalance,
    redeemProportions,
    setRedeemProportions,
    isBalancedRedemption,
    redeemAllowed,
    setRedeemAllowed,
    setCustomRedemption,
    setBalancedRedemption,
    toggleRedeemBalanced,
  } = useRedeemState(underlierTokens, fetchReserveStateStatus, reserveState);

  const {
    expectedGYDToReceive,
    mint,
    expectedOutputAmounts,
    redeem,
    setExpectedGYDToReceive,
    setExpectedOutputAmounts,
    verifyMint,
    verifyingMint,
  } = useMotherboard(
    reserveState,
    setUpdateReserveTrigger,
    selectedMintTokens,
    mintBalances,
    mintSlippage,
    setIsMintAllowed,
    selectedRedeemTokens,
    redeemProportions,
    redeemBalance,
    setRedeemAllowed,
    redeemSlippages,
    redeemStage,
    fetchReserveStateStatus === "success" ? setError : () => {},
    mintAttempt,
    setMintAttempt
  );

  const { gydTokenData, setUpdateGYDTokenTrigger, fetchGYDDataStatus } =
    useGydToken(gydPrice);

  // Sync underlier token status with selected mint/redeem tokens
  useEffect(() => {
    setSelectedMintTokens((prev) =>
      prev.map(
        ({ address }) =>
          underlierTokens.find(
            ({ address: underlierAddress }) => underlierAddress === address
          ) as WalletTokenDataType
      )
    );

    setSelectedRedeemTokens((prev) =>
      prev.map(
        ({ address }) =>
          underlierTokens.find(
            ({ address: underlierAddress }) => underlierAddress === address
          ) as WalletTokenDataType
      )
    );
  }, [underlierTokens]);

  useEffect(() => {
    resetState();
  }, [provider, account]);

  // Clear error when redeemStage changes
  useEffect(() => {
    setError("");
  }, [redeemStage]);

  const mintGYD = async () => {
    setModalPayload({
      header: "Minting " + stablecoinSymbol,
      body: <MintingRedeemingModal />,
      noCloseOnClickOutside: true,
      noCloseButton: true,
      minting: true,
      stablecoinSymbol,
    });
    setModalOpen("minting/redeeming");

    try {
      setMinting(true);
      await mint();
      setModalPayload((prev: any) => ({
        ...prev,
        minting: false,
        noCloseButton: false,
        onClose: resetState,
        addToWeb3Wallet,
      }));
    } catch (e: any) {
      console.error(e);
      setModalPayload((prev: any) => ({
        ...prev,
        minting: false,
        noCloseButton: false,
        modalError: e.message ?? e,
      }));
      rollbar.warning(
        `User failed to mint ${stablecoinSymbol}: ` + (e.message ?? e)
      );
    } finally {
      setMinting(false);
      setUpdateReserveTrigger((prev) => prev + 1);
      setUpdateGYDTokenTrigger((prev) => prev + 1);
    }
  };

  const addToWeb3Wallet =
    gydTokenData &&
    async function () {
      try {
        await addTokenToWeb3Wallet({
          address: gydTokenData.address,
          symbol: gydTokenData.symbol,
          decimals: gydTokenData.decimals,
          image: "",
        });
        setModalPayload((prev: any) => ({
          ...prev,
          isTokenAddedToWallet: true,
        }));
      } catch (e: any) {
        setModalPayload((prev: any) => ({
          ...prev,
          modalError: e.message ?? e,
        }));
      }
    };

  const redeemGYD = async () => {
    setModalPayload({
      header: "Redeeming " + stablecoinSymbol,
      body: <MintingRedeemingModal />,
      noCloseOnClickOutside: true,
      noCloseButton: true,
      redeeming: true,
      stablecoinSymbol,
    });
    setModalOpen("minting/redeeming");

    try {
      setRedeeming(true);
      await redeem();
      setModalPayload((prev: any) => ({
        ...prev,
        redeeming: false,
        noCloseButton: false,
        onClose: resetState,
      }));
    } catch (e: any) {
      console.error(e);
      setModalPayload((prev: any) => ({
        ...prev,
        noCloseButton: false,
        redeeming: false,
        modalError: e.message ?? e,
      }));
      rollbar.warning(
        `User failed to redeem ${stablecoinSymbol}: ` + (e.message ?? e)
      );
    } finally {
      setRedeeming(false);
      setUpdateReserveTrigger((prev) => prev + 1);
      setUpdateGYDTokenTrigger((prev) => prev + 1);
    }
  };

  const resetState = () => {
    setSelectedMintTokens([]);
    setMintBalances([]);
    setAutoMintSlippage();

    setRedeemStage("tokenSelection");
    setSelectedRedeemTokens([]);
    setRedeemBalance("0");
    setRedeemSlippages([]);

    setExpectedGYDToReceive(null);
    setExpectedOutputAmounts(null);

    if (
      accumulateFetchStatus(fetchGYDDataStatus, fetchReserveStateStatus) ===
      "success"
    )
      setError("");
  };

  const stablecoinSymbol =
    selectedNetworkConfig.chainId === Chains["polygon"] ? "p-GYD" : "GYD";

  const { totalPercCap, userPercCap, userCap } = usePAMMCappedData(
    reserveState,
    gydTokenData
  );

  return (
    <Context.Provider
      value={{
        mintOrRedeem,
        setMintOrRedeem: (newValue) => {
          resetState();
          return setMintOrRedeem(newValue);
        },
        underlierTokens,
        reserveState,
        fetchReserveStateStatus,
        fetchGYDDataStatus,
        onSelectMintToken,
        selectedMintTokens,
        setSelectedMintTokens,
        mintGYD,
        minting,
        mintSlippage,
        setMintSlippage,
        setAutoMintSlippage,
        mintBalances,
        setMintBalances,
        isMintAllowed,
        verifyMint,
        verifyingMint,
        onSelectRedeemTokens,
        selectedRedeemTokens,
        setSelectedRedeemTokens,
        redeeming,
        setRedeeming,
        redeemSlippages,
        setRedeemSlippages,
        setAutoRedeemSlippage,
        redeemGYD,
        redeemStage,
        setRedeemStage,
        redeemBalance,
        setRedeemBalance,
        redeemProportions,
        setRedeemProportions,
        isBalancedRedemption,
        redeemAllowed,
        setCustomRedemption,
        setBalancedRedemption,
        expectedGYDToReceive,
        expectedOutputAmounts,
        gydTokenData,
        error,
        stablecoinSymbol,
        userPercCap,
        totalPercCap,
        userCap,
        isBalancedMint,
        toggleMintBalanced,
        toggleRedeemBalanced,
        setMintAttempt,
        systemParams,
        redemptionLevel,
        backupData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
