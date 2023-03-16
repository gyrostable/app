import styled from "styled-components";

const LoadingAnimation = ({
  size,
  margin,
  color,
}: {
  size: string | number;
  margin?: string;
  color?: string;
}) => {
  return (
    <Container size={size} margin={margin} color={color}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Container>
  );
};

const Container = styled.div<{
  size: string | number;
  margin?: string;
  color?: string;
}>`
  display: inline-block;
  margin: ${({ margin }) => (margin ? margin : "")};
  position: relative;
  width: ${({ size }) => size + "px"};
  height: ${({ size }) => size + "px"};

  div {
    position: absolute;
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: ${({ color, theme }) => (color ? color : theme.colors.white)};
    animation: animation-grid-dots 1.2s linear infinite;
  }
  div:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  div:nth-child(2) {
    top: 10%;
    left: 40%;
    animation-delay: -0.4s;
  }
  div:nth-child(3) {
    top: 10%;
    left: 70%;
    animation-delay: -0.8s;
  }
  div:nth-child(4) {
    top: 40%;
    left: 10%;
    animation-delay: -0.4s;
  }
  div:nth-child(5) {
    top: 40%;
    left: 40%;
    animation-delay: -0.8s;
  }
  div:nth-child(6) {
    top: 40%;
    left: 70%;
    animation-delay: -1.2s;
  }
  div:nth-child(7) {
    top: 70%;
    left: 10%;
    animation-delay: -0.8s;
  }
  div:nth-child(8) {
    top: 70%;
    left: 40%;
    animation-delay: -1.2s;
  }
  div:nth-child(9) {
    top: 70%;
    left: 70%;
    animation-delay: -1.6s;
  }
  @keyframes animation-grid-dots {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export default LoadingAnimation;
