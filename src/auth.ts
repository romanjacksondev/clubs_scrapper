import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const adminUser = process.env.ADMIN_USER ?? 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) return null;
        if (credentials.username === adminUser && credentials.password === adminPassword) {
          return { id: '1', name: String(credentials.username) };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});
