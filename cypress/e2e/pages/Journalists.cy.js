import { checkURL } from '../../support/utils';
beforeEach(() => {
  cy.clock(new Date(2023, 3, 26, 22, 35, 30).getTime(), ['Date']);
  cy.postRequest()
  cy.mockAuthRequest()
  cy.mockRegisterRequest()
});

describe('Journalists page', () => {
  it('should display 6 journalists', () => {
    cy.visit('/journalists');
    cy.get('.card > ul >').should('have.length', 6);
  
  });
  it('should display loading spinner when reloading btn', () => {
    cy.intercept(
      'GET',
      'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/journalist',
      {
        delay: 1000,
        fixture: 'journalists.json'
      }
    ).as('getDelayedJournalists')
    cy.visit('/journalists');
    cy.get('.controls > .outline').click();
    cy.get('.lds-roller').should('be.visible');
    // requestが1回送信されているかを確認
    cy.wait('@getDelayedJournalists').its('response.statusCode').should('eq', 200);
    // リストが6要素表示されているかを確認
    cy.get('.card > ul >').should('have.length', 6);
  })

  it('should filter journalists by areas checkbox', () => {
    cy.visit('/journalists');
    cy.get(':nth-child(2) > label').click();
    cy.get('.card > ul >').should('have.length', 5);
    cy.get(':nth-child(3) > label').click()
    cy.get('.card > ul >').should('have.length', 4);
    cy.get(':nth-child(4) > label').click()
    cy.get('.card > ul >').should('have.length', 4);
    cy.get(':nth-child(5) > label').click()
    cy.get('.card > ul >').should('have.length', 0);
  });
  it('should send a request to the journalist', () => {
    cy.visit('/journalists');
    cy.get(':nth-child(1) > .actions > .outline').click();
    checkURL('/contact')
    cy.get('.router-link-active').click()
    cy.get('.actions > button').click()
    cy.get('.errors').contains('Please enter').should('be.visible')
    cy.get('#username').type("testuser")
    cy.get('#message').type('test message')
    cy.get('.actions > button').click()
    cy.get('dialog').should('not.exist')
    checkURL('/journalists')
  });
  it('should register as journalist from register form inputs', () => {
    cy.visit('/journalists');
    cy.get('.controls > a').click()
    checkURL('auth?redirect=register')
    cy.get('.card').contains('E-Mail').should('be.visible')
    cy.get('#email').type("admin@admin.com");
    cy.get('#password').type("password");
    cy.get('form > :nth-child(3)').contains('Login').click();
    cy.get('form > button').contains('Register').click()
    cy.get('[data-testid="username-form"] > p').should('be.visible')
    cy.get('[data-testid="accountName-form"] > p').should('be.visible')
    cy.get('[data-testid="description-form"] > p').should('be.visible')
    cy.get('[data-testid="areas-invalid"]').should('be.visible')
    cy.get('[data-testid="areas-form"] > p').should('be.visible')
    cy.get('[data-testid="areas-invalid"]').should('be.visible')
    cy.get('[data-testid="areas-form"] > p').should('be.visible')
    cy.get('[data-testid="areas-invalid"]').should('be.visible')
    checkURL('/register')
    cy.get('#username').type('test')
    cy.get('#accountName').type('test')
    cy.get('#description').type('test')
    cy.get(':nth-child(4) > label').click()
    cy.get('form > button').contains('Register').click()
    cy.get('ul > :nth-child(7)').should('be.visible').and('contain', 'test').and('contain', 'PRIVATE')
    checkURL('/journalists')
  });
});
