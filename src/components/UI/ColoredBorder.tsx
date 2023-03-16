import styled from "styled-components";

const ColoredBorder = styled.div<{ borderRadius: string }>`
  background: linear-gradient(
    90deg,
    rgba(243, 255, 167) 0%,
    rgba(242, 227, 196) 35.94%,
    rgba(237, 187, 250) 63.54%,
    rgba(170, 241, 244) 100%
  );
  border-radius: ${({ borderRadius }) => borderRadius};
  padding: 1px;
`;

export default ColoredBorder;
