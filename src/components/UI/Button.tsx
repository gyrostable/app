import styled from "styled-components";

const Button = styled.button<{
  margin?: string;
  disabled?: boolean;
  width?: string;
}>`
  align-items: center;
  background: ${({ theme }) => theme.colors.highlight};
  border: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  display: flex;
  margin: ${({ margin }) => (margin ? margin : "")};
  height: 48px;
  justify-content: center;
  outline: none;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s ease-in-out;
  width: ${({ width }) => (width ? width : "100%")};

  &:hover {
    background: ${({ theme, disabled }) =>
      !disabled ? theme.colors.highlightLight : ""};
  }
`;

export default Button;
