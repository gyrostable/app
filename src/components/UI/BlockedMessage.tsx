import styled from "styled-components";

const BlockedMessage = ({ message }: { message: string }) => {
  return (
    <Container>
      <p>{message}</p>
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  display: flex;
  height: calc(100vh - 527px);
  justify-content: center;
`;

export default BlockedMessage;
