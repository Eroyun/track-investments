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
        if (user[0]) {
          const passwordsMatch = await compare(password, user[0].password);
          if (passwordsMatch) return user[0];
        }
        throw new Error(
          "The email or password you entered is incorrect. Please try again."
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (token) {
        const res =
          await sql`SELECT * FROM users WHERE email = ${token.email};`;
        const user = res.rows;
        if (user[0]) {
          return token;
        }
      }
      throw new Error(
        "There was an error retrieving your user information. Please try again."
      );
    },
  },
};

export const { handlers } = NextAuth(config);
