import { useContext, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import styled from "styled-components";
import { ModalContext } from "../../../contexts/Modal";
import HorizontalRule from "./../HorizontalRule";
import Row from "./../Row";
import ConnectWalletModal from "./components/ConnectWalletModal";

const Modal = () => {
  const { modalOpen, setModalOpen, modalPayload, onClose, open, visible } =
    useContext(ModalContext);

  const noCloseOnClickOutside = modalPayload?.noCloseOnClickOutside ?? false;
  const noCloseButton = modalPayload?.noCloseButton ?? false;

  useEffect(() => {
    function eventListener(event: MouseEvent) {
      const container = document.getElementById("modal-container");
      var isClickInsideElement = container?.contains(event.target as Node);
      if (!isClickInsideElement && !noCloseOnClickOutside) {
        onClose();
      }
    }

    if (modalOpen) {
      setTimeout(() => document.addEventListener("click", eventListener), 0); // Wrap in promise to prevent eventListener firing too early
      return () => document.removeEventListener("click", eventListener);
    }
  }, [modalOpen, noCloseOnClickOutside, setModalOpen]);

  return open ? (
    <>
      <Overlay visible={visible} />
      <ScreenContainer>
        {modalOpen === "connectWallet" ? (
          <ConnectWalletModal visible={visible} />
        ) : (
          <Container visible={visible} id="modal-container">
            <Row
              margin="9px 0 33px 0"
              justifyContent="space-between"
              alignItems="center"
            >
              <Header>{modalPayload?.header}</Header>
              {!noCloseButton && (
                <CloseButtonContainer onClick={onClose} id="modal-close-button">
                  <CgClose fontSize="20px" />
                </CloseButtonContainer>
              )}
            </Row>
            <HorizontalRule />
            <Body>{modalPayload?.body}</Body>
          </Container>
        )}
      </ScreenContainer>
    </>
  ) : null;
};

const Overlay = styled.div<{ visible: boolean }>`
  backdrop-filter: blur(${({ visible }) => (visible ? 2 : 0)}px);
  height: calc(max(100% - 430px, 0px));
  position: absolute;
  transition: all 0.2s ease-in-out;
  width: 100%;
  z-index: 10;
`;

const ScreenContainer = styled.div`
  align-items: center;
  display: flex;
  min-height: calc(100vh - 101px);
  justify-content: center;
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;

const Container = styled.div<{ visible: boolean }>`
  background: #343a46;
  box-shadow: 0px 4px 80px rgba(0, 0, 0, 0.24);
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.highlightDark};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 600px;
  max-width: 600px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  padding: 24px;
  transition: all 0.2s ease-in-out;
`;

const Body = styled.div`
  flex: 1;
  padding-top: 24px;
  position: relative;
`;

const Header = styled.h5`
  margin: 0;
`;

const CloseButtonContainer = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  height: 48px;

  justify-content: center;
  transition: all 0.2s ease-in-out;
  width: 48px;

  &:hover {
    background: ${({ theme }) => theme.colors.highlightLight};
  }
`;

const Square = styled.div`
  width: 100px;
  height: 100px;
  background: red;
  position: fixed;
  top: 0;
  left: 0;
`;

export default Modal;
