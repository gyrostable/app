import Link from "next/link";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import Spacer from "../../../UI/Spacer";
import useDisappearing from "../../../../hooks/useDisappearing";
import ConnectWallet from "./components/ConnectWallet";
import Image from "../../../UI/Image";

import logo from "../../../../../public/logos/logo-white.png";
import NetworkSelect from "./components/NetworkSelect";
import { Web3Context } from "../../../../contexts/Web3";
import GYDBalance from "./components/GYDBalance";
import { Chains } from "../../../../constants/chains";

const NavBar = () => {
  const {
    open: dropdownOpen,
    visible: dropdownVisible,
    appear: dropdownAppear,
    disappear: dropdownDisappear,
  } = useDisappearing();

  useEffect(() => {
    document.addEventListener("scroll", dropdownDisappear);
  }, [dropdownDisappear]);

  const { selectedNetworkConfig } = useContext(Web3Context);

  const stablecoinSymbol =
    selectedNetworkConfig.chainId === Chains["polygon"] ? "p-GYD" : "GYD";

  return (
    <Container>
      <LogoContainer>
        <a href="https://gyro.finance/" target="_blank" rel="noreferrer">
          <Image
            style={{ cursor: "pointer" }}
            priority
            src={logo}
            alt="Gyroscope logo"
            unoptimized={true}
          />
        </a>
      </LogoContainer>
      <Link href="/">
        <NavLink onMouseOver={dropdownDisappear}>{stablecoinSymbol}</NavLink>
      </Link>
      <Link href="/pools">
        <NavLink onMouseOver={dropdownDisappear}>Pools</NavLink>
      </Link>
      <DropdownContainer onMouseLeave={dropdownDisappear}>
        <DotsContainer onMouseOver={dropdownAppear}>
          <Dot />
          <Dot />
          <Dot />
        </DotsContainer>
        {dropdownOpen && (
          <Dropdown visible={dropdownVisible}>
            <DropdownItemsContainer>
              <NavLink
                href="https://docs.gyro.finance/overview/introduction"
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </NavLink>
              <NavLink
                href="https://twitter.com/gyrostable/"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </NavLink>
              <NavLink
                href="https://discord.com/invite/2vnqnS7wE6"
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </NavLink>
              <NavLink
                href="https://gov.gyro.finance/"
                target="_blank"
                rel="noreferrer"
              >
                Forum
              </NavLink>
            </DropdownItemsContainer>
          </Dropdown>
        )}
      </DropdownContainer>
      <Spacer />
      <NetworkSelect />
      <BorderContainer>
        <GYDBalance />
        <ConnectWallet />
      </BorderContainer>
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.highlight};
  display: flex;
  height: 100px;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 50px;
  position: relative;
`;

const LogoContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100px;
  margin-right: 32px;
  justify-content: center;
  transform: translateY(2px);
  width: 120px;
`;

const NavLink = styled.a`
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-right: 32px;
  position: relative;
  z-index: 100;

  &:after {
    background-color: ${({ theme }) => theme.colors.white};
    bottom: -7px;
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
    width: 100%;
  }

  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const Dropdown = styled.div<{ visible: boolean }>`
  bottom: -200px;
  left: -58%;
  padding-top: 50px;
  position: absolute;
  margin-top: 100px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
`;

export const DropdownContainer = styled.div`
  position: relative;

  // Mobile Styling
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: absolute;
    visibility: hidden;
  }
`;

const DropdownItemsContainer = styled.div`
  background: ${({ theme }) => theme.colors.highlight};
  border: 1px solid ${({ theme }) => theme.colors.highlightLight};
  border-radius: 12px;
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.12);
  display: flex;
  gap: 20px;
  flex-direction: column;
  padding: 20px;
`;

const Dot = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  height: 4px;
  width: 4px;
`;

const DotsContainer = styled.div`
  align-items: center;
  display: flex;
  color: white;
  cursor: pointer;
  gap: 3px;
  margin-right: 32px;
  position: relative;
  height: 30px;
  z-index: 100;
`;

const BorderContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.highlight};
  border-radius: 8px;
  display: flex;
  max-height: 44px;
`;

export default NavBar;
