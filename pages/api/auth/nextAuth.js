// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { db } from "../../../lib/firebase"

export default async function auth(req, res) {
  const loggerConfig = {
    error: (code, metadata) => {
      console.error(`[NextAuth] [${code}]`, metadata)
    },
    warn: (code) => {
      console.warn(`[NextAuth] [${code}]`)
    },
    debug: (code, metadata) => {
      console.log(`[NextAuth] [${code}]`, metadata)
    },
  }

  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    adapter: FirestoreAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async session({ session, token, user }) {
        console.log("[NextAuth] Session callback", { session, token, user })
        if (token?.uid) {
          session.user.id = token.uid
        }
        return session
      },
      async jwt({ token, user }) {
        console.log("[NextAuth] JWT callback", { token, user })
        if (user) {
          token.uid = user.id
        }
        return token
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
    debug: true, // Enable debug mode
    logger: loggerConfig,
    events: {
      async signIn(message) { console.log("[NextAuth] Sign in", message) },
      async signOut(message) { console.log("[NextAuth] Sign out", message) },
      async createUser(message) { console.log("[NextAuth] Create user", message) },
      async linkAccount(message) { console.log("[NextAuth] Link account", message) },
      async session(message) { console.log("[NextAuth] Session", message) },
    },
  })
}