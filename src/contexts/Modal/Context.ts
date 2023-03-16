import { createContext, Dispatch, SetStateAction } from "react";

export type ModalOpenType =
  | "acceptTerms"
  | "join"
  | "exit"
  | "mintTokenSelect"
  | "minting/redeeming"
  | "redeemTokenSelect"
  | "warning"
  | "connectWallet"
  | "";

type ModalContextProps = {
  modalOpen: ModalOpenType;
  setModalOpen: Dispatch<SetStateAction<ModalOpenType>>;
  modalPayload: any;
  setModalPayload: Dispatch<SetStateAction<any>>;
  onClose: () => void;
  open: boolean;
  visible: boolean;
  disappear: () => void;
};

const Context = createContext<ModalContextProps>({
  modalOpen: "",
  setModalOpen: () => {},
  modalPayload: null,
  setModalPayload: () => {},
  onClose: () => {},
  open: false,
  visible: false,
  disappear: () => {},
});

export default Context;
