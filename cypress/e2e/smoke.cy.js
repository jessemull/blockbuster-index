describe('Smoke Test', () => {
  const baseUrl = () => Cypress.config('baseUrl');

  it('Loads the homepage.', () => {
    cy.visit(baseUrl());
    cy.contains('Blockbuster Index');
  });

  it('Navigates to rankings.', () => {
    cy.visit(`${baseUrl()}/rankings`);
    cy.contains('Rankings');
    cy.get('#signal-select').should('exist');
  });

  it('Navigates to signals.', () => {
    cy.visit(`${baseUrl()}/signals`);
    cy.contains('Signals');
    cy.contains('Amazon');
  });

  it('Shows the USA map on the homepage.', () => {
    cy.visit(baseUrl());
    cy.get('svg.usa-map').should('exist');
    cy.get('[data-testid="usa-state-ca"]').should('exist');
  });

  it('Opens the Tapey chat control.', () => {
    cy.visit(baseUrl());
    cy.get('button[aria-label="Open chat with Tapey"]').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('Chat with Tapey');
  });
});
