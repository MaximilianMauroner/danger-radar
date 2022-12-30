import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import InstagramProvider from "next-auth/providers/instagram";
import GoogleProvider from "next-auth/providers/google";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET
    }),
    InstagramProvider({
      clientId: env.INSTAGRAM_CLIENT_ID,
      clientSecret: env.INSTAGRAM_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
  events: {
    async signIn(message) {
      console.log("signin asdfj", message);
    },
    async createUser(message) {
      console.log("createUser asdfj", message);
    },
    async updateUser(message) {
      console.log("updateUser asdfj", message);
    },
    async linkAccount(message) {
      console.log("linkAccount asdfj", message);
    }
  }, logger: {
    error(code, metadata) {
      console.error("df", code, metadata);
    },
    warn(code) {
      console.warn("df", code);
    },
    debug(code, metadata) {
      console.debug("df", code, metadata);
    }
  }
};

export default NextAuth(authOptions);
