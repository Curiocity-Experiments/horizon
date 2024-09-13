// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { getConfig } from "../../../config/privateLabel"

const prisma = new PrismaClient()

export default async function auth(req, res) {
  const config = getConfig(req.headers.host);

  return await NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: config.googleClientId,
        clientSecret: config.googleClientSecret,
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        session.user.id = user.id
        session.user.role = user.role
        return session
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  })
}