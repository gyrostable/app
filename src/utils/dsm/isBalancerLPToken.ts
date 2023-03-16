import { WalletTokenDataType } from "../../contexts/Wallet/Context";
import BALANCER_LP_TOKENS from "../../constants/dsm/balancer";

const isBalancerLPToken = (data: WalletTokenDataType) =>
  BALANCER_LP_TOKENS.includes(data.address);

export default isBalancerLPToken;
