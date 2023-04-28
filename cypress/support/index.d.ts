/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
    fetchJournalists(): Chainable<void>,
    postRequest(): Chainable<void>,
    fetchArticlesWithAnalysis(): Chainable<void>,
    fetchArticlesWithNoAnalysis(): Chainable<void>,
    fetchNoArticles(): Chainable<void>,
    fetchSingleArticle(): Chainable<void>,
    triggerAI(): Chainable<void>,
    getCompleteStatus(): Chainable<void>,
    getFailedStatus(): Chainable<void>,
    getRunningStatus(): Chainable<void>,
    login(username: string, password: string): Chainable<void>,
    fetchRequests(): Chainable<void>,
    fetchNoRequests(): Chainable<void>,
    mockAuthRequest(): Chainable<void>,
    mockRegisterRequest(): Chainable<void>,
    getArticle(): Chainable
  }
}
}
export {};