import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
// import { getUser } from "./db/users";

const config = {
  providers: [
    Credentials({
      async authorize({ email, password }) {
        let user = [{ email: email, password: password }];
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password);
        if (passwordsMatch) return user[0];
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      if (isLoggedIn) return Response.redirect(new URL(nextUrl));
      return false;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
