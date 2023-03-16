import React, { useState, useEffect, FC } from "react";
import { useRollbar } from "@rollbar/react";
import BlockedMessage from "./BlockedMessage";
import { BLOCKED_REGION_MESSAGE } from "../../constants/misc";
import fetchIp from "../../utils/api/fetchIp";
import checkIsBlocked from "../../utils/api/checkIsBlocked";

export type WithGeoBlockOptionsType = {
  isDSM?: boolean;
};

const withGeoBlock = (Component: FC, options: WithGeoBlockOptionsType = {}) =>
  function (props: any) {
    const [isBlocked, setIsBlocked] = useState(false);

    const rollbar = useRollbar();

    useEffect(() => {
      (async () => {
        try {
          const ip = await fetchIp();
          const isBlocked = await checkIsBlocked(ip, options);
          setIsBlocked(isBlocked);
        } catch (e: any) {
          console.error(e);
          setIsBlocked(true); // Block if IP address check fails
          rollbar.critical(
            "Failed to fetch IP address or geoblock status: " + (e.message ?? e)
          );
        }
      })();
    }, []);

    if (isBlocked) {
      return <BlockedMessage message={BLOCKED_REGION_MESSAGE} />;
    }

    return <Component {...props} />;
  };

export default withGeoBlock;
