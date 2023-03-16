import { ReactNode, useState, useRef, useEffect } from "react";
import Context from "./Context";
import { ModalOpenType } from "./Context";
import useDisappearing from "../../hooks/useDisappearing";

const Provider = ({ children }: { children: ReactNode }) => {
  const [modalOpen, setModalOpen] = useState<ModalOpenType>("");
  const [modalPayload, setModalPayload] = useState<any>(null);
  const { open, visible, appear, disappear } = useDisappearing();

  const modalOpenCount = useRef(0);

  useEffect(() => {
    modalOpen && appear();
  }, [modalOpen, appear]);

  function onClose() {
    disappear();
    if (modalPayload?.onClose) {
      modalPayload.onClose();
    }
    let currentModalOpenCount = modalOpenCount.current;
    setModalOpen("");
    setTimeout(() => {
      if (currentModalOpenCount + 1 === modalOpenCount.current) {
        setModalPayload(null);
      }
    }, 100);
  }

  useEffect(() => {
    modalOpenCount.current++;
  }, [modalOpen]);

  return (
    <Context.Provider
      value={{
        modalOpen,
        setModalOpen,
        modalPayload,
        setModalPayload,
        onClose,
        open,
        visible,
        disappear,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
