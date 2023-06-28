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

  it('add new patient report', () => {
    cy.visit('/patient-list')
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/patient-list')
    })

    cy.contains('Λίστα Ασθενών')

    cy.get('[data-test="patient-first_name-column"]').contains('John').parent().find('[data-test="patient-info-button"]').click()

    cy.location().should((location) => {
      expect(location.pathname).to.contains('/patient/')
    })

    cy.contains('Patient Report')


    let countOfElementsBeforeCreation = 0;
    cy.get('[data-test="patientreport-symptoms-column"]').then($elements => {
      countOfElementsBeforeCreation = $elements.length;
    });

    cy.get('[data-test="card-table-add-new-patient-report"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.contains('/patient-report/add/')
    })


    const symptoms = faker.lorem.words(5);
    const medication = faker.lorem.words(5);
    const allergies = faker.lorem.words(5);
    const diagnosis = faker.lorem.words(5);
    const treatment = faker.lorem.words(5);



    cy.get('[data-test="symptoms"]').type(symptoms)
    cy.get('[data-test="medication"]').type(medication)
    cy.get('[data-test="allergies"]').type(allergies)
    cy.get('[data-test="diagnosis"]').type(diagnosis)
    cy.get('[data-test="treatment"]').type(treatment)

    cy.wait(500)

    cy.get('[data-test="save-patient-report-button"]').click()


    let snackbarMessageText = 'Η Αναφορά Ασθενή προστέθηκε επιτυχώς';

    cy.contains(snackbarMessageText, {timeout: 10000}).should('exist')
    cy.contains(snackbarMessageText, {timeout: 10000}).should('not.exist')


    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient-report/')
    })

    cy.reload()

    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient-report/')
    })


    materialTextAreaFormFieldHasValue('symptoms', symptoms)
    materialTextAreaFormFieldHasValue('medication', medication)
    materialTextAreaFormFieldHasValue('allergies', allergies)
    materialTextAreaFormFieldHasValue('diagnosis', diagnosis)
    materialTextAreaFormFieldHasValue('treatment', treatment)

    cy.get('[data-test="patient-link"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.contains('/patient/')
    })
    cy.contains('Patient Report')

    let countOfElementsAfterCreation = 0;
    cy.get('[data-test="patientreport-symptoms-column"]').then($elements => {
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

    cy.get('[data-test="patient-first_name-column"]').contains('John').parent().find('[data-test="patient-info-button"]').click()

    cy.contains('Patient Report')


    let countOfElementsBeforeCreation = 0;
    cy.get('[data-test="patientreport-symptoms-column"]').then($elements => {
      countOfElementsBeforeCreation = $elements.length;
    });

    cy.get('[data-test="patientreport-info-button"]').first().click()

    cy.location().should((location) => {
      expect(location.pathname).to.contains('/patient-report/')
    })


    const symptoms = faker.lorem.words(5);
    const treatment = faker.lorem.words(5);

    cy.get('[data-test="symptoms"]').type(symptoms)
    cy.get('[data-test="treatment"]').type(treatment)

    cy.get('[data-test="symptoms"]').type("{selectall}{backspace}")
    cy.get('[data-test="symptoms"]').type(symptoms)
    cy.get('[data-test="treatment"]').type("{selectall}{backspace}")
    cy.get('[data-test="treatment"]').type(treatment)

    cy.wait(500)

    cy.get('[data-test="save-patient-report-button"]').click()

    let snackbarMessageText = 'Η Αναφορά Ασθενή ενημερώθηκε επιτυχώς';


    cy.contains(snackbarMessageText, {timeout: 10000}).should('exist')
    cy.contains(snackbarMessageText, {timeout: 10000}).should('not.exist')


    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient-report/')
    })

    cy.reload()

    cy.location().should((location) => {
      expect(location.pathname).to.contain('/patient-report/')
    })


    materialTextAreaFormFieldHasValue('symptoms', symptoms)
    materialTextAreaFormFieldHasValue('treatment', treatment)

    cy.get('[data-test="patient-link"]').click()
    cy.location().should((location) => {
      expect(location.pathname).to.contains('/patient/')
    })
    cy.contains('Patient Report')

    let countOfElementsAfterCreation = 0;
    cy.get('[data-test="patientreport-symptoms-column"]').then($elements => {
      countOfElementsAfterCreation = $elements.length;
    }).then(() => {
      assert.equal(countOfElementsAfterCreation, countOfElementsBeforeCreation);
    });

  })

})
