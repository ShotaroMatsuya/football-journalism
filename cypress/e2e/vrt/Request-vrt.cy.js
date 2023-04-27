const testDevices = ['macbook-11', 'ipad-2', 'iphone-xr'];

beforeEach(() => {
  cy.login('admin@admin.com', 'password');
});
describe('access to received requests page', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-11'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('リクエストがある場合', () => {
      cy.fetchRequests();
      cy.viewport(device);
      cy.visit('/requests');
      cy.get('.card').should('be.visible').and('contain', 'テストリクエスト');
      cy.wait('@requests').its('response.statusCode').should('eq', 200);
      cy.compareSnapshot(`request list with request on ${screen}`, {
        capture: 'fullPage',
        errorThreshold: 0.1
      });
    });
    it('リクエストがない場合', () => {
      cy.fetchNoRequests();
      cy.viewport(device);
      cy.visit('/requests');
      cy.get('menu > button').click();
      cy.get('dialog > header').should('not.exist')
      cy.get('.card').should('be.visible').and('contain', 'Requests Received');
      cy.contains("You haven't received any requests yet!").should('exist');
      cy.wait('@no-requests').its('response.statusCode').should('eq', 404);
      cy.compareSnapshot(`request without any requests on ${screen}`, {
        capture: 'fullPage',
        errorThreshold: 0.1
      });
    });
  });
});
