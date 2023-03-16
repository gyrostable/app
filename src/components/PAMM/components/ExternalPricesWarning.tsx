import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Row from "../../UI/Row";
import { useContext } from "react";
import { PAMMContext } from "../../../contexts/PAMM";

const ExternalPricesWarning = () => {
  const { backupData } = useContext(PAMMContext);

  return backupData ? (
    <Container>
      <Row alignItems="center" justifyContent="center" height="35px">
        <AiOutlineInfoCircle size="18" style={{ marginRight: "5px" }} />
        <h5>Using external prices </h5>
      </Row>
      Could not fetch prices from Gyroscope price oracle. Price data has been
      fetched from CoinGecko API instead.
    </Container>
  ) : null;
};

export default ExternalPricesWarning;

const Container = styled.div`
  align-items: left;
  background: ${({ theme }) => theme.colors.highlightDark};
  border-radius: 8px;
  box-sizing: border-box;
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
