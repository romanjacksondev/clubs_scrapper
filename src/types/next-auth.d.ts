import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: 'admin' | 'user';
  }

  interface Session {
    user: DefaultSession['user'] & {
      role: 'admin' | 'user';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'admin' | 'user';
  }
}
