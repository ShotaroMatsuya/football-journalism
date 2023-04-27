const testDevices = ['macbook-11', 'ipad-2', 'iphone-xr'];

beforeEach(() => {
  cy.fetchJournalists();
});

describe('access to article list page(no ai analysis)', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-11'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no ai analysis)', () => {
      cy.fetchArticlesWithNoAnalysis();
      cy.viewport(device);
      cy.visit('/journalists/330262748');
      cy.get('.card > ul >').should('have.length', 10)
      cy.wait('@non-analysis').its('response.statusCode').should('eq', 200);
      cy.get(':nth-child(10) > strong').should('be.visible').and('contain', 'QUICK STAT')
      cy.compareSnapshot(`article list without analysis on ${screen}`, {
        capture: 'fullPage',
        errorThreshold: 0.1
      });
    });
  });
});

describe('access to article list page(ai analysis)', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-11'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no ai analysis)', () => {
      cy.fetchArticlesWithAnalysis();
      cy.viewport(device);
      cy.visit('/journalists/330262748');
      cy.get('.card > ul >').should('have.length', 10)
      cy.wait('@with-analysis').its('response.statusCode').should('eq', 200);
      cy.get(':nth-child(10) > strong').should('be.visible').and('contain', 'UEFA President')
      cy.compareSnapshot(`article list with analysis on ${screen}`, {
        capture: 'fullPage',
        errorThreshold: 0.1
      });
    });
  });
});
describe('access to article list page(no articles)', () => {
  testDevices.forEach((device) => {
    const screen =
      device === 'macbook-11'
        ? 'large'
        : device === 'ipad-2'
        ? 'medium'
        : 'small';
    it('全画面のスナップショット(no articles)', () => {
      cy.fetchNoArticles();
      cy.viewport(device);
      cy.visit('/journalists/330262748');
      cy.get('.card > ul >').should('not.exist')
      cy.wait('@no-articles').its('response.statusCode').should('eq', 200);
      cy.compareSnapshot(`no article list on ${screen}`, {
        capture: 'fullPage',
        errorThreshold: 0.1
      });
    });
  });
});
