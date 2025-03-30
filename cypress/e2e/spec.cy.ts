describe('My First Test', () => {
  it('Visits the Kitchen Sink', () => {
    cy.visit('http://localhost:3000')
    // cy.visit('https://example.cypress.io')
    cy.contains('button', 'Start Drawing').click();
    cy.url().should('include', '/login');
    cy.contains('button', 'Sign in with Google').click();
  })
})