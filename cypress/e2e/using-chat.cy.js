const getRandomString = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .slice(0, 6) || 'nonce';

describe('Using Chat', () => {
  const name = 'user' + getRandomString();
  const email = name + '@example.com';

  beforeEach(() => {
    cy.task('createUser', { email, name });
    cy.visit('localhost:3000');
  });

  it('should log in and log out', () => {
    cy.get('button[data-testid="signin"]').contains('Sign In').should('exist');
    cy.login(email, name);
    cy.get('button').contains('Sign out').should('exist').click();
    cy.get('button[data-testid="signin"]').contains('Sign In').should('exist');
  });

  it('should send a message', () => {
    cy.login(email, name);

    const message = getRandomString();

    cy.get('textarea[name="message"]').type(message);

    cy.get('button').contains('Send').click();

    cy.get('#messages .chat-message')
      .should('have.length.greaterThan', 0)
      .last()
      .contains(message)
      .should('exist');
  });

  afterEach(() => {
    cy.task('deleteUser', { email });
  });
});
