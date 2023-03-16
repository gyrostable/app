import { GyroPoolSymbolLabels } from "../../types/pool";

const destructureUnderlierSymbols = (tokenSymbol: string) => {
  return tokenSymbol
    .split("-")
    .filter((el) => !GyroPoolSymbolLabels.includes(el));
};

export default destructureUnderlierSymbols;
