import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "next-fb-patch"
import { fetch_db } from '../../../fb/Firebase'
import * as firestoreFunctions from "firebase/firestore"

const db = fetch_db();

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    adapter: FirebaseAdapter({
        db: db,
        ...firestoreFunctions,
    }),
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = String(token.uid);
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: 'jwt',
    },
});