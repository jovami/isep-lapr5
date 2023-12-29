function loginViaAuth0Ui(username: string, password: string) {
    cy.origin(
        Cypress.env('auth_domain'),
        { args: { username, password } },
        ({ username, password }) => {
            cy.get('input#1-email').type(username)
            cy.get('input#1-password').type(password, { log: false })
            cy.get('button[type="submit"]')
                .should('be.visible')
                .should('contain.text', 'Log In')
                .should('not.be.disabled')
                .should('not.be.hidden')
                .click()
        },
    )
}

describe('Backoffice user Form e2e tests', () => {
    beforeEach(() => {

        window.localStorage.setItem('USER_ROLES', 'ADM')
        cy.visit('/users/create')

        const log = Cypress.log({
            displayName: 'AUTH0 LOGIN',
            message: [`🔐 Authenticating | ${Cypress.env('auth_username')}`],
            // @ts-ignore
            autoEnd: false,
        })
        log.snapshot('before')

        loginViaAuth0Ui(Cypress.env('auth_username'), Cypress.env('auth_password'))

        log.snapshot('after')
        log.end()
    })

    it('has the correct title', () => {
        cy.title().should('equal', 'Create backoffice user')
    })

    it('should have empty initial values', () => {

        cy.get('#name').should('have.value', '')
        cy.get('#email').should('have.value', '')
        cy.get('#phoneNumber').should('have.value', '')
        cy.get('#password').should('have.value', '')

    })


    it('should submit the form successfully and display created Backoffice user', () => {


        const name = 'quim'
        const role = 'Fleet Manager'
        const email = 'joaquimfontesxto@isep.ipp.pt'
        const phoneNumber = '123781265'
        const password = 'Passw0rd!F'


        cy.get('#role').select(role)
        cy.get('#name').type(name)
        cy.get('#email').type(email)
        cy.get('#phoneNumber').type(phoneNumber)
        cy.get('#password').type(password)


        cy.intercept('POST', 'http://localhost:4000/api/users-backoffice', {
            statusCode: 201,
            body: {
                name: name,
                role: role,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
            },
        }).as('createBackofficeUser')


        cy.get('button[type="submit"]').click()
        cy.wait('@createBackofficeUser')

    })
})