import styled from "styled-components";

export const Title = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.highlight};
  font-size: 12px;
  text-transform: uppercase;
  padding-bottom: 8px;
`;

export const InfoText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.offWhite};
  margin: 0;
`;
