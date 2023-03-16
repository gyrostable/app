import styled from "styled-components";

const Column = styled.div<{
  flex?: string | number;
  justifyContent?: string | number;
  alignItems?: string | number;
  bg?: string;
  gap?: string;
  height?: string | number;
  margin?: string | number;
  maxWidth?: string;
  padding?: string | number;
}>`
  align-items: ${({ alignItems }) => (alignItems ? alignItems : "")};
  background: ${({ bg }) => (bg ? bg : "")};
  display: flex;
  flex: ${({ flex }) => (flex ? flex : "")};
  flex-direction: column;
  gap: ${({ gap }) => (gap ? gap : "")};
  height: ${({ height }) => (height ? height : "")};
  justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : ""};
  margin: ${({ margin }) => (margin ? margin : "")};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : "")};
  padding: ${({ padding }) => (padding ? padding : "")};
`;

export default Column;
