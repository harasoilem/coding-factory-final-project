/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('auth', () => {
  // beforeEach(() => {
  //   cy.visit('/')
  // })

  it('shows login page if not logged in', () => {
    cy.visit('/patient-list')
    cy.contains('Nurse App')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login')
    })
  })

  it('shows login page', () => {
    cy.visit('/login')
    cy.contains('Nurse App')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login')
    })
  })

  it('login user', () => {
    cy.visit('/login')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login')
    })
    cy.contains('Nurse App')

    cy.get('[data-test="username"]').type('demo')
    let password = '123456'
    cy.get('[data-test="password"]').type(password)

    let backendUrl = Cypress.env('BACKEND_URL') || 'localhost:8000';

    cy.intercept('POST', 'http://' + backendUrl + '/auth/login', (req) => {
      req.continue((res) => {
        // 'res' represents the real destination response
        // you can manipulate 'res' before it's sent to the browser
      })
    }).as('loginUser')

    cy.get('[data-test="submit"]').click()

    cy.wait('@loginUser').its('response.body').then((body) => {

      cy.location().should((location) => {
        expect(location.pathname).to.eq('/patient-list')
      })

      cy.contains('Λίστα Ασθενών')

      let successMessage = 'welcome demo'

      cy.contains(successMessage, { timeout: 30000 }).should('exist')
      cy.contains(successMessage, { timeout: 30000 }).should('not.exist')
      let access_token = body.tokens.access
      let tenant = body.tenant
      let username = body.username

      cy.window().then((win) => {
        expect(win.localStorage.getItem('access_token')).to.eq(access_token)
        expect(win.localStorage.getItem('username')).to.eq(username)
      })


    })

  })

})
