import styled from "styled-components";

const Loading = styled.div<{
  height: string;
  width: string;
  loading?: boolean;
  margin?: string;
}>`
  animation: shimmerBackground 10s infinite;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.highlightDark} 4%,
    ${({ theme }) => theme.colors.highlight} 25%,
    ${({ theme }) => theme.colors.highlightDark} 36%
  );
  background-size: 1000px 100%;
  margin: ${({ margin }) => (margin ? margin : "")};
  transition: all 0.2s ease-in-out;
  height: ${({ height }) => height};
  width: ${({ width }) => width};

  @keyframes shimmerBackground {
    0% {
      background-position: -5000px 0;
    }
    100% {
      background-position: 5000px 0;
    }
  }
`;

export default Loading;
