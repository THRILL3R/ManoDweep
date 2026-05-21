import type { NextAuthConfig } from "next-auth";

/**
 * Lightweight auth config for the Edge runtime (middleware).
 * Must NOT import Prisma, bcryptjs, or any other Node.js-only module.
 * The JWT callbacks here simply pass through the token fields that were
 * stored during sign-in by the full config in src/lib/auth.ts.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // providers are only needed for sign-in, not for JWT verification
  callbacks: {
    jwt({ token }) {
      // Custom fields (role, accountStatus, dogName, firstLoginAt) are already
      // embedded in the JWT payload from sign-in — just pass the token through.
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { accountStatus?: string }).accountStatus =
          token.accountStatus as string;
        (session.user as { dogName?: string }).dogName = token.dogName as string;
        (session.user as { gender?: string }).gender = token.gender as string;
        (session.user as { firstLoginAt?: string }).firstLoginAt =
          token.firstLoginAt as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
