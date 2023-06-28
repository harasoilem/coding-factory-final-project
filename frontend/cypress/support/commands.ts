/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// @ts-ignore
Cypress.Commands.add('loginAsDemoUser', () => {
  cy.log('Logging in as test user');
  var backendUrl = Cypress.env('BACKEND_URL') || 'localhost:8000';
  cy.request({
    method: 'POST',
    url: 'http://' + backendUrl + '/auth/login',
    body: {
      username: 'demo',
      password: '123456',
    },
  }).then(({ body }) => {
    cy.log('Logged in as test user');

    cy.log(JSON.stringify(body['username']));

    cy.window().then((win) => {
      win.localStorage.setItem('access_token', body['tokens']['access']);
      win.localStorage.setItem('username', body['username']);
    });
  });
});
