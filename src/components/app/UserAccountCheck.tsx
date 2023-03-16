import { useContext, useState, useEffect, ReactNode } from "react";
import BlockedMessage from "../UI/BlockedMessage";
import { BLOCKED_USER_MESSAGE } from "../../constants/misc";
import { Web3Context } from "../../contexts/Web3";

const UserAccountCheck = ({ children }: { children: ReactNode }) => {
  const { checkInvalidAccount, account } = useContext(Web3Context);
  const [invalidAccount, setInvalidAccount] = useState(false);

  useEffect(() => {
    (async () => {
      const isInvalid = await checkInvalidAccount();
      setInvalidAccount(isInvalid);
    })();
  }, [account, checkInvalidAccount]);

  return invalidAccount ? (
    <BlockedMessage message={BLOCKED_USER_MESSAGE} />
  ) : (
    <>{children}</>
  );
};

export default UserAccountCheck;
