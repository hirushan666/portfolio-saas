import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

export default {
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
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;
