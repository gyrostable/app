import styled from "styled-components";
import { useContext } from "react";
import { formatFixed } from "@ethersproject/bignumber";
import formatBigNumberString from "../../../utils/formatBigNumberString";
import { PAMMContext } from "../../../contexts/PAMM";
import { ZERO } from "../../../constants/misc";
import { Web3Context } from "../../../contexts/Web3";

const MintAllowanceWarning = () => {
  const { account } = useContext(Web3Context);
  const { userCap, gydTokenData, stablecoinSymbol } = useContext(PAMMContext);

  const remainingCap = userCap?.sub(gydTokenData?.balance || ZERO);

  return remainingCap && account ? (
    <MintCapWarningText>
      Your current mint allowance is limited to{" "}
      {formatBigNumberString(formatFixed(remainingCap, 18), 2, 4)}{" "}
      {stablecoinSymbol}
    </MintCapWarningText>
  ) : null;
};

export default MintAllowanceWarning;

const MintCapWarningText = styled.p`
  color: ${({ theme }) => theme.colors.warning};
  margin: 0;
  text-align: center;
`;
