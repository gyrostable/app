import { useContext, useState } from "react";
import { useEffect } from "react";
import { ModalContext } from "../../contexts/Modal";
import MintTokenSelect from "../../components/UI/Modal/components/TokenSelect/MintTokenSelect";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { Web3Context } from "../../contexts/Web3";

const useMintState = (
  underlierTokens: WalletTokenDataType[],
  fetchReserveStateStatus: FetchType,
  reserveState: DataTypes.ReserveStateStructOutput | null
) => {
  const { setModalOpen, modalPayload, setModalPayload } =
    useContext(ModalContext);

  const { account } = useContext(Web3Context);

  const [minting, setMinting] = useState(false);
  const [selectedMintTokens, setSelectedMintTokens] = useState<
    WalletTokenDataType[]
  >([]);
  const [mintSlippage, setMintSlippage] = useState(0.15);
  const [mintBalances, setMintBalances] = useState<string[]>([]);
  const [isBalancedMint, setIsBalancedMint] = useState(false);
  const [isMintAllowed, setIsMintAllowed] = useState(false);
  const [mintAttempt, setMintAttempt] = useState(0);

  useEffect(() => {
    // Ensure modal payload is up-to-date
    if (modalPayload?.header === "Select Mint Asset(s)") {
      setModalPayload({
        header: "Select Mint Asset(s)",
        body: <MintTokenSelect />,
        underlierTokens,
        setSelectedMintTokens,
        selectedMintTokens,
        setMintBalances,
        fetchReserveStateStatus,
      });
    }
  }, [
    underlierTokens,
    setSelectedMintTokens,
    selectedMintTokens,
    setMintBalances,
    fetchReserveStateStatus,
  ]);

  useEffect(() => {
    if (reserveState) {
      const mintTokens = underlierTokens.filter(({ address }) => {
        const vault = reserveState.vaults.find(
          ({ underlying }) => underlying === address
        );
        return vault && !vault.idealWeight.isZero();
      });

      if (mintBalances.length !== mintTokens.length) {
        setIsBalancedMint(false);
      }
    }
  }, [mintBalances]);

  function onSelectMintToken() {
    setModalPayload({
      header: "Select Mint Asset(s)",
      body: <MintTokenSelect />,
      underlierTokens,
      setSelectedMintTokens,
      selectedMintTokens,
      setMintBalances,
      fetchReserveStateStatus,
    });
    setModalOpen("mintTokenSelect");
  }

  function setAutoMintSlippage() {
    setMintSlippage(0.15);
  }

  function toggleMintBalanced() {
    if (!account || !reserveState || !underlierTokens.length) return false;
    setIsBalancedMint((prev) => {
      if (prev === false && reserveState) {
        setSelectedMintTokens(
          underlierTokens.filter(({ address }) => {
            const vault = reserveState.vaults.find(
              ({ underlying }) => underlying === address
            );
            return !!vault && !vault.idealWeight.isZero();
          })
        );
      }

      return !prev;
    });
  }

  useEffect(() => {
    if (!account) setIsBalancedMint(false);
  }, [account]);

  return {
    onSelectMintToken,
    selectedMintTokens,
    setSelectedMintTokens,
    minting,
    setMinting,
    mintSlippage,
    setMintSlippage,
    setAutoMintSlippage,
    mintBalances,
    setMintBalances,
    isBalancedMint,
    toggleMintBalanced,
    isMintAllowed,
    setIsMintAllowed,
    mintAttempt,
    setMintAttempt,
  };
};

export default useMintState;
