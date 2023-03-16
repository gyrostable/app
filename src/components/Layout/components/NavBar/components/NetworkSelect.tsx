import styled from "styled-components";
import { useContext } from "react";
import Router, { useRouter } from "next/router";
import Image from "../../../../UI/Image";
import useDisappearing from "../../../../../hooks/useDisappearing";
import capitalise from "../../../../../utils/capitalise";
import { Web3Context } from "../../../../../contexts/Web3";
import { ALLOWED_CHAINS, ChainConfig } from "../../../../../constants/chains";
import LoadingAnimation from "../../../../UI/LoadingAnimation";
import Row from "../../../../UI/Row";
import useSwitchNetwork from "../../../../../hooks/useSwitchNetwork";

import ethereumIcon from "../../../../../../public/icons/ethereum.svg";
import polygonIcon from "../../../../../../public/icons/polygon.svg";

type IconType = "polygon" | "ethereum";

const ICON_MAP = {
  polygon: polygonIcon,
  ethereum: ethereumIcon,
};

const NetworkSelect = () => {
  const { selectedNetworkConfig } = useContext(Web3Context);
  const { open, visible, disappear, toggle } = useDisappearing();
  const router = useRouter();

  const { switchNetwork, isLoading, switchingTo } = useSwitchNetwork();

  async function onNetworkSelect(config: ChainConfig) {
    if (isLoading) return;
    if (config.name === selectedNetworkConfig.name) return disappear();
    switchNetwork(config);
    router.pathname.includes("pools") && Router.push("/pools");
    disappear();
  }

  return (
    <Container onMouseLeave={() => !isLoading && disappear()}>
      <FilterButton open={open} onClick={toggle}>
        {selectedNetworkConfig?.icon && (
          <Image
            src={ICON_MAP[selectedNetworkConfig.icon as IconType]}
            height={20}
            width={20}
            alt="network-icon"
            unoptimized={true}
          />
        )}
        <p style={{ marginLeft: "10px" }}>
          {capitalise(selectedNetworkConfig.name)}
        </p>
      </FilterButton>
      {open && (
        <>
          <FilterArea />
          <FilterOptionsContainer visible={visible}>
            {ALLOWED_CHAINS.map((config, index) => (
              <FilterOption
                key={index}
                active={
                  config.name === selectedNetworkConfig.name ||
                  (isLoading && config.name === switchingTo?.name)
                }
                onClick={() => onNetworkSelect(config)}
              >
                <Row alignItems="center">
                  {config.icon && (
                    <Image
                      src={ICON_MAP[config.icon as IconType]}
                      height={20}
                      width={20}
                      alt="network-icon"
                      unoptimized={true}
                    />
                  )}
                  <p style={{ marginLeft: "10px" }}>
                    {capitalise(config.name)}
                  </p>
                  {isLoading && switchingTo.name === config.name && (
                    <LoadingAnimation size={15} margin="0 0 0 15px" />
                  )}
                </Row>
                {isLoading && switchingTo.name === config.name && (
                  <NetworkSwitchMessage>
                    Approve network switch in wallet
                  </NetworkSwitchMessage>
                )}
              </FilterOption>
            ))}
          </FilterOptionsContainer>
        </>
      )}
    </Container>
  );
};

export default NetworkSelect;

const Container = styled.div`
  margin-right: 10px;
  position: relative;
`;

const FilterButton = styled.div<{ open: boolean }>`
  align-items: center;
  background: ${({ open, theme }) =>
    open ? theme.colors.highlight : theme.colors.dark};
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  cursor: pointer;
  height: 44px;
  display: flex;
  justify-content: center;
  padding: 0 15px;
  position: relative;
  transition: all 0.2s ease-in-out;
  z-index: 3;

  &:hover {
    background: ${({ theme, open }) =>
      open ? theme.colors.highlight : theme.colors.highlightDark};
  }
`;

const FilterArea = styled.div`
  height: 500px;
  position: absolute;
  right: -50px;
  top: -50px;
  width: 400px;
`;

const FilterOptionsContainer = styled.div<{ visible: boolean }>`
  background: ${({ theme }) => theme.colors.highlight};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  padding: 8px;
  position: absolute;
  right: 0;
  top: 60px;
  transition: all 0.2s ease-in-out;
  z-index: 10;
`;

const FilterOption = styled.div<{ active?: boolean }>`
  align-items: center;
  background: ${({ theme, active }) =>
    active ? theme.colors.highlightLight : theme.colors.highlight};
  border-radius: 8px;
  cursor: pointer;
  padding-left: 15px;
  min-width: 256px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.highlightLight};
  }
`;

const NetworkSwitchMessage = styled.p`
  font-size: 12px;
  margin: 0;
  margin-bottom: 10px;
`;
