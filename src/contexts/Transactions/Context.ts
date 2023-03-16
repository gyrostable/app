import { createContext } from "react";

export type TransactionStateType = { [key in string]: any };

type TransactionsContextProps = {
  approvals: TransactionStateType;
  joins: TransactionStateType;
  exits: TransactionStateType;
  setTransactionState: (
    transactionType: string,
    key: string,
    newState: any
  ) => void;
};

const Context = createContext<TransactionsContextProps>({
  approvals: {},
  joins: {},
  exits: {},
  setTransactionState: () => {},
});

export default Context;
