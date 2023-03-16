import styled from "styled-components";
import LoadingAnimation from "../../../../LoadingAnimation";

const ModalLoadingAnimation = () => {
  return (
    <LoadingAnimationContainer>
      <LoadingAnimation size="50" margin="auto" />
    </LoadingAnimationContainer>
  );
};

export default ModalLoadingAnimation;

const LoadingAnimationContainer = styled.div`
  align-items: center;
  display: flex;
  height: 200px;
  justify-content: center;
`;
