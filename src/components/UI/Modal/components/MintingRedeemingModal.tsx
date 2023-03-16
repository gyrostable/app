import styled from "styled-components";
import { useEffect, useRef } from "react";
import { MdSettingsEthernet } from "react-icons/md";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import HorizontalRule from "../../HorizontalRule";
import { useContext } from "react";
import theme from "../../../../styles/theme";
import { ModalContext } from "../../../../contexts/Modal";
import LoadingDots from "../../LoadingDots";
import Button from "../../Button";

const MintingRedeemingModal = () => {
  const { modalPayload } = useContext(ModalContext);
  const {
    minting,
    redeeming,
    modalError,
    stablecoinSymbol,
    addToWeb3Wallet,
    isTokenAddedToWallet,
  } = modalPayload;
  const action = useRef("");

  useEffect(() => {
    if (minting) action.current = "mint";
    if (redeeming) action.current = "redeem";
  }, [minting, redeeming]);

  return (
    <Container id="mint-redeem-modal">
      <Circle isRotating={minting || redeeming}>
        {minting || redeeming ? (
          <InnerCircle>
            <MdSettingsEthernet fontSize="50px" />
          </InnerCircle>
        ) : modalError ? (
          <BiXCircle
            fontSize="80px"
            color={theme.colors.highlightDark}
            style={{ transform: "rotate(90deg)" }}
          />
        ) : (
          <BiCheckCircle
            fontSize="80px"
            color={theme.colors.highlightDark}
            style={{ transform: "rotate(90deg)" }}
          />
        )}
      </Circle>
      <HorizontalRule />
      <h6>
        {minting || redeeming
          ? `${
              minting ? "Minting" : "Redeeming"
            } ${stablecoinSymbol} - this may take some time`
          : (action.current === "mint" ? "Mint" : "Redemption") +
            (modalError ? " Unsuccessful" : " Success")}
        {(minting || redeeming) && <LoadingDots />}
      </h6>
      {modalError && (
        <>
          <h6 style={{ color: "red", maxWidth: "500px", overflow: "hidden" }}>
            {modalError.length > 150
              ? modalError.split(" ").slice(0, 16).join(" ") + "..."
              : modalError}
          </h6>
          {modalError.length > 150 ? (
            <h6 style={{ color: "red", marginTop: 0 }}>
              Open console to see full error
            </h6>
          ) : null}
        </>
      )}
      {addToWeb3Wallet && window?.ethereum && (
        <Button
          disabled={isTokenAddedToWallet}
          onClick={addToWeb3Wallet}
          margin="20px 0 0 0"
        >
          {isTokenAddedToWallet
            ? `${stablecoinSymbol} added to Web3 wallet`
            : `Add ${stablecoinSymbol} to Web3 wallet`}
        </Button>
      )}
    </Container>
  );
};

export default MintingRedeemingModal;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h6 {
    margin: 0;
    margin-top: 20px;
  }
`;

const Circle = styled.div<{ isRotating: boolean }>`
  align-items: center;
  ${({ isRotating }) => isRotating && "animation: rotation 1s linear infinite"};
  background: linear-gradient(
    90deg,
    #f3ffa7 0%,
    #f2e3c4 35.94%,
    #edbbfa 63.54%,
    #aaf1f4 100%
  );
  border-color: transparent;
  border-radius: 50%;
  border-style: solid;
  border-width: 1px;
  display: flex;
  flex-direction: column;
  height: 250px;
  justify-content: center;
  margin: 30px 0 50px;
  padding: 1px;
  transform: rotate(-90deg);
  width: 250px;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(45deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const InnerCircle = styled.div`
  align-items: center;
  animation: rotation-2 1s linear infinite;
  background: ${({ theme }) => theme.colors.highlightDark};
  border-color: transparent;
  border-radius: 50%;
  border-style: solid;
  border-width: 1px;
  display: flex;
  justify-content: center;
  height: 248px;
  width: 248px;

  @keyframes rotation-2 {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-45deg);
    }
    50% {
      transform: rotate(-180deg);
    }
    75% {
      transform: rotate(-270deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;
