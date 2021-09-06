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
const compareSnapshotCommand = require('cypress-visual-regression/dist/command');

compareSnapshotCommand({
    capture: 'fullPage'
});

Cypress.Commands.add('visitOnMobile', (url) => {
    cy.viewport('iphone-x');
    cy.visit(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        }
    });
})

Cypress.Commands.add('openContactModalFrom', (trigger = 'contactSection') => {
    if (trigger === 'contactBar') {
        cy.get('#sticker-contactForm-opener').click();
    } else if (trigger === 'contactSection') {
        cy.get('#openModalBtn').scrollIntoView().click();
    } else {
        throw new Error("Invalid trigger name! Use contactSection or contactBar");
    }
})

Cypress.Commands.add('submitContactForm', () => {
    cy.get('.contactForm__submitBtn').click();
})

Cypress.Commands.add('clearContactForm', () => {
    cy.get('#sender_email').clear();
    cy.get('#phone').clear();
    cy.get('#content').clear();
})

Cypress.Commands.add('clickQuickMessageButton', (text) => {
    cy
        .get('.defaultMessages__container button')
        .contains(text)
        .click();
})

Cypress.Commands.add('fillContactForm', ({
    email,
    phone,
    message
}) => {
    cy.get('#sender_email').clear().type(email);
    cy.get('#phone').clear().type(phone);
    cy.get('#content').clear().type(message);
})

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