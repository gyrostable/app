import { useEffect, useContext } from "react";
import Router from "next/router";
import useQueryParam from "../useQueryParam";
import { Web3Context } from "../../contexts/Web3";

const useRequireAccount = () => {
  const poolAddress = useQueryParam("poolAddress");
  const chainName = useQueryParam("chainName");
  const poolType = useQueryParam("poolType");

  const { account } = useContext(Web3Context);

  // Redirect if wallet not connected
  useEffect(() => {
    if (!account && chainName && poolType && poolAddress) {
      Router.push(`/pools/${chainName}/${poolType}/${poolAddress}`);
    }
  }, [account, chainName, poolType, poolAddress]);
};

export default useRequireAccount;
