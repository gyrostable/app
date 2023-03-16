import {
  useAccount,
  useDisconnect,
  useEnsName,
  useNetwork,
  useProvider,
  useSigner,
} from "wagmi";
import { ethers, Contract } from "ethers";
import { useRollbar } from "@rollbar/react";
import { ReactNode, useEffect, useState, useContext, useCallback } from "react";
import { ChainConfig, chainsConfig, Chains } from "../../constants/chains";
import Context from "./Context";
import { ModalContext } from "../Modal";
import { chainalysis } from "../../abis";
import restrictedAccounts from "../../constants/restrictedAccounts";
import AcceptTermsModal from "../../components/UI/Modal/components/AcceptTermsModal";
import { Provider as WagmiProvider } from "@wagmi/core";

const Provider = ({ children }: { children: ReactNode }) => {
  const { address: account, isConnected } = useAccount();
  const { data: ensName } = useEnsName({
    address: account,
    chainId: 1,
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const { data: signer } = useSigner();
  const provider = useProvider({ chainId: chainId });
  const [selectedNetworkConfig, setSelectedNetworkConfig] =
    useState<ChainConfig>(chainsConfig[Chains["polygon"]]);
  const [readOnlyProvider, setReadOnlyProvider] = useState<
    WagmiProvider | ethers.providers.JsonRpcProvider
  >(new ethers.providers.JsonRpcProvider(selectedNetworkConfig.rpcUrl));

  const rollbar = useRollbar();

  const { setModalOpen, setModalPayload, onClose } = useContext(ModalContext);

  function loadWeb3Modal() {
    setModalOpen("connectWallet");
  }

  useEffect(() => {
    setReadOnlyProvider(
      isConnected && chainId === selectedNetworkConfig.chainId
        ? provider
        : new ethers.providers.JsonRpcProvider(selectedNetworkConfig.rpcUrl)
    );
  }, [isConnected, provider, selectedNetworkConfig]);

  // Check if user has accepted terms and services
  useEffect(() => {
    if (account && !localStorage.getItem("acceptedTerms:" + account)) {
      setModalPayload({
        noCloseOnClickOutside: true,
        onClose: disconnect,
        header: "Terms of Service and Privacy Policy",
        body: <AcceptTermsModal />,
      });
      setModalOpen("acceptTerms");
    } else {
      onClose();
    }
  }, [account]);

  // Check if account is sanctioned
  const checkInvalidAccount = useCallback(async () => {
    try {
      if (!account) return false;
      const chainalysisContract = new Contract(
        "0x40c57923924b5c5c5455c48d93317139addac8fb",
        chainalysis,
        new ethers.providers.JsonRpcProvider(
          chainsConfig[Chains["mainnet"]].rpcUrl
        )
      );
      return (
        (await chainalysisContract.isSanctioned(account)) ||
        restrictedAccounts.includes(account)
      );
    } catch (e: any) {
      const errorMessage =
        `Error checking invalid account status of address ${account}: ` +
        (e.message ?? e);

      console.error(errorMessage);
      rollbar.warning(errorMessage);
      return false;
    }
  }, [account]);

  const isNetworkMismatch = selectedNetworkConfig.chainId !== chainId;

  return (
    <Context.Provider
      value={{
        loadWeb3Modal,
        logoutOfWeb3Modal: disconnect,
        provider,
        account,
        ensName,
        chainId,
        selectedNetworkConfig,
        setSelectedNetworkConfig,
        checkInvalidAccount,
        isNetworkMismatch,
        readOnlyProvider,
        isConnected,
        signer,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
