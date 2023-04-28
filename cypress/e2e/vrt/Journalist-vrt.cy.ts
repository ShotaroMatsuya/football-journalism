///<reference path="../../support/index.d.ts" />
const testDevices: Cypress.ViewportPreset[] = ['macbook-11', 'ipad-2', 'samsung-note9'];

beforeEach(() => {
  cy.fetchJournalists();
});
describe('すべてのcheckboxがactive', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-11'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('journalist list (all check)', () => {
      cy.viewport(device);
      cy.visit('/journalists');
      cy.get('.card > ul > ').should('have.length', 6);
      cy.wait('@fetch-journalists')
        .its('response.statusCode')
        .should('eq', 200);
      cy.get(':nth-child(6) > h3').should('have.text', 'DeadlineDayLive')
      cy.compareSnapshot(`journalist list (all check) on ${screen}`, {
        capture: 'fullPage',
        errorThreshold: 0.1
      });
    });
  });
});
describe('すべてのcheckを外しているとき', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-11'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('journalist list (no check)', () => {
      cy.viewport(device);
      cy.visit('/journalists');
      cy.get(':nth-child(1) > .card').should('be.visible');
      cy.get(':nth-child(5) > label').click();
      cy.get(':nth-child(3) > label').click();
      cy.get('#private').click();
      cy.get(':nth-child(2) > label').click();
      cy.wait('@fetch-journalists')
        .its('response.statusCode')
        .should('eq', 200);
      cy.get('.card > ul >').should('not.exist')
      cy.get(':nth-child(2) > .card').should('be.visible')
      cy.compareSnapshot(`journalist list (no check) on ${screen}`, {
        capture: 'fullPage',
        errorThreshold: 0.1
      });
    });
  });
});

export {};