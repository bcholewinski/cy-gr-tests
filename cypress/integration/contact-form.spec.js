/// <reference types="cypress" />

describe('Offer contact form', () => {

    beforeEach(() => {
        cy.visitOnMobile('https://gratka.pl/nieruchomosci/mieszkanie-antoniki/ob/17028377');
    })

    context('Visual regression', () => {

        beforeEach(() => {
            cy.openContactModalFrom('contactSection');
        });

        it('looks the same as before', () => {
            cy.get('.contactForm.modalBox.modalBox--visible').compareSnapshot('contactFormModal', 0.1);
        });

    });

    context('Visibility modal', () => {

        it('can be toggled form contact section', () => {
            cy.openContactModalFrom('contactSection');
            toggleContactFormCheck();
        })

        it('can be toggled form contact bar', () => {
            cy.openContactModalFrom('contactBar');
            toggleContactFormCheck();
        })

    })

    context('Fields validations', () => {

        beforeEach(() => {
            cy.openContactModalFrom('contactSection');
            cy
                .get('#sender_email-error')
                .as('emailError')
                .should('not.be.visible');
            cy
                .get('#phone-error')
                .as('phoneError')
                .should('not.be.visible');
            cy
                .get('#content-error')
                .as('contentError')
                .should('not.be.visible');
            cy.clearContactForm();
        })

        it('has the required field validation', () => {
            cy.submitContactForm();
            cy.get('@emailError').should('contain', 'Pole "E-mail" jest wymagane');
            cy.get('@phoneError').should('contain', 'Pole "Telefon" jest wymagane');
            cy.get('@contentError').should('contain', 'Pole "Twoja wiadomość" jest wymagane');
        })

        it('has phone and email format validation', () => {
            cy.fillContactForm({
                email: 'fake.email.123@gratka',
                phone: '123',
                message: 'Wiadomość testowa'
            });
            cy.submitContactForm();
            cy.get('@emailError').should('contain', 'Wpisz prawidłowy format adresu e-mail');
            cy.get('@phoneError').should('contain', 'Nieprawidłowy format numeru telefonu komórkowego');
        })

    })

    context('Quick message buttons', () => {

        beforeEach(() => {
            cy.openContactModalFrom('contactSection');
        })

        it('fills textarea with message about valid offer', () => {
            cy.clickQuickMessageButton('Czy aktualne?');
            verifyMessageContent('Piszę w sprawie ogłoszenia na Gratka.pl. Czy oferta jest nadal aktualna?');
        })

        it('fills textarea with message about photos', () => {
            cy.clickQuickMessageButton('Proszę o więcej zdjęć');
            verifyMessageContent('Piszę w sprawie ogłoszenia na Gratka.pl. Czy mogę otrzymać więcej zdjęć?');
        })

        it('fills textarea with message about movie', () => {
            cy.clickQuickMessageButton('Proszę o film');
            verifyMessageContent('Piszę w sprawie ogłoszenia na Gratka.pl. Czy mogę zobaczyć szczegóły na wideo?');
        })

        it('fills textarea with message about video call', () => {
            cy.clickQuickMessageButton('Proszę o wideoczat');
            verifyMessageContent('Piszę w sprawie ogłoszenia na Gratka.pl. Czy mogę zobaczyć szczegóły podczas wideorozmowy np. Messenger, WhatsApp, Skype?');
        })

    });

    it('successfully sent message', () => {
        cy.openContactModalFrom('contactSection');
        cy.intercept('POST', '**/send-contact-form').as('sendContactForm')


        const email = 'fake.email.123@gratka.pl';
        const phone = '123123123';
        const message = 'Wiadomość testowa 🙂 Lorem ipsum dolor sit amet, Римский император Константин I Великий, 北京位於華北平原的西北边缘';


        cy.fillContactForm({
            email,
            phone,
            message
        })
        cy.submitContactForm();

        cy
            .wait('@sendContactForm')
            .its('response.statusCode')
            .should('eq', 200)
        cy
            .get('@sendContactForm')
            .its('request.body')
            .should('include', email)
            .and('include', phone)
            .and('include', message)
    })
})

const toggleContactFormCheck = () => {
    cy.get('.contactForm__formContainer .contactForm__submitBtn').as('submitBtn')
    cy.get('@submitBtn').should('be.visible') // form zamiast przycisku sprawdzać
    cy.get('#closeModalBtn').click()
    cy.get('@submitBtn').should('not.be.visible') // form zamiast przycisku sprawdzać
}

const verifyMessageContent = (text) => {
    cy
        .get('textarea#content')
        .should('have.value', text)
}