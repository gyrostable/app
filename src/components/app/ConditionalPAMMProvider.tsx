import { useContext, ReactNode } from "react";
import { VALID_DSM_CHAIN_IDS } from "../../constants/chains";
import { PAMMProvider } from "../../contexts/PAMM";
import { Web3Context } from "../../contexts/Web3";

const ConditionalPAMMProvider = ({ children }: { children: ReactNode }) => {
  const { selectedNetworkConfig } = useContext(Web3Context);

  const validDSMChain = VALID_DSM_CHAIN_IDS.includes(
    selectedNetworkConfig.chainId
  );

  return validDSMChain ? (
    <PAMMProvider>{children}</PAMMProvider>
  ) : (
    <>{children}</>
  );
};

export default ConditionalPAMMProvider;
