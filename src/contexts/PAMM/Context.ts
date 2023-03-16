import { BigNumber } from "ethers";
import { createContext, Dispatch, SetStateAction } from "react";
import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import { RedeemStageType } from "../../hooks/dsm/useRedeemState";
import { DataTypes } from "../../../types/typechain/ReserveManager";
import { SystemParamsType } from "../../../types/dsm";
import { BackupDataType } from "../../hooks/dsm/useReserveState";

interface PAMMContext {
  mintOrRedeem: "mint" | "redeem";
  setMintOrRedeem: Dispatch<SetStateAction<"mint" | "redeem">>;
  underlierTokens: WalletTokenDataType[];
  reserveState: DataTypes.ReserveStateStructOutput | null;
  fetchReserveStateStatus: FetchType;
  fetchGYDDataStatus: FetchType;
  onSelectMintToken: () => void;
  selectedMintTokens: WalletTokenDataType[];
  setSelectedMintTokens: Dispatch<SetStateAction<WalletTokenDataType[]>>;
  mintGYD: () => void;
  minting: boolean;
  mintSlippage: number;
  setMintSlippage: Dispatch<SetStateAction<number>>;
  setAutoMintSlippage: () => void;
  mintBalances: string[];
  setMintBalances: Dispatch<SetStateAction<string[]>>;
  isMintAllowed: boolean;
  verifyMint: () => Promise<void>;
  verifyingMint: boolean;
  onSelectRedeemTokens: () => void;
  selectedRedeemTokens: WalletTokenDataType[];
  setSelectedRedeemTokens: Dispatch<SetStateAction<WalletTokenDataType[]>>;
  redeeming: boolean;
  setRedeeming: Dispatch<SetStateAction<boolean>>;
  redeemSlippages: number[];
  setRedeemSlippages: Dispatch<SetStateAction<number[]>>;
  setAutoRedeemSlippage: (index: number) => void;
  redeemGYD: () => void;
  redeemStage: RedeemStageType;
  setRedeemStage: Dispatch<SetStateAction<RedeemStageType>>;
  redeemBalance: string;
  setRedeemBalance: Dispatch<SetStateAction<string>>;
  redeemProportions: BigNumber[];
  setRedeemProportions: Dispatch<SetStateAction<BigNumber[]>>;
  isBalancedRedemption: boolean;
  redeemAllowed: boolean;
  setCustomRedemption: () => void;
  setBalancedRedemption: () => void;
  expectedGYDToReceive: BigNumber | null;
  expectedOutputAmounts: BigNumber[] | null;
  gydTokenData: WalletTokenDataType | null;
  error: string;
  stablecoinSymbol: "p-GYD" | "GYD";
  userPercCap: number | null;
  totalPercCap: number | null;
  userCap: BigNumber | null;
  isBalancedMint: boolean;
  toggleMintBalanced: () => void;
  setMintAttempt: Dispatch<SetStateAction<number>>;
  toggleRedeemBalanced: () => void;
  systemParams: SystemParamsType | null;
  redemptionLevel: BigNumber | null;
  backupData: BackupDataType | null;
}

const Context = createContext<PAMMContext>({
  mintOrRedeem: "mint",
  setMintOrRedeem: () => {},
  underlierTokens: [],
  reserveState: null,
  fetchReserveStateStatus: "fetching",
  fetchGYDDataStatus: "fetching",
  onSelectMintToken: () => {},
  selectedMintTokens: [],
  setSelectedMintTokens: () => {},
  mintGYD: () => {},
  minting: false,
  mintSlippage: 0,
  setMintSlippage: () => {},
  setAutoMintSlippage: () => {},
  mintBalances: [],
  setMintBalances: () => {},
  isMintAllowed: false,
  verifyMint: async () => {},
  verifyingMint: false,
  onSelectRedeemTokens: () => {},
  selectedRedeemTokens: [],
  setSelectedRedeemTokens: () => {},
  redeeming: false,
  setRedeeming: () => {},
  redeemSlippages: [0],
  setRedeemSlippages: () => {},
  setAutoRedeemSlippage: () => {},
  redeemGYD: () => {},
  redeemStage: "tokenSelection",
  setRedeemStage: () => {},
  redeemBalance: "0",
  setRedeemBalance: () => {},
  redeemProportions: [],
  setRedeemProportions: () => {},
  isBalancedRedemption: false,
  redeemAllowed: false,
  setCustomRedemption: () => {},
  setBalancedRedemption: () => {},
  expectedGYDToReceive: null,
  expectedOutputAmounts: null,
  gydTokenData: null,
  error: "",
  stablecoinSymbol: "GYD",
  userPercCap: null,
  totalPercCap: null,
  userCap: null,
  isBalancedMint: true,
  toggleMintBalanced: () => {},
  setMintAttempt: () => {},
  toggleRedeemBalanced: () => {},
  systemParams: null,
  redemptionLevel: null,
  backupData: null,
});

export default Context;
