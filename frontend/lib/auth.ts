// lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  ...authConfig,
  events: {
    async linkAccount({ user, account, profile }) {
      if (account.provider === "github" && profile) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            githubUsername: (profile as any).login,
            githubId: String((profile as any).id),
          },
        });
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
      }

      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { githubUsername: true, githubId: true },
        });

        if (dbUser) {
          token.githubUsername = dbUser.githubUsername;
          token.githubId = dbUser.githubId;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.githubUsername = token.githubUsername as string;
        session.user.githubId = token.githubId as string;
      }
      return session;
    },
  },
});
