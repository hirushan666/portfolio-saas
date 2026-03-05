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
    async jwt({ token, user, profile, account }) {
      if (user) {
        token.id = user.id;
      }

      // If this is a sign-in event with GitHub, update token and DB immediately (fixes missing data issue)
      if (account?.provider === "github" && profile?.login && token.sub) {
        token.githubUsername = (profile as any).login;
        token.githubId = String((profile as any).id);

        // Auto-heal the database just in case linkAccount didn't run previously
        await prisma.user.update({
          where: { id: token.sub },
          data: {
            githubUsername: token.githubUsername as string,
            githubId: token.githubId as string,
          },
        });
      } else if (token.sub) {
        // Normal session refresh logic
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
