// lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const prisma = new PrismaClient();

export const { auth, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            githubUsername: (profile as any).login,
            githubId: String((profile as any).id),
          },
        });
      }
      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { githubUsername: true, githubId: true },
        });

        if (dbUser) {
          session.user.githubUsername = dbUser.githubUsername;
          session.user.githubId = dbUser.githubId;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
});
