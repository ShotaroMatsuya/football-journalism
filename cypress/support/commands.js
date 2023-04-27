// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { checkURL } from './utils';
const compareSnapshotCommand = require('cypress-visual-regression/dist/command');

compareSnapshotCommand();

Cypress.Commands.add('fetchJournalists', () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/journalist',
    },
    {
      statusCode: 200,
      fixture: 'journalists.json',
    }
  ).as('fetch-journalists');
});

Cypress.Commands.add('postRequest', () => {
  cy.intercept({
    method: 'POST',
    url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/requests/*'
  }, {
    stausCode: 200,
    body: {}
  })
})

Cypress.Commands.add('fetchArticlesWithAnalysis', () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/articles/*',
    },
    {
      statusCode: 200,
      fixture: 'articles-with-analysis.json',
    }
  ).as('with-analysis');
});
Cypress.Commands.add('fetchArticlesWithNoAnalysis', () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/articles/*',
    },
    {
      statusCode: 200,
      fixture: 'articles-no-analysis.json',
    }
  ).as('non-analysis');
});
Cypress.Commands.add('fetchNoArticles', () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/articles/*',
    },
    {
      statusCode: 200,
      fixture: 'articles-no-results.json',
    }
  ).as('no-articles');
});
Cypress.Commands.add('fetchSingleArticle', () => {
  cy.intercept({
    method: 'GET',
    url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/article/**/*',
  }, {
    statusCode: 200,
    fixture: 'single-article.json'
  }).as('resultArticle')
})

Cypress.Commands.add('triggerAI', () => {
  cy.intercept(
    {
      method: 'POST',
      url: 'https://uzfy92f1x6.execute-api.ap-northeast-1.amazonaws.com/Prod/api',
    },
    {
      statusCode: 200,
      fixture: 'statemachine-start.json',
    }
  ).as('trigger-ai');
  // https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/journalist
  // https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/articles/*
  // https://uzfy92f1x6.execute-api.ap-northeast-1.amazonaws.com/Prod/api
});

Cypress.Commands.add('getCompleteStatus', () => {
  cy.intercept(
    {
      method: 'POST',
      url: 'https://uzfy92f1x6.execute-api.ap-northeast-1.amazonaws.com/Prod/api/status',
    },
    {
      statusCode: 200,
      fixture: 'status-complete',
    }
  ).as('complete-status');
});

Cypress.Commands.add('getFailedStatus', () => {
  cy.intercept(
    {
      method: 'POST',
      url: 'https://uzfy92f1x6.execute-api.ap-northeast-1.amazonaws.com/Prod/api/status',
    },
    {
      statusCode: 500,
      fixture: 'status-failed',
    }
  ).as('failed-status');
});

Cypress.Commands.add('getRunningStatus', () => {
  cy.intercept(
    {
      method: 'POST',
      url: 'https://uzfy92f1x6.execute-api.ap-northeast-1.amazonaws.com/Prod/api/status',
    },
    {
      statusCode: 200,
      fixture: 'status-running',
    }
  ).as('running-status');
});

Cypress.Commands.add('getArticle', () => {
  cy.intercept(
    {
      method: 'POST',
      url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/articles/*',
    },
    {
      statusCode: 200,
      fixture: 'get-article.json'
    }
  ).as('get-article');
});

Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/auth');
    cy.get('#email').type(username);
    cy.get('#password').type(password);
    cy.get('form > :nth-child(3)').contains('Login').click();
    checkURL('/journalists');
    cy.get(':nth-child(4) > button').contains('Logout');
    cy.contains('Login to Register as Journalist').should('not.exist');
  });
});

Cypress.Commands.add('fetchRequests', () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/requests/*',
    },
    {
      statusCode: 200,
      fixture: 'requests.json',
    }
  ).as('requests');
});

Cypress.Commands.add('fetchNoRequests', () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/requests/*',
    },
    {
      statusCode: 404,
      fixture: 'requests-no-requests.json',
    }
  ).as('no-requests');
});

Cypress.Commands.add('mockAuthRequest', () => {
  cy.intercept({
    method: 'POST',
    url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*'
  },{
    statusCode: 200,
    fixture: 'success-auth.json'
  }).as('mock-auth-request');
})

Cypress.Commands.add('mockRegisterRequest',() => {
  cy.intercept({
    method: 'PUT',
    url: 'https://j611frcsul.execute-api.ap-northeast-1.amazonaws.com/Prod/journalist/*'
  },{
    statusCode: 403,
    body: {"message":"Unauthorized"}
  })
})
