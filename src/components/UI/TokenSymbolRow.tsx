import styled from "styled-components";
import Image from "./Image";
import tokenImageSrcMap from "../../constants/tokenImageSrcMap";

const TokenSymbolRow = ({
  symbols,
  size = 36,
}: {
  symbols: string[];
  size?: number;
}) => {
  return (
    <SymbolsContainer size={size} length={symbols.length}>
      {symbols.map((symbol, index) => (
        <ImageContainer
          key={index}
          size={size}
          left={index * 50 + "%"}
          zIndex={(symbols.length ?? 0) - index}
        >
          {tokenImageSrcMap[symbol.toUpperCase() as string] ? (
            <Image
              src={tokenImageSrcMap[symbol.toUpperCase() as string]}
              alt={symbol + " token image"}
              height={size}
              width={size}
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <NoImageToken size={size}>{symbol}</NoImageToken>
          )}
        </ImageContainer>
      ))}
    </SymbolsContainer>
  );
};

export default TokenSymbolRow;

const SymbolsContainer = styled.div<{ size: number; length: number }>`
  height: ${({ size }) => size}px;
  position: relative;
  width: ${({ size, length }) => size * (1 + (length - 1) / 2)}px;
  margin-right: 5px;
`;

const NoImageToken = styled.div<{ size: number }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 50%;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  font-size: ${({ size }) => size / 3.6}px;
  font-weight: 700;
  height: ${({ size }) => size}px;
  justify-content: center;
  width: ${({ size }) => size}px;
`;

const ImageContainer = styled.div<{
  left: string;
  zIndex: number | string;
  size: number;
}>`
  left: 0;
  position: absolute;
  height: ${({ size }) => size}px;
  transform: translateX(${({ left }) => left});
  width: ${({ size }) => size}px;
  z-index: ${({ zIndex }) => zIndex};
`;
