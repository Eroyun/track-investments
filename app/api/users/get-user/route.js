import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req) {
  try {
    const res = await sql`
        SELECT * FROM users 
        WHERE email = ${req.nextUrl.searchParams.get("email")};
        `;

    if (!res) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
