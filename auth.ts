import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";

export type UserRole = "ADMIN" | "USER";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    /*
    async signIn({ user }) {
      console.log({ userSignIn: user });
      if (!user?.id) return false;

      const existingUser = await getUserById(user.id);

      if (!existingUser || !existingUser.emailVerified) return false;
      
      return true;
    },
    */

    async session({ token, session }) {
      console.log({ sessionToken: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      
      token.role = existingUser.role;

      console.log({ token });
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});