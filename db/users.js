import { drizzle } from "drizzle-orm/postgres-js";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";

const db = drizzle(sql);

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 64 }),
  password: varchar("password", { length: 64 }),
});

export async function getUser(email) {
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email, password) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}
