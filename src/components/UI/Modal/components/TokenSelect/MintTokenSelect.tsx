import { useContext, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { ModalContext } from "../../../../../contexts/Modal";
import { WalletTokenDataType } from "../../../../../contexts/Wallet/Context";
import FetchReserveStateError from "./components/FetchReserveStateError";
import ModalLoadingAnimation from "./components/ModalLoadingAnimation";
import SelectTokenRow from "./components/SelectTokenRow";
import isBalancerLPToken from "../../../../../utils/dsm/isBalancerLPToken";

type MintTokenModalPayloadType = {
  underlierTokens: WalletTokenDataType[];
  setSelectedMintTokens: Dispatch<SetStateAction<WalletTokenDataType[]>>;
  selectedMintTokens: WalletTokenDataType[];
  setMintBalances: Dispatch<SetStateAction<string[]>>;
  fetchReserveStateStatus: FetchType;
};

const MintTokenSelect = () => {
  const {
    onClose,
    modalPayload: {
      underlierTokens,
      setSelectedMintTokens,
      selectedMintTokens,
      setMintBalances,
      fetchReserveStateStatus,
    },
  }: {
    onClose: () => void;
    modalPayload: MintTokenModalPayloadType;
  } = useContext(ModalContext);

  const addToSelectedTokens = (tokenData: WalletTokenDataType) => {
    setSelectedMintTokens((prev) => [...prev, tokenData]);
    setMintBalances((prev) => [...prev, "0"]);
  };

  const unselectedTokens = underlierTokens.filter(
    ({ address }) =>
      !selectedMintTokens.map(({ address }) => address).includes(address)
  );

  const balancerTokens = unselectedTokens.filter(isBalancerLPToken);
  const otherTokens = unselectedTokens.filter(
    (tokenData) => !isBalancerLPToken(tokenData)
  );

  return (
    <>
      {
        {
          fetching: <ModalLoadingAnimation />,
          success: (
            <>
              {Boolean(balancerTokens.length) && (
                <Title>Balancer LP Asset(s)</Title>
              )}
              {balancerTokens.map((tokenData, index) => (
                <SelectTokenRow
                  data={tokenData}
                  key={index}
                  onClick={() => {
                    onClose();
                    // Add delay to prevent jerky animation
                    setTimeout(() => addToSelectedTokens(tokenData), 100);
                  }}
                />
              ))}
              {Boolean(otherTokens.length) && <Title>Other Asset(s)</Title>}
              {otherTokens.map((tokenData, index) => (
                <SelectTokenRow
                  data={tokenData}
                  key={index}
                  onClick={() => {
                    onClose();
                    // Add delay to prevent jerky animation
                    setTimeout(() => addToSelectedTokens(tokenData), 100);
                  }}
                />
              ))}
            </>
          ),
          failed: <FetchReserveStateError />,
        }[fetchReserveStateStatus]
      }
    </>
  );
};

const Title = styled.p`
  margin-left: 12px;
  text-transform: uppercase;
`;

export default MintTokenSelect;
