import styled from "styled-components";
import { AiOutlineWarning } from "react-icons/ai";
import Row from "../../UI/Row";
import { useContext } from "react";
import { PAMMContext } from "../../../contexts/PAMM";

const PAMMCappedWarning = () => {
  const { totalPercCap, userPercCap, stablecoinSymbol } =
    useContext(PAMMContext);

  return (
    <Container>
      <Row alignItems="center" justifyContent="center" height="35px">
        <AiOutlineWarning size="18" style={{ marginRight: "5px" }} />
        <h5>Gyro {stablecoinSymbol === "p-GYD" ? "Proto " : ""}is capped</h5>
      </Row>
      {totalPercCap !== null && <p>DSM is at {totalPercCap}% of global cap.</p>}
      {userPercCap !== null && (
        <p>User is at {userPercCap}% of per address cap.</p>
      )}
    </Container>
  );
};

export default PAMMCappedWarning;

const Container = styled.div`
  align-items: left;
  background: ${({ theme }) => theme.colors.warning};
  border-radius: 8px;
  box-sizing: border-box;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  margin-top: 22px;
  padding: 20px;
  width: 340px;

  p {
    margin: 0;
  }
`;
