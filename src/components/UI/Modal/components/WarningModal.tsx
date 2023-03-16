import { useContext } from "react";
import styled from "styled-components";
import { AiOutlineWarning } from "react-icons/ai";
import { ModalContext } from "../../../../contexts/Modal";
import Column from "../../Column";

const WarningModal = () => {
  const {
    modalPayload,
  }: {
    modalPayload: {
      warning: string;
      warningMessage: string;
    };
  } = useContext(ModalContext);

  const { warning, warningMessage } = modalPayload;

  return (
    <Container>
      <Column gap="15px" alignItems="center">
        <AiOutlineWarning size="40" />
        <h5>{warning}</h5>
      </Column>
      {warningMessage}
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 0;

  h5 {
    margin: 0;
  }
`;

export default WarningModal;
