import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

pages: {
    signIn: '/auth/signin'
}

export default NextAuth(authOptions);
