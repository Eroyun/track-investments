import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { genSaltSync, hashSync } from "bcrypt-ts";

export const dynamic = "force-dynamic"; // Resolves the issue with Vercel's caching

// Create User table if not exists
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    const result =
      await sql`INSERT INTO users (email, password) VALUES (${email}, ${hash});`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
