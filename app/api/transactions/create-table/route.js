import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Resolves the issue with Vercel's caching

export async function GET() {
  try {
    const result = await sql`CREATE TABLE IF NOT EXISTS transactions (
        transaction_id UUID,
        transaction_type VARCHAR(12),
        transaction_date DATE,
        stock VARCHAR(255),
        stock_quantity INTEGER,
        currency VARCHAR(3),
        stock_price DECIMAL(10, 2),
        total_cost DECIMAL(10, 2),
        market VARCHAR(12),
        user_id INTEGER REFERENCES users(id)
    );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
