import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { sql } from "@vercel/postgres";

const config = {
  providers: [
    Credentials({
      async authorize({ email, password }) {
        const res = await sql`SELECT * FROM users WHERE email = ${email};`;
        const user = res.rows;
        if (user.length === 0) return null;
        const passwordsMatch = await compare(password, user[0].password);
        if (passwordsMatch) return user[0];
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (isLoggedIn) return Response.redirect(new URL(nextUrl));
      return false;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
