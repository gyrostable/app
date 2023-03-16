import styled from "styled-components";

const HorizontalRule = styled.div<{ bg?: string }>`
  background: ${({ theme, bg }) => (bg ? bg : theme.colors.highlight)};
  height: 1px;
  width: 100%;
`;

export default HorizontalRule;
