import NextAuth from 'next-auth';
import { AppProviders } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../server/prisma';

const providers: AppProviders = [
  CredentialsProvider({
    name: 'Credentials',
    async authorize(credentials) {
      if (credentials) {
        return await prisma.user.findUnique({
          where: {
            id: credentials.email
          }
        });
      }
      return null;
    },
    credentials: {
      name: { type: 'text', label: 'Name' },
      email: { type: 'email', label: 'Email' }
    }
  })
];
export default NextAuth({
  providers
});
