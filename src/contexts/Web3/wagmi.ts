import { createClient, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { mainnet, polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

export const CONFIGURED_CHAINS = [mainnet, polygon];

const mainnetAlchemyKey = process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_KEY;
const polygonAlchemyKey = process.env.NEXT_PUBLIC_POLYGON_ALCHEMY_KEY;

if (!mainnetAlchemyKey || !polygonAlchemyKey)
  throw "Missing alchemy keys in environment variables";

export const { provider, chains } = configureChains(CONFIGURED_CHAINS, [
  alchemyProvider({
    apiKey: polygonAlchemyKey ?? "",
  }),
  alchemyProvider({
    apiKey: mainnetAlchemyKey ?? "",
  }),
  jsonRpcProvider({
    rpc: () => ({
      http: `https://polygon-rpc.com`,
    }),
  }),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
});
