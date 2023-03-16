import { useState } from "react";
import styled from "styled-components";
import { AiOutlineWarning } from "react-icons/ai";

let mouseOutCount = 0;

const WarningIcon = ({
  message,
  toLeft,
}: {
  message?: string;
  toLeft?: boolean;
}) => {
  const [opaque, setOpaque] = useState(false);
  const [rendered, setRendered] = useState(false);

  function setVisible(newValue: boolean) {
    if (newValue) {
      setRendered(true);
      setTimeout(() => setOpaque(true), 0);
    } else {
      const currentMouseOutCount = ++mouseOutCount;
      setOpaque(false);
      setTimeout(
        () => currentMouseOutCount === mouseOutCount && setRendered(false),
        200
      );
    }
  }
  return (
    <Container
      onMouseOver={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <AiOutlineWarning size="20" fill="black" />
      {rendered && (
        <Box toLeft={toLeft} opaque={opaque}>
          {message}
        </Box>
      )}
    </Container>
  );
};

export default WarningIcon;

const Container = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.warning};
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  height: 30px;
  position: relative;
  width: 30px;
`;

const Box = styled.div<{ opaque: boolean; toLeft?: boolean }>`
  background: ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  box-shadow: 0px 4px 10px 10px rgba(0, 0, 0, 0.24);
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  left: ${({ toLeft }) => (toLeft ? "" : "40px")};
  opacity: ${({ opaque }) => (opaque ? 1 : 0)};
  padding: 10px;
  position: absolute;
  right: ${({ toLeft }) => (toLeft ? "30px" : "")};
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;
  width: 250px;
  z-index: 100;
`;
