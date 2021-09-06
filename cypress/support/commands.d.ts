/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * Visit website on mobile device
         * @example
         * cy.visitOnMobile('www.google.com')
         */
        visitOnMobile(url: string): Chainable<any>
    }
}