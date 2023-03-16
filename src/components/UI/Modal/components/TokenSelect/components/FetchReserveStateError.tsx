import styled from "styled-components";
import { AiOutlineWarning } from "react-icons/ai";

const FetchReserveStateError = () => {
  return (
    <ErrorContainer>
      <AiOutlineWarning fontSize="20px" />
      Error fetching Gyro Reserve Data
    </ErrorContainer>
  );
};

export default FetchReserveStateError;

const ErrorContainer = styled.div`
  align-items: center;
  background: rgba(198, 70, 42, 0.24);
  border-radius: 79px;
  box-sizing: border-box;
  display: flex;
  color: #c6462a;
  gap: 10px;
  justify-content: center;
  margin: 50px auto;
  padding: 16px;
  width: 500px;
`;
