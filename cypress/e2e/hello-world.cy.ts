describe('Hello World Test', () => {
    it('should display the correct message', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Hello World');
    });
});