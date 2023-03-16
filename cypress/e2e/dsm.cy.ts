import { initWeb3, WEB3_TIMEOUT } from "../support/e2e";

describe("Page Load", () => {
  it("Should Initialise Web3", () => {
    cy.clearLocalStorage();
    initWeb3("/");
    cy.wait(2000);
    cy.get("#terms-checkbox").click();
    cy.wait(200);
    cy.get("#terms-accept-button").click();
  });
});

describe("Should mint and redeem p-GYD", () => {
  it("Should mint p-GYD", () => {
    cy.wait(10000);
    cy.get("#balanced-mint-redeem-switch", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(1000);
    cy.get("#select-max-balanced-mint-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.get("#mint-next-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(2000);
    cy.get("#mint-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(1000);
    cy.get("#mint-redeem-modal", {
      timeout: WEB3_TIMEOUT,
    }).should(($div) => {
      expect($div).to.contain("Mint Success");
    });
    cy.get("#modal-close-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
  });
  it("Should redeem p-GYD", () => {
    cy.wait(10000);
    cy.get("#mint-redeem-switch-redeem-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.get("#balanced-mint-redeem-switch", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.get("#quantity-input-single-max", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(1000);
    cy.get("#redeem-next-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(1000);
    cy.get("#redeem-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(2000);
    cy.get("#mint-redeem-modal", {
      timeout: WEB3_TIMEOUT,
    }).should(($div) => {
      expect($div).to.contain("Redemption Success");
    });
    cy.get("#modal-close-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
  });
});
