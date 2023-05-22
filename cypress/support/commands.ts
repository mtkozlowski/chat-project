import { addStreamCommands } from '@lensesio/cypress-websocket-testing';

declare global {
  namespace Cypress {
    interface Chainable {
      getRandomString(): string;

      createUser(email: string, name: string): Chainable<void>;

      // deleteUser(email: string): Chainable<void>;

      login(email: string, name: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getRandomString', () => {
  return (
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 6) || 'nonce'
  );
});

Cypress.Commands.add('login', (email: string, name: string) => {
  cy.visit('localhost:3000/api/auth/signin');
  cy.get('input#input-name-for-credentials-provider').type(name);
  cy.get('input#input-email-for-credentials-provider').type(email);
  cy.get('button[type="submit"]').contains('Sign in with Credentials').click();
});

addStreamCommands();
