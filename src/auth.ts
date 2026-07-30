import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

type AppRole = 'admin' | 'user';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const username = String(credentials.username ?? '').trim();
        const password = String(credentials.password ?? '');
        if (!username || !password) return null;

        const adminUser = process.env.ADMIN_USER ?? 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (adminPassword && username === adminUser && password === adminPassword) {
          return { id: 'admin', name: username, role: 'admin' as AppRole };
        }

        const normalUser = process.env.NORMAL_USER ?? 'user';
        const normalPassword = process.env.NORMAL_PASSWORD;
        if (normalPassword && username === normalUser && password === normalPassword) {
          return { id: 'user', name: username, role: 'user' as AppRole };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role === 'admin' ? 'admin' : 'user';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
