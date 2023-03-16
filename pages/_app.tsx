import { ThemeProvider } from "styled-components";
import { WagmiConfig } from "wagmi";
import { ErrorBoundary } from "react-error-boundary";
import { Provider as RollbarProvider } from "@rollbar/react";
import type { AppProps } from "next/app";
import { ReactNode } from "react";
import GlobalStyle from "../src/styles/global";
import theme from "../src/styles/theme";
import "../src/styles/global.css";
import { Web3Provider } from "../src/contexts/Web3";
import Layout from "../src/components/Layout";
import { PoolDataProvider } from "../src/contexts/PoolData";
import { JoinExitDataProvider } from "../src/contexts/JoinExitData";
import { UserShareProvider } from "../src/contexts/UserShare";
import { WalletProvider } from "../src/contexts/Wallet";
import { ModalProvider } from "../src/contexts/Modal";
import { TransactionsProvider } from "../src/contexts/Transactions";
import { BalancerProvider } from "../src/contexts/Balancer";
import BlockedMessage from "../src/components/UI/BlockedMessage";
import { REACT_ERROR_MESSAGE, MISC_ERRORS } from "../src/constants/misc";
import ROLLBAR_CONFIG from "../src/constants/rollbar";
import UserAccountCheck from "../src/components/app/UserAccountCheck";
import ApolloProviderWithClient from "../src/components/app/ApolloProviderWithClient";
import Web3Fallback from "../src/components/app/Web3Fallback";
import ConditionalPAMMProvider from "../src/components/app/ConditionalPAMMProvider";
import { Web3FallbackProvider } from "../src/contexts/Web3Fallback";
import MobileFallback from "../src/components/app/MobileFallback";
import { wagmiClient } from "../src/contexts/Web3/wagmi";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <MobileFallback>
        <Providers>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={errorHandler}
          >
            <Layout>
              <UserAccountCheck>
                <Web3Fallback>
                  <Component {...pageProps} />
                </Web3Fallback>
              </UserAccountCheck>
            </Layout>
          </ErrorBoundary>
        </Providers>
      </MobileFallback>
    </>
  );
}

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <RollbarProvider config={ROLLBAR_CONFIG}>
      <Web3FallbackProvider>
        <WagmiConfig client={wagmiClient}>
          <ModalProvider>
            <Web3Provider>
              <ApolloProviderWithClient>
                <ConditionalPAMMProvider>
                  <PoolDataProvider>
                    <JoinExitDataProvider>
                      <UserShareProvider>
                        <WalletProvider>
                          <TransactionsProvider>
                            <BalancerProvider>
                              <ThemeProvider theme={theme}>
                                {children}
                              </ThemeProvider>
                            </BalancerProvider>
                          </TransactionsProvider>
                        </WalletProvider>
                      </UserShareProvider>
                    </JoinExitDataProvider>
                  </PoolDataProvider>
                </ConditionalPAMMProvider>
              </ApolloProviderWithClient>
            </Web3Provider>
          </ModalProvider>
        </WagmiConfig>
      </Web3FallbackProvider>
    </RollbarProvider>
  );
};

const ErrorFallback = () => {
  return (
    <Layout>
      <BlockedMessage message={REACT_ERROR_MESSAGE} />
    </Layout>
  );
};

function errorHandler(error: Error) {
  if (error.message && MISC_ERRORS.some((err) => error.message.includes(err)))
    return;

  throw error;
}

export default App;
