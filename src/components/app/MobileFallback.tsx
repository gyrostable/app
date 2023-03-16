import Image from "../UI/Image";
import styled from "styled-components";
import { ReactNode } from "react";
import BlockedMessage from "../UI/BlockedMessage";
import { BLOCKED_DEVICE_MESSAGE } from "../../constants/misc";
import { useWindowSize } from "usehooks-ts";

import logo from "../../../public/logos/logo-white.png";

const MobileFallback = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowSize();

  if (width === 0) return null;

  return (
    <>
      {width < 900 ? (
        <MobileMessageContainer>
          <LogoContainer>
            <Image
              priority
              src={logo}
              alt="Gyroscope logo"
              unoptimized={true}
            />
          </LogoContainer>
          <BlockedMessage message={BLOCKED_DEVICE_MESSAGE} />
        </MobileMessageContainer>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default MobileFallback;

const MobileMessageContainer = styled.div`
  left: 50%;
  position: absolute;
  text-align: center;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
`;

const LogoContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  max-width: 100%;
`;
