import { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      session.user.username = user.username;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
};
