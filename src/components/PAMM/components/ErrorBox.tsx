import styled from "styled-components";
import { AiOutlineWarning, AiOutlineInfoCircle } from "react-icons/ai";
import { useContext } from "react";
import { PAMMContext } from "../../../contexts/PAMM";

const ErrorBox = () => {
  let { error } = useContext(PAMMContext);

  const isInfo =
    error.includes("DRY MINT INFO") ||
    error.includes("DRY REDEEM INFO") ||
    error.includes("RESERVE INFO");

  return error ? (
    <Container isInfo={isInfo}>
      {isInfo ? (
        <AiOutlineInfoCircle fontSize="20px" style={{ minWidth: "25px" }} />
      ) : (
        <AiOutlineWarning fontSize="20px" style={{ minWidth: "25px" }} />
      )}
      {error.length > 300 ? error.slice(0, 300) + "..." : error}
      {error.length > 300 && !isInfo ? (
        <>
          <br />
          Check console for more details
        </>
      ) : null}
    </Container>
  ) : null;
};

export default ErrorBox;

const Container = styled.div<{ isInfo: boolean }>`
  align-items: center;
  background: ${({ isInfo }) =>
    isInfo ? "rgba(240, 255, 155, 0.24)" : "rgba(198, 70, 42, 0.24)"};
  border-radius: 20px;
  box-sizing: border-box;
  display: flex;
  color: ${({ isInfo, theme }) => (isInfo ? theme.colors.warning : "#c6462a")};
  gap: 10px;
  justify-content: center;
  margin: 0 auto 20px;
  max-width: 500px;
  padding: 16px;
  width: 500px;
`;
