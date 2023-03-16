import styled from "styled-components";

const Row = styled.div<{
  flex?: string | number;
  justifyContent?: string | number;
  alignItems?: string | number;
  bg?: string;
  margin?: string | number;
  padding?: string | number;
  position?: string;
  height?: string;
  gap?: string;
}>`
  align-items: ${({ alignItems }) => (alignItems ? alignItems : "")};
  background: ${({ bg }) => (bg ? bg : "")};
  display: flex;
  flex: ${({ flex }) => (flex ? flex : "")};
  gap: ${({ gap }) => (gap ? gap : "")};
  height: ${({ height }) => (height ? height : "")};
  justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : ""};
  margin: ${({ margin }) => (margin ? margin : "")};
  padding: ${({ padding }) => (padding ? padding : "")};
  position: ${({ position }) => (position ? position : "")};
`;

export default Row;
