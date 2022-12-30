import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import InstagramProvider from "next-auth/providers/instagram";
import GoogleProvider from "next-auth/providers/google";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  debug: true,
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
      clientSecret: env.INSTAGRAM_CLIENT_SECRET,
      client: {
        token_endpoint_auth_method: "client_secret_post"
      }
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ]
};

export default NextAuth(authOptions);
