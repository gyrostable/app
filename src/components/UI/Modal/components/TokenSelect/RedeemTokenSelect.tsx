import { Dispatch, SetStateAction, useContext } from "react";
import styled from "styled-components";
import { ModalContext } from "../../../../../contexts/Modal";
import { WalletTokenDataType } from "../../../../../contexts/Wallet/Context";
import SelectTokenRow from "./components/SelectTokenRow";
import FetchReserveStateError from "./components/FetchReserveStateError";
import ModalLoadingAnimation from "./components/ModalLoadingAnimation";
import isBalancerLPToken from "../../../../../utils/dsm/isBalancerLPToken";
import { DataTypes } from "../../../../../../types/typechain/ReserveManager";
import { ONE, ZERO } from "../../../../../constants/misc";

type RedeemTokenModalPayloadType = {
  underlierTokens: WalletTokenDataType[];
  setSelectedRedeemTokens: Dispatch<SetStateAction<WalletTokenDataType[]>>;
  selectedRedeemTokens: WalletTokenDataType[];
  fetchReserveStateStatus: FetchType;
  reserveState: DataTypes.ReserveStateStructOutput;
};

const RedeemTokenSelect = () => {
  const {
    onClose,
    modalPayload: {
      underlierTokens,
      setSelectedRedeemTokens,
      selectedRedeemTokens,
      fetchReserveStateStatus,
      reserveState,
    },
  }: {
    onClose: () => void;
    modalPayload: RedeemTokenModalPayloadType;
  } = useContext(ModalContext);

  const onSelect = (tokenData: WalletTokenDataType) => {
    onClose();
    // Add delay to prevent jerky animation
    setTimeout(
      () => setSelectedRedeemTokens((prev) => [...prev, tokenData]),
      100
    );
  };

  const redemptionUnderlierTokens = underlierTokens.map((tokenData) => {
    const vault = reserveState.vaults.find(
      ({ underlying }) => underlying === tokenData.address
    );

    return {
      ...tokenData,
      balance: vault?.reserveBalance ?? ZERO,
      price: vault?.price ?? ZERO,
      value:
        vault?.reserveBalance && vault?.price
          ? vault.reserveBalance.mul(vault.price).div(ONE)
          : ZERO,
    };
  });

  const unselectedTokens = redemptionUnderlierTokens.filter(
    ({ address }) =>
      !selectedRedeemTokens.map(({ address }) => address).includes(address)
  );

  const balancerTokens = unselectedTokens.filter(isBalancerLPToken);
  const otherTokens = unselectedTokens.filter(
    (tokenData) => !isBalancerLPToken(tokenData)
  );

  return (
    <Container>
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
                    onSelect(tokenData);
                  }}
                  isRedeem
                />
              ))}
              {Boolean(otherTokens.length) && <Title>Other Asset(s)</Title>}
              {otherTokens.map((tokenData, index) => (
                <SelectTokenRow
                  data={tokenData}
                  key={index}
                  onClick={() => {
                    onSelect(tokenData);
                  }}
                  isRedeem
                />
              ))}
            </>
          ),
          failed: <FetchReserveStateError />,
        }[fetchReserveStateStatus]
      }
    </Container>
  );
};

const Container = styled.div``;

const Title = styled.p`
  margin-left: 12px;
  text-transform: uppercase;
`;

export default RedeemTokenSelect;
