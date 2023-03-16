import { ReactNode, Dispatch, SetStateAction, useState } from "react";
import Context from "./Context";
import { TransactionStateType } from "./Context";

const Provider = ({ children }: { children: ReactNode }) => {
  const [approvals, setApprovals] = useState<TransactionStateType>({});
  const [joins, setJoins] = useState<TransactionStateType>({});
  const [exits, setExits] = useState<TransactionStateType>({});

  const setters: { [key in string]: Dispatch<SetStateAction<any>> } = {
    approvals: setApprovals,
    joins: setJoins,
    exits: setExits,
  };

  function setTransactionState(
    transactionType: string,
    key: string,
    newState: any
  ) {
    const setter = setters[transactionType];
    setter((prev: any) => ({ ...prev, [key]: newState }));
  }

  return (
    <Context.Provider
      value={{
        approvals,
        joins,
        exits,
        setTransactionState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
