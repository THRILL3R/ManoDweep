import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        if (user.accountStatus === "DEACTIVATED") return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        if (!user.firstLoginAt) {
          await prisma.user.update({
            where: { id: user.id },
            data: { firstLoginAt: new Date() },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
          dogName: user.dogName,
          gender: user.gender,
          firstLoginAt: (user.firstLoginAt ?? new Date()).toISOString(),
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const existing = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (existing) {
          if (existing.accountStatus === "DEACTIVATED") {
            return "/login?error=AccountDeactivated";
          }
          if (!existing.googleId) {
            return "/login?error=OAuthAccountNotLinked";
          }
          if (!existing.firstLoginAt) {
            await prisma.user.update({
              where: { id: existing.id },
              data: { firstLoginAt: new Date() },
            });
          }
          return true;
        }

        return `/register/age?google=1&email=${encodeURIComponent(profile.email)}&name=${encodeURIComponent((profile.name ?? "").split(" ")[0])}`;
      }
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.accountStatus = (user as { accountStatus?: string }).accountStatus;
        token.dogName = (user as { dogName?: string }).dogName;
        token.gender = (user as { gender?: string }).gender;
        token.firstLoginAt = (user as { firstLoginAt?: string }).firstLoginAt;
      }
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.accountStatus = dbUser.accountStatus;
          token.dogName = dbUser.dogName;
          token.gender = dbUser.gender;
          token.firstLoginAt = (dbUser.firstLoginAt ?? new Date()).toISOString();
        }
      }
      // Re-fetch mutable fields from DB whenever the session is explicitly updated
      // (e.g. after the user saves their profile)
      if (trigger === "update" && token.id) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { dogName: true, gender: true, accountStatus: true },
        });
        if (fresh) {
          token.dogName = fresh.dogName;
          token.gender = fresh.gender;
          token.accountStatus = fresh.accountStatus;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { accountStatus?: string }).accountStatus = token.accountStatus as string;
        (session.user as { dogName?: string }).dogName = token.dogName as string;
        (session.user as { gender?: string }).gender = token.gender as string;
        (session.user as { firstLoginAt?: string }).firstLoginAt = token.firstLoginAt as string;
      }
      return session;
    },
  },
});
