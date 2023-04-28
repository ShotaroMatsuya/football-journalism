///<reference path="../../support/index.d.ts" />
import { checkURL } from '../../support/utils';

beforeEach(() => {
  cy.fetchJournalists();
  cy.clock(new Date(2023, 3, 26, 22, 35, 30).getTime(), ['Date']);
});

describe('Auth page', () => {
  it('should login with valid username and password', () => {
    cy.mockAuthRequest()
    cy.visit('/auth');
    cy.get('#email').type("admin@admin.com");
    cy.get('#password').type("password");
    cy.get('form > :nth-child(3)').contains('Login').click();
    checkURL('/journalists');
    cy.get(':nth-child(4) > button').contains('Logout');
    cy.contains('Login to Register as Journalist').should('not.exist');
    
  });
  it("shouldn't login with invalid username and password", () => {
    cy.visit('/auth');
    cy.get('#password').type("password1");
    cy.get('form > :nth-child(3)').contains('Login').click();
    cy.contains('Please enter a valid email and password').should('be.visible');
    checkURL('/auth');
  
  });
  it('should display messages when invalid username or password', () => {
    cy.mockAuthRequest()
    cy.visit('/auth');
    cy.get('#password').type("password1");
    cy.get('form > :nth-child(3)').contains('Login').click();
    cy.contains('Please enter a valid email and password').should('be.visible');
    checkURL('/auth');
    cy.get('#email').type("test@test.com");
    cy.contains('Please enter a valid email and password').should('be.visible');
    cy.get('form > :nth-child(4)').contains('Login').click();
    cy.wait('@mock-auth-request');
  });
  it('should switch mode(signin/signup)', () => {
    cy.visit('/auth');
    cy.get('.flat').contains('Signup instead').click();
    cy.get('form > :nth-child(3)').contains('Signup').should('be.visible');
    cy.get('.flat').contains('Login instead').click();
    cy.get('form > :nth-child(3)').contains('Login').should('be.visible');
  });
  it('should store the token in local storage when login successfully', () => {
    cy.mockAuthRequest()
    cy.visit('/auth');
    cy.get('#email').type("admin@admin.com");
    cy.get('#password').type("password");
    cy.get('form > :nth-child(3)').contains('Login').click();
    checkURL('/journalists');
    cy.get(':nth-child(4) > button').contains('Logout');
    cy.contains('Login to Register as Journalist').should('not.exist');
    cy.getAllLocalStorage().then((result) => {
      expect(result).to.have.property('http://localhost:8080')
      expect(result['http://localhost:8080']).to.have.property('tokenExpiration')
      expect(result['http://localhost:8080']).to.have.property('token')
      expect(result['http://localhost:8080']).to.have.property('userId')
    })
  });
  it('should delete the token in local storage when logout', () => {
    cy.mockAuthRequest()
    cy.visit('/auth');
    cy.get('#email').type("admin@admin.com");
    cy.get('#password').type("password");
    cy.get('form > :nth-child(3)').contains('Login').click();
    checkURL('/journalists');
    cy.get(':nth-child(4) > button').contains('Logout').click();
    cy.getAllLocalStorage().then((result) => {
      expect(result).not.to.have.property('http://localhost:8080', 'tokenExpiration')
      expect(result).not.to.have.property('http://localhost:8080', 'token')
      expect(result).not.to.have.property('http://localhost:8080', 'userId')
    })
  });
});
