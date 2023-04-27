beforeEach(() => {
  cy.triggerAI()
  cy.fetchSingleArticle()
});

describe('Articles page', () => {
  it('should display 10 articles', () => {
    cy.fetchArticlesWithNoAnalysis();
    cy.visit('/journalists/330262748')
    cy.get(':nth-child(1) > .controls > .outline')    
    cy.get('.card > ul >').should('have.length', 10)
  });
  it('should display ai analysis when finishing job', () => {
    cy.fetchArticlesWithNoAnalysis()
    cy.getRunningStatus()
    cy.visit('/journalists/330262748')
    cy.get(':nth-child(1) > .controls > .outline').click()
    cy.wait('@trigger-ai').its('response.statusCode').should('equal', 200)
    cy.get('.spinner').should('be.visible')
    cy.wait('@running-status', {timeout: 10000}).its('response.statusCode').should('equal', 200)
    cy.getCompleteStatus()
    cy.wait('@complete-status', {timeout: 10000}).its('response.statusCode').should('equal', 200)
    cy.wait('@resultArticle',).its('response.statusCode').should('equal', 200)
    cy.get('.spinner').should('not.exist')
    cy.get('.disable').should('contain', '解析済')
  });
  it('should pop up tooltip when hovering on a icon', () => {
    cy.fetchArticlesWithAnalysis()
    cy.visit('/journalists/330262748')
    cy.get('.disable').should('contain', '解析済')
    cy.get(':nth-child(1) > .controls > .tooltip > .description').should('contain', 'AIにより')
  });
  it('should switch translated text when clicking btn', () => {
    cy.fetchArticlesWithAnalysis()
    cy.visit('/journalists/330262748')
    cy.get('.disable').should('contain', '解析済')
    cy.get('[data-testid="convert-to-jpn-btn"]').click()
    cy.get(':nth-child(1) > strong').should('contain', 'ランパード')
    cy.get('[data-testid="convert-to-original-btn"]').click()
    cy.get(':nth-child(1) > strong').should('contain', 'Lampard')
  });
  it('should control audio, when clicking btns', () => {
    cy.fetchArticlesWithAnalysis()
    cy.visit('/journalists/330262748')
    cy.get('.disable').should('contain', '解析済')
    cy.get('.volume-input > input').as('range').invoke('val', 0.1).trigger('input')
    cy.get('.audio-btn > :nth-child(1)').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5700)
    cy.get('.audio-btn > :nth-child(2)').click(1)
    cy.get('.range-input > p').should('contain', '0:05')
    cy.get('.volume-input > p').should('contain', '10%')
  });
  it('should handle error when failing jobs', () => {
    cy.fetchArticlesWithNoAnalysis()
    cy.getRunningStatus()
    cy.visit('/journalists/330262748')
    cy.get(':nth-child(1) > .controls > .outline').click()
    cy.wait('@trigger-ai').its('response.statusCode').should('equal', 200)
    cy.get('.spinner').should('be.visible')
    cy.wait('@running-status', {timeout: 10000}).its('response.statusCode').should('equal', 200)
    cy.getFailedStatus()
    cy.wait('@failed-status', {timeout: 10000}).its('response.statusCode').should('equal', 500)
    
    cy.get('.spinner').should('not.exist')
    cy.get(':nth-child(1) > .controls > .outline').should('contain', 'AI解析')
  });
});
