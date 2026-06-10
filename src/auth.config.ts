import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config (no Prisma/bcrypt) consumed by proxy.ts for route
 * protection. The Credentials provider itself lives in auth.ts since it
 * needs the Node-only Prisma client.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.clientId = user.clientId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.clientId = token.clientId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
