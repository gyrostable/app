import styled from "styled-components";
import { BsCheck2 } from "react-icons/bs";
import theme from "../../styles/theme";

const Checkbox = ({ isChecked }: { isChecked: boolean }) => {
  return (
    <CheckboxButton isChecked={isChecked}>
      {isChecked && <BsCheck2 color={theme.colors.dark} fontSize={14} />}
    </CheckboxButton>
  );
};

const CheckboxButton = styled.div<{ isChecked: boolean }>`
  align-items: center;
  background: ${({ isChecked, theme }) =>
    isChecked
      ? `linear-gradient(
      90deg,
      rgba(243, 255, 167) 0%,
      rgba(242, 227, 196) 35.94%,
      rgba(237, 187, 250) 63.54%,
      rgba(170, 241, 244) 100%
    )`
      : theme.colors.highlight};
  border: 1px solid ${({ theme }) => theme.colors.highlightLight};
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  height: 18px;
  justify-content: center;
  outline: none;
  width: 18px;
`;

export default Checkbox;
