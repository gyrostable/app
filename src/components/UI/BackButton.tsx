import { useRouter } from "next/router";
import styled from "styled-components";
import { FaChevronLeft } from "react-icons/fa";

const BackButton = ({
  onClick,
  light,
}: {
  onClick?: () => void;
  light?: boolean;
}) => {
  const router = useRouter();

  if (!onClick) onClick = () => router.back();

  return (
    <BackbuttonContainer light={light} id="back-button" onClick={onClick}>
      <FaChevronLeft fontSize="14px" />
    </BackbuttonContainer>
  );
};

const BackbuttonContainer = styled.div<{ light?: boolean }>`
  align-items: center;
  background: ${({ theme, light }) =>
    light ? theme.colors.highlight : theme.colors.highlightDark};
  border: ${({ theme, light }) =>
    light ? "0.5px solid " + theme.colors.highlightLight : ""};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  height: 48px;
  margin-bottom: ${({ light }) => (light ? "0" : "36px")};
  justify-content: center;
  transition: all 0.2s ease-in-out;
  width: 48px;

  &:hover {
    background: ${({ theme, light }) =>
      light ? theme.colors.highlightLight : theme.colors.highlight};
  }
`;

export default BackButton;
