import styled from "styled-components";
import { useEffect, useState } from "react";

const LoadingDots = () => {
  const [number, setNumber] = useState(1);

  useEffect(() => {
    function animate() {
      setNumber((prev) => (prev === 3 ? 1 : prev + 1));
    }
    setInterval(animate, 500);
  }, []);

  return (
    <span>
      <Dot index={0}>.</Dot>
      <Dot index={1}>.</Dot>
      <Dot index={2}>.</Dot>
    </span>
  );
};

export default LoadingDots;
const Dot = styled.span<{ index: number }>`
  opacity: 1;
  animation: flash 1s infinite;
  animation-delay: ${({ index }) => (index ? index * 0.3 + "s" : "")};

  @keyframes flash {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;
