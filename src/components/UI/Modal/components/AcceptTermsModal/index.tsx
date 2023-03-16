import styled from "styled-components";
import { useRollbar } from "@rollbar/react";
import { useContext, useState } from "react";
import Row from "../../../Row";
import { ModalContext } from "../../../../../contexts/Modal";
import { Web3Context } from "../../../../../contexts/Web3";
import fetchIp from "../../../../../utils/api/fetchIp";
import storeAcceptance from "../../../../../utils/api/storeAcceptance";
import Checkbox from "../../../Checkbox";

const AcceptTermsModal = () => {
  const [accepted, setAccepted] = useState(false);
  const { setModalOpen, setModalPayload, disappear } = useContext(ModalContext);
  const { account } = useContext(Web3Context);

  const rollbar = useRollbar();

  async function onContinue() {
    if (account) {
      disappear();
      setModalPayload(null);
      setModalOpen("");
      try {
        const ip = await fetchIp();
        await storeAcceptance(ip, account);
        localStorage.setItem("acceptedTerms:" + account, "true");
      } catch (e: any) {
        console.error(e);
        rollbar.warning(
          "Error storing user's terms and conditions acceptance: " +
            (e.message ?? e)
        );
      }
    }
  }

  return (
    <Container>
      <p>
        Please accept the Terms of Service and Privacy Policy to continue using
        the application.
      </p>
      <LinksContainer>
        <a
          href="https://gyro.finance/terms-of-service/"
          rel="noreferrer"
          target="_blank"
        >
          View Terms of Service
        </a>
        <a
          href="https://gyro.finance/privacy-policy"
          rel="noreferrer"
          target="_blank"
        >
          View Privacy Policy
        </a>
      </LinksContainer>

      <Row alignItems="center" justifyContent="center">
        <TickMessage style={{ marginRight: "10px" }}>
          I agree to the Terms of Service and Privacy Policy
        </TickMessage>

        <CheckboxContainer
          id="terms-checkbox"
          onClick={() => setAccepted((prev) => !prev)}
        >
          <Checkbox isChecked={accepted} />
        </CheckboxContainer>
      </Row>
      <Button
        id="terms-accept-button"
        disabled={!accepted}
        onClick={onContinue}
      >
        CONTINUE
      </Button>
    </Container>
  );
};

const Container = styled.div`
  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: underline;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  align-items: center;
  box-sizing: border-box;
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.highlightDark : theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.highlight : theme.colors.dark};
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  display: flex;
  font-weight: 900;
  margin: 20px auto 10px;
  justify-content: center;
  padding: 12px;
  transition: all 0.2s ease-in-out;
  width: 140px;

  &:hover {
    background: ${({ theme, disabled }) =>
      disabled ? theme.colors.highlightDark : theme.colors.offWhite};
  }
`;

const TickMessage = styled.p`
  color: ${({ theme }) => theme.colors.white};
  margin-right: 10px;
  transition: all 0.2s ease-in-out;
`;

const CheckboxContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  opacity: 1;
  transition: all 0.2s ease-in-out;
`;

const LinksContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px 0 35px;

  a {
    margin: 15px 0;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
  }
`;

export default AcceptTermsModal;
