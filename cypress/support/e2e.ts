import Web3 from "web3";
import PrivateKeyProvider from "truffle-privatekey-provider";
import { Chains, chainsConfig } from "../../src/constants/chains";

export const WEB3_TIMEOUT = 100000;

const RPC = chainsConfig[Chains["polygon"]].rpcUrl;

const getProvider = (privateKey: string) => {
  return new Web3(new PrivateKeyProvider(privateKey, RPC));
};

export const initWeb3 = (path: string) => {
  const privateKey = Cypress.env("PRIVATE_KEY");

  cy.on("window:before:load", (win) => {
    (win as any).testing = true;
    (win as any).web3 = getProvider(privateKey);
  });

  cy.visit(path);
};
