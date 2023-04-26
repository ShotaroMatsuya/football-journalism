const testDevices = ['macbook-16', 'ipad-2', 'samsung-note9'];

beforeEach(() => {
  cy.fetchJournalists();
});
describe('すべてのcheckboxがactive', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-16'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no ai analysis)', () => {
      cy.viewport(device);
      cy.visit('/journalists');
      cy.wait('@fetch-journalists')
        .its('response.statusCode')
        .should('eq', 200);
      cy.get(':nth-child(1) > .card').should('be.visible');

      cy.compareSnapshot(`article list without analysis on ${screen}`, 0.05);
    });
  });
});
describe('すべてのcheckを外しているとき', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-16'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no ai analysis)', () => {
      cy.viewport(device);
      cy.visit('/journalists');
      cy.wait('@fetch-journalists')
        .its('response.statusCode')
        .should('eq', 200);
      cy.get(':nth-child(1) > .card').should('be.visible');
      cy.get(':nth-child(5) > label').click();
      cy.get(':nth-child(3) > label').click();
      cy.get('#private').click();
      cy.get(':nth-child(2) > label').click();
      cy.compareSnapshot(`article list without analysis on ${screen}`, 0.05);
    });
  });
});
