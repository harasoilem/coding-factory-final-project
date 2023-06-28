/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('auth', () => {


  it('login user', () => {
    cy.visit('/login')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login')
    })
    cy.contains('Nurse App')

    cy.get('[data-test="username"]').type('demo')
    let password = '123456'
    cy.get('[data-test="password"]').type(password)

    var backendUrl = Cypress.env('BACKEND_URL') || 'localhost:8000';

    cy.intercept('POST', 'http://' + backendUrl + '/auth/login', (req) => {
      req.continue((res) => {
        // 'res' represents the real destination response
        // you can manipulate 'res' before it's sent to the browser
      })
    }).as('loginUser')

    cy.get('[data-test="submit"]').click()

    cy.get('[data-test="flat-button-loading-spinner"]').should('exist')
    cy.get('[data-test="flat-button-loading-spinner"]').should('not.exist')

    cy.wait('@loginUser').its('response.body').then((body) => {

      cy.location().should((location) => {
        expect(location.pathname).to.eq('/patient-list')
      })

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


  it('logout user', () => {
    cy.loginAsDemoUser()

    cy.visit('/patient-list')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })
    cy.contains('Λίστα Ασθενών')

    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).not.to.eq(null)
      expect(win.localStorage.getItem('username')).not.to.eq(null)
    })

    cy.get('[data-test="menu-logout-button"]').should('be.visible')
    cy.get('[data-test="menu-logout-button"]').click()

    cy.get('[data-test="dialog-ok"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login')
    })
    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.eq(null)
      expect(win.localStorage.getItem('username')).to.eq(null)
    })
  })

  it('logout user cancel', () => {
    cy.loginAsDemoUser()

    cy.visit('/patient-list')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })
    cy.contains('Λίστα Ασθενών')


    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).not.to.eq(null)
      expect(win.localStorage.getItem('username')).not.to.eq(null)
    })


    cy.get('[data-test="menu-logout-button"]').should('be.visible')
    cy.get('[data-test="menu-logout-button"]').click()

    cy.get('[data-test="dialog-cancel"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })
    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).not.to.eq(null)
      expect(win.localStorage.getItem('username')).not.to.eq(null)
    })
  })


  it('go to login if logged in and get 401', () => {

    cy.loginAsDemoUser()


    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).not.to.eq(null)
      expect(win.localStorage.getItem('username')).not.to.eq(null)
    })


    var backendUrl = Cypress.env('BACKEND_URL') || 'localhost:8000';

    cy.intercept('GET', 'http://' + backendUrl + '/api/v1/patient', {
      statusCode: 401,
      body: {
        name: 'Peter Pan',
      },
    })


    cy.visit('/admin')

    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login')
    })
    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.eq(null)
      expect(win.localStorage.getItem('username')).to.eq(null)
    })

  })



  it('stay on same page and get 401', () => {

    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.eq(null)
      expect(win.localStorage.getItem('username')).to.eq(null)
    })


    var backendUrl = Cypress.env('BACKEND_URL') || 'localhost:8000';

    cy.intercept('GET', 'http://' + backendUrl + '/api/v1/patient', {
      statusCode: 401,
      body: {
        name: 'Peter Pan',
      },
    })

    cy.visit('/')

    cy.contains('Nurse App').should('exist')

    cy.location().should((location) => {
      expect(location.pathname).to.eq('/login')
    })
    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.eq(null)
      expect(win.localStorage.getItem('username')).to.eq(null)
    })

  })





})
