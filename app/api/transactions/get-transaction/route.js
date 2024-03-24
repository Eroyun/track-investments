import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Resolves the issue with Vercel's caching

export async function GET(req) {
  try {
    const transactionID = req.nextUrl.searchParams.get("transactionID");
    const res = await sql`
      SELECT * FROM transactions
      WHERE transaction_id = ${transactionID}
    `;

    if (!res) {
      throw new Error("Failed to get transactions.");
    }

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
