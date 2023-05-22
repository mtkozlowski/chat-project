import { defineConfig } from 'cypress';
import { prisma } from './src/server/prisma';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async createUser(userData) {
          return await prisma.user.create({
            data: {
              ...userData
            }
          });
        }
      });
      on('task', {
        async deleteUser(userData) {
          return await prisma.user.delete({
            where: {
              email: userData.email
            }
          });
        }
      });
      return config;
    }
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
});
