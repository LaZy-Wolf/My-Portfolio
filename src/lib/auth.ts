import { createHash, timingSafeEqual } from 'node:crypto';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Hash first so both sides have equal length, then compare in constant time.
const same = (a: string, b: string) =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        // No built-in fallback credentials: an unconfigured deploy must not be open to anyone who reads the repo.
        if (!adminEmail || !adminPassword || !credentials?.email || !credentials?.password) return null;

        if (same(credentials.email, adminEmail) && same(credentials.password, adminPassword)) {
          return {
            id: 'admin',
            email: adminEmail,
            name: 'Portfolio Admin',
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  // Required in production. A hard-coded fallback would let anyone forge admin sessions.
  secret: process.env.NEXTAUTH_SECRET,
};
