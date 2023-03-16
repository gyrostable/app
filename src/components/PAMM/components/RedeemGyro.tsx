import styled from "styled-components";
import { useState, useContext, useEffect } from "react";
import { VscClose } from "react-icons/vsc";
import { Title } from "./StyledComponents";
import QuantityInputSingle from "../../UI/QuantityInputSingle";
import { PAMMContext } from "../../../contexts/PAMM";
import TokenSymbolRow from "../../UI/TokenSymbolRow";
import SlippageTable from "./SlippageTable";
import { Web3Context } from "../../../contexts/Web3";
import destructureUnderlierSymbols from "../../../utils/destructureUnderlierSymbols";
import BalancedMintRedeemSwitch from "./BalancedMintRedeemSwitch";
import Button from "../../UI/Button";

const RedeemGyro = () => {
  const {
    onSelectRedeemTokens,
    selectedRedeemTokens,
    setSelectedRedeemTokens,
    redeemStage,
    redeemBalance,
    setRedeemBalance,
    gydTokenData,
    redeeming,
    underlierTokens,
  } = useContext(PAMMContext);

  const { provider } = useContext(Web3Context);

  const [fieldValue, setFieldValue] = useState("");

  const removeToken = (index: number) => {
    setSelectedRedeemTokens((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1, prev.length),
    ]);
  };

  useEffect(() => {
    if (redeeming) setFieldValue("");
  }, [redeeming]);

  return redeemStage === "tokenSelection" ? (
    <>
      <Title>Add Redeem asset(s)</Title>
      <BalancedMintRedeemSwitch />
      <QuantityInputSingle
        redeem
        onSelectToken={provider ? onSelectRedeemTokens : undefined}
        tokenData={gydTokenData ?? undefined}
        fieldValue={fieldValue}
        setFieldValue={setFieldValue}
        value={redeemBalance}
        setValue={setRedeemBalance}
        tokenMaxAllowed={true}
      />
      <Button
        onClick={provider ? onSelectRedeemTokens : undefined}
        disabled={underlierTokens.length === selectedRedeemTokens.length}
      >
        Select Redeem Asset(s)
      </Button>
      <RedeemTokensContainer>
        {selectedRedeemTokens.map((tokenData, index) => (
          <RedeemTokenTag key={index}>
            <TokenSymbolRow
              symbols={destructureUnderlierSymbols(tokenData.symbol)}
              size={20}
            />
            <p>{tokenData.name}</p>
            <RemoveButton
              onClick={() => {
                removeToken(index);
              }}
            >
              <VscClose fontSize="15px" color="white" />
            </RemoveButton>
          </RedeemTokenTag>
        ))}
      </RedeemTokensContainer>
    </>
  ) : (
    <>
      <Title>Overview </Title>
      <SlippageTable />
    </>
  );
};

export default RedeemGyro;

const RedeemTokenTag = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  border: 1px solid ${({ theme }) => theme.colors.highlightLight};
  border-radius: 39px;
  display: flex;
  gap: 10px;
  padding: 10px;

  p {
    margin: 0;
  }
`;

const RedeemTokensContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const RemoveButton = styled.div`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.highlightVeryLight};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.highlightLight};
  display: flex;
  cursor: pointer;
  height: 18px;
  justify-content: center;
  outline: none;
  padding: 0;
  width: 18px;
`;
