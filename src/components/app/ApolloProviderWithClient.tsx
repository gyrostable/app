import { useContext, ReactNode } from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Web3Context } from "../../contexts/Web3";

const ApolloProviderWithClient = ({ children }: { children: ReactNode }) => {
  const { selectedNetworkConfig } = useContext(Web3Context);

  const { subgraphApi } = selectedNetworkConfig || "";

  if (!subgraphApi)
    console.error(
      `No subgraph API url found for network ${selectedNetworkConfig.name}`
    );

  // Apollo client
  const client = new ApolloClient({
    uri: subgraphApi,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWithClient;
