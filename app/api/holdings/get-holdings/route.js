import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Resolves the issue with Vercel's caching

export async function GET(req) {
  try {
    const userID = req.nextUrl.searchParams.get("userID");
    const res = await sql`
      SELECT * FROM holdings 
      WHERE user_id = ${userID}
      ORDER BY stock ASC;
    `;

    if (!res) {
      return NextResponse.json({ error: "No holdings found" }, { status: 404 });
    }

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
