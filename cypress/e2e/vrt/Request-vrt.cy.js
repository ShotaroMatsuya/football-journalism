const testDevices = ['macbook-16', 'ipad-2', 'iphone-xr'];

beforeEach(() => {
  cy.login('admin@admin.com', 'password');
});
describe('access to received requests page', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-16'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('リクエストがある場合', () => {
      cy.fetchRequests();
      cy.viewport(device);
      cy.visit('/requests');
      cy.compareSnapshot(`request list with request on ${screen}`, 0.05);
    });
    it('リクエストがない場合', () => {
      cy.fetchNoRequests();
      cy.viewport(device);
      cy.visit('/requests');
      cy.get('menu > button').click();
      cy.get('.card').should('be.visible');
      cy.contains("You haven't received any requests yet!").should('exist');
      cy.compareSnapshot(`request without any requests on ${screen}`, 0.05);
    });
  });
});
