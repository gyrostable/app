import styled from "styled-components";
import safeParseFixed from "../../../utils/safeParseFixed";
import { useContext } from "react";
import { Web3Context } from "../../../contexts/Web3";
import { PAMMContext } from "../../../contexts/PAMM";
import LoadingAnimation from "../../UI/LoadingAnimation";
import theme from "../../../styles/theme";

const ActionButton = () => {
  const { provider, loadWeb3Modal, isNetworkMismatch } =
    useContext(Web3Context);
  const {
    mintOrRedeem,
    selectedMintTokens,
    mintGYD,
    selectedRedeemTokens,
    redeemGYD,
    redeemStage,
    redeemBalance,
    redeemAllowed,
    gydTokenData,
    stablecoinSymbol,
    setCustomRedemption,
    setBalancedRedemption,
    underlierTokens,
    isMintAllowed,
    verifyMint,
    verifyingMint,
    setMintAttempt,
    isBalancedRedemption,
  } = useContext(PAMMContext);

  const redeemBalanceBN = safeParseFixed(redeemBalance, 18);

  if (!provider)
    return (
      <BottomButton connectWallet onClick={loadWeb3Modal}>
        CONNECT WALLET
      </BottomButton>
    );

  if (mintOrRedeem === "mint") {
    if (!isMintAllowed) {
      return (
        <BottomButton
          id="mint-next-button"
          disabled={isNetworkMismatch || !selectedMintTokens.length}
          onClick={() => {
            if (!verifyingMint) {
              setMintAttempt(0);
              verifyMint();
            }
          }}
        >
          {verifyingMint ? (
            <LoadingAnimation color={theme.colors.highlightDark} size={20} />
          ) : (
            "NEXT"
          )}
        </BottomButton>
      );
    }

    return (
      <BottomButton
        id="mint-button"
        disabled={isNetworkMismatch || !selectedMintTokens.length}
        onClick={mintGYD}
      >
        MINT {stablecoinSymbol}
      </BottomButton>
    );
  }

  if (redeemStage === "tokenSelection") {
    return (
      <BottomButton
        id="redeem-next-button"
        disabled={
          !underlierTokens.length ||
          (!isBalancedRedemption && !selectedRedeemTokens.length) ||
          redeemBalanceBN.isZero() ||
          redeemBalanceBN.isNegative() ||
          gydTokenData?.balance.lt(redeemBalanceBN)
        }
        onClick={
          isBalancedRedemption ? setBalancedRedemption : setCustomRedemption
        }
      >
        NEXT
      </BottomButton>
    );
  }

  return (
    <BottomButton
      id="redeem-button"
      disabled={
        isNetworkMismatch || !selectedRedeemTokens.length || !redeemAllowed
      }
      onClick={redeemGYD}
    >
      REDEEM {formatRedeemBalance(redeemBalance)} {stablecoinSymbol}
    </BottomButton>
  );
};

export default ActionButton;

const BottomButton = styled.button<{
  connectWallet?: boolean;
}>`
  align-items: center;
  border: 1px solid
    ${({ theme, disabled, connectWallet }) =>
      connectWallet || !disabled
        ? theme.colors.white
        : theme.colors.highlightLight};
  border-radius: 8px;
  background: ${({ connectWallet, disabled, theme }) =>
    connectWallet
      ? `linear-gradient(
      90deg,
      rgba(243, 255, 167) 0%,
      rgba(242, 227, 196) 35.94%,
      rgba(237, 187, 250) 63.54%,
      rgba(170, 241, 244) 100%
    )`
      : !disabled
      ? theme.colors.white
      : theme.colors.highlightDark};
  color: ${({ theme, disabled, connectWallet }) =>
    connectWallet || !disabled
      ? theme.colors.dark
      : theme.colors.highlightLight};
  cursor: ${({ connectWallet, disabled }) =>
    connectWallet || !disabled ? "pointer" : "auto"};
  display: flex;
  flex: 1;
  font-weight: 700;
  justify-content: center;
  outline: none;
  padding: 20px;
  transition: all 0.2s ease-in-out;

  ${({ connectWallet, disabled, theme }) =>
    !disabled &&
    !connectWallet &&
    `
        &:hover {
          background: ${theme.colors.offWhite};
        }
      `}
`;

function formatRedeemBalance(input: string) {
  if (!input.includes(".")) return input + ".00";

  let decimals = input.split(".")[1];

  if (decimals.length > 2)
    return (
      input.split(".")[0] +
      "." +
      decimals.slice(0, Math.min(6, decimals.length))
    );

  decimals += "00";

  return input.split(".")[0] + "." + decimals.slice(0, 2);
}
