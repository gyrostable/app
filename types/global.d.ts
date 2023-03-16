export {};

declare global {
  type Subgraph_BigInt = string;
  type Subgraph_BigDecimal = string;
  type Subgraph_Bytes = string;

  interface Window {
    ethereum?: any;
  }

  type FetchType = "fetching" | "success" | "failed";
}
