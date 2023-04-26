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
      expect(result).to.deep.equal({
        'http://localhost:8080': {
          token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU3OTMwMjdkYWI0YzcwNmQ2ODg0NGI4MDk2ZTBlYzQzMjYyMjIwMDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdnVlLWh0dHAtZGVtby1mYTdkYiIsImF1ZCI6InZ1ZS1odHRwLWRlbW8tZmE3ZGIiLCJhdXRoX3RpbWUiOjE2ODI1MTQ3NDIsInVzZXJfaWQiOiJsNHJwYzRweG5NZnJvaWhuSTdWOVpNdkhmMDQyIiwic3ViIjoibDRycGM0cHhuTWZyb2lobkk3VjlaTXZIZjA0MiIsImlhdCI6MTY4MjUxNDc0MiwiZXhwIjoxNjgyNTE4MzQyLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJhZG1pbkBhZG1pbi5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.NUdi1Ur1brNdAd9D3AVaOvKuPYpK8Grf_DVY9vMWtIYCjbCGuRagGB5R2gZES6Wdv3uNloNTcy8xpMZQ3p9sWxpeSfNFC8QCZ6JWJ9xCObbpfmoWlAoy_ThCB8fn6yVqOv9TdCjCfYvm-CxDc6t74a-RzMxmw7pQC3VsTsj0XGA_el5JoDYAO5udHh-r71NaJluZRWSDUBajdI6I1orFDh8HIMMJOa2DkuiaAg5gt36a2_lvKKSuSrVp1wwwFQUPZX6d5SK15wXBkz6V3m8tIVxk9P4ElqHZUC7o9HwcYF_sDZjmnpiqrkEOWcfD-IA-C4WJS9Rvyze2TOP_hplW0g",
          tokenExpiration : "1682519730000",
          userId: "l4rpc4pxnMfroihnI7V9ZMvHf042"
        },
      })
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
      expect(result).to.deep.equal({})
    })
  });
});
