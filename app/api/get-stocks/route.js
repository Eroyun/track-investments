import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await sql`
      SELECT * FROM stocks;
    `;
    console.log("Results:", results);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
