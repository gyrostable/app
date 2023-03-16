import { initWeb3, WEB3_TIMEOUT } from "../support/e2e";

describe("Page Load", () => {
  it("Should Initialise Web3", () => {
    cy.clearLocalStorage();
    initWeb3("/pools");
    cy.wait(2000);
    cy.get("#terms-checkbox").click();
    cy.wait(200);
    cy.get("#terms-accept-button").click();
  });
});

describe("Should exit and join USDC/TUSD pool", () => {
  it("Should navigate to USDC/TUSD Pool", () => {
    cy.wait(3000);
    cy.get("#pools-table > tbody > tr:nth-child(2)", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.location().should((loc) => {
      if (loc.pathname)
        expect(loc.pathname).to.eq(
          "/pools/polygon/e-clp/0x97469e6236bd467cd147065f77752b00efadce8a/"
        );
    });
  });

  it("Should navigate to USDC/TUSD Pool exit", () => {
    cy.wait(3000);
    cy.scrollTo(0, 500); // Scroll the window 500px down
    cy.get("#exit-pool-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(3000);
    cy.location().should((loc) => {
      if (loc.pathname)
        expect(loc.pathname).to.eq(
          "/pools/polygon/e-clp/0x97469e6236bd467cd147065f77752b00efadce8a/exit/"
        );
    });
  });

  it("Should exit USDC/TUSD pool", () => {
    cy.wait(5000);
    cy.scrollTo(0, 500); // Scroll the window 500px down
    cy.get("#max-exit-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.get("#exit-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.get("#exit-button", {
      timeout: WEB3_TIMEOUT,
    }).should(($div) => {
      expect($div).to.contain("EXIT POOL SUCCESSFUL");
    });
  });

  it("Navigate back to the USDC/TUSD pool page", () => {
    cy.wait(3000);
    cy.get("#back-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(3000);
    cy.location().should((loc) => {
      if (loc.pathname)
        expect(loc.pathname).to.eq(
          "/pools/polygon/e-clp/0x97469e6236bd467cd147065f77752b00efadce8a/"
        );
    });
  });

  it("Should navigate to USDC/TUSD Pool join", () => {
    cy.wait(3000);
    cy.scrollTo(0, 500); // Scroll the window 500px down
    cy.get("#join-pool-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(3000);
    cy.location().should((loc) => {
      if (loc.pathname)
        expect(loc.pathname).to.eq(
          "/pools/polygon/e-clp/0x97469e6236bd467cd147065f77752b00efadce8a/join/"
        );
    });
  });

  it("Should join USDC/TUSD pool", () => {
    cy.wait(5000);
    cy.scrollTo(0, 500); // Scroll the window 500px down
    cy.get("#max-join-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.get("#join-button-1", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.wait(3000);
    cy.get("#join-button-2", {
      timeout: WEB3_TIMEOUT,
    }).click();
    cy.get("#join-button-2", {
      timeout: WEB3_TIMEOUT,
    }).should(($div) => {
      expect($div).to.contain("JOIN POOL SUCCESSFUL");
    });
    cy.wait(3000);
    cy.get("#modal-close-button", {
      timeout: WEB3_TIMEOUT,
    }).click();
  });
});
