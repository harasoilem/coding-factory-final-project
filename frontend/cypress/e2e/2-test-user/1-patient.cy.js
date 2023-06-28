/// <reference types="cypress" />
import {faker} from '@faker-js/faker';

describe('patient test', () => {

  beforeEach(() => {
    cy.loginAsDemoUser()
  })

  function materialTextFormFieldHasValue(field, value) {
    cy.get(`[data-test="${field}"]`)
      .find('input')
      .invoke('val')
      .should('equal', value)
  }

  function materialTextAreaFormFieldHasValue(field, value) {
    cy.get(`[data-test="${field}"]`)
      .find('textarea')
      .invoke('val')
      .should('equal', value)
  }

  function materialDropDownFormFieldHasValue(field, value) {
    cy.get(`[data-test="${field}"]`)
      .find('select')
      .invoke('val')
      .should('equal', value)
  }

  it('add new patient', () => {
    cy.visit('/patient-list')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })

    cy.contains('Λίστα Ασθενών')

    cy.get('[data-test="patient-first_name-column"]').should('be.visible')

    let countOfElementsBeforeCreation = 0;
    cy.get('[data-test="patient-first_name-column"]').then($elements => {
      countOfElementsBeforeCreation = $elements.length;
    });

    cy.get('[data-test="add-new-button"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-add')
    })

    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const amka = faker.datatype.number(99999999999).toString();
    const date_of_birth = faker.date.past(50).toLocaleDateString('el-GR', {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    const phone_number = "69" + faker.datatype.number(99999999);
    const address = faker.location.streetAddress();
    const city = faker.location.city();
    const postal_code = faker.datatype.number(99999).toString();


    cy.get('[data-test="first_name"]').type(first_name)
    cy.get('[data-test="last_name"]').type(last_name)
    cy.get('[data-test="amka"]').type(amka)
    cy.get('[data-test="date_of_birth"]').type(date_of_birth)
    cy.get('[data-test="phone_number"]').type(phone_number)
    cy.get('[data-test="address"]').type(address)
    cy.get('[data-test="city"]').type(city)
    cy.get('[data-test="postal_code"]').type(postal_code)

    cy.wait(500)

    cy.get('[data-test="save-patient-button"]').click()

    let snackbarMessageText = 'Ο Ασθενής προστέθηκε επιτυχώς';

    cy.contains(snackbarMessageText, {timeout: 10000}).should('exist')
    cy.contains(snackbarMessageText, {timeout: 10000}).should('not.exist')


    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient/')
    })

    cy.reload()

    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient/')
    })


    materialTextFormFieldHasValue('first_name', first_name)
    materialTextFormFieldHasValue('last_name', last_name)
    materialTextFormFieldHasValue('amka', amka)
    materialTextFormFieldHasValue('phone_number', phone_number)
    materialTextFormFieldHasValue('address', address)
    materialTextFormFieldHasValue('city', city)
    materialTextFormFieldHasValue('postal_code', postal_code)
    materialTextFormFieldHasValue('date_of_birth', date_of_birth)

    cy.visit('/patient-list')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })
    cy.contains('Λίστα Ασθενών')

    let countOfElementsAfterCreation = 0;
    cy.get('[data-test="patient-first_name-column"]').then($elements => {
      countOfElementsAfterCreation = $elements.length;
    }).then(() => {
      assert.equal(countOfElementsAfterCreation, countOfElementsBeforeCreation + 1);
    });

  })


  it('edit patient', () => {
    cy.visit('/patient-list')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })
    cy.contains('Λίστα Ασθενών')

    cy.get('[data-test="patient-first_name-column"]').should('be.visible')

    let countOfElementsBeforeCreation = 0;
    cy.get('[data-test="patient-first_name-column"]').then($elements => {
      countOfElementsBeforeCreation = $elements.length;
    });

    cy.get('[data-test="patient-info-button"]').first().click()

    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient/')
    })


    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const amka = faker.datatype.number(99999999999).toString();




    cy.get('[data-test="first_name"]').type("{selectall}{backspace}")
    cy.get('[data-test="first_name"]').type(first_name)
    cy.get('[data-test="last_name"]').type("{selectall}{backspace}")
    cy.get('[data-test="last_name"]').type(last_name)
    cy.get('[data-test="amka"]').type("{selectall}{backspace}")
    cy.get('[data-test="amka"]').type(amka)



    cy.wait(500)

    cy.get('[data-test="save-patient-button"]').click()

    let snackbarMessageText = 'Ο Ασθενής ενημερώθηκε επιτυχώς';

    cy.contains(snackbarMessageText, {timeout: 10000}).should('exist')
    cy.contains(snackbarMessageText, {timeout: 10000}).should('not.exist')


    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient/')
    })

    cy.reload()

    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient/')
    })


    materialTextFormFieldHasValue('first_name', first_name)
    materialTextFormFieldHasValue('last_name', last_name)
    materialTextFormFieldHasValue('amka', amka)

    cy.visit('/patient-list')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })

    cy.contains('Λίστα Ασθενών')

    let countOfElementsAfterCreation = 0;
    cy.get('[data-test="patient-first_name-column"]').then($elements => {
      countOfElementsAfterCreation = $elements.length;
    }).then(() => {
      assert.equal(countOfElementsAfterCreation, countOfElementsBeforeCreation);
    });

  })

})
