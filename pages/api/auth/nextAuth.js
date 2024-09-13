import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { db } from "../../../lib/firebase"

export default NextAuth({
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
        if (token?.uid) {
            session.user.id = token.uid
        }
        return session
        },
        async jwt({ token, user }) {
        if (user) {
            token.uid = user.id
        }
        return token
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
})