import { AiOutlineInfoCircle } from "react-icons/ai";
import { useState } from "react";
import styled from "styled-components";

let mouseOutCount = 0;

const Tooltip = ({
  message,
  toLeft,
}: {
  message: string | string[];
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
    <Container>
      <AiOutlineInfoCircle
        onMouseOver={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        size="18px"
        style={{ marginLeft: "7px", cursor: "pointer" }}
      />
      {rendered && (
        <Box toLeft={toLeft} opaque={opaque}>
          {Array.isArray(message)
            ? message.map((m, index) => <p key={index}>{m}</p>)
            : message}
        </Box>
      )}
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
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

  p {
    margin: 3px 0;
  }
`;

export default Tooltip;
