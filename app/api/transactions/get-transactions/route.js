import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Resolves the issue with Vercel's caching

export async function GET(req) {
  try {
    const userID = req.nextUrl.searchParams.get("userID");

    const results = await sql`
      SELECT * FROM transactions
      WHERE user_id = ${userID}
      ORDER BY transaction_date DESC, stock ASC
    `;
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
