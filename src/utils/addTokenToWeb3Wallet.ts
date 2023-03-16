export type AddToWeb3WalletOptions = {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
};

function addTokenToWeb3Wallet(options: AddToWeb3WalletOptions) {
  return (
    window.ethereum &&
    (window as any).ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options,
      },
    })
  );
}

export default addTokenToWeb3Wallet;
