const testDevices = ['macbook-16', 'ipad-2', 'iphone-xr'];

beforeEach(() => {
  cy.fetchJournalists();
});

describe('access to article list page(no ai analysis)', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-16'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no ai analysis)', () => {
      cy.fetchArticlesWithNoAnalysis();
      cy.viewport(device);
      cy.visit('/journalists/330262748');
      cy.wait('@non-analysis').its('response.statusCode').should('eq', 200);
      cy.compareSnapshot(`article list without analysis on ${screen}`, 0.05);
    });
  });
});

describe('access to article list page(ai analysis)', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-16'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no ai analysis)', () => {
      cy.fetchArticlesWithAnalysis();
      cy.viewport(device);
      cy.visit('/journalists/330262748');
      cy.wait('@with-analysis').its('response.statusCode').should('eq', 200);
      cy.compareSnapshot(`article list with analysis on ${screen}`, 0.05);
    });
  });
});
describe('access to article list page(no articles)', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-16'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no articles)', () => {
      cy.fetchNoArticles();
      cy.viewport(device);
      cy.visit('/journalists/330262748');
      cy.wait('@no-articles').its('response.statusCode').should('eq', 200);
      cy.compareSnapshot(`no article list on ${screen}`, 0.05);
    });
  });
});
