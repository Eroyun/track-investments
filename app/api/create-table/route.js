import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sql`CREATE TABLE stocks (
        transaction_type VARCHAR(12),
        transaction_date DATE,
        stock VARCHAR(255),
        stock_quantity INTEGER,
        currency VARCHAR(3),
        stock_price DECIMAL(10, 2),
        total_cost DECIMAL(10, 2)
    );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
