import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result = await sql`CREATE TABLE stocks (
        transaction_date DATE,
        stock VARCHAR(255),
        stock_quantity INTEGER,
        stock_price DECIMAL(10, 2),
        total_cost DECIMAL(10, 2)
    );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
