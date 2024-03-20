import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const {
    transaction_type,
    transaction_date,
    stock,
    currency,
    stock_quantity,
    stock_price,
    total_cost,
    market,
  } = await req.json();

  const transaction_id = uuidv4();

  try {
    const res = await sql`
      INSERT INTO stocks (transaction_id, transaction_type, transaction_date, stock, stock_quantity, currency, stock_price, total_cost, market)
      VALUES (${transaction_id}, ${transaction_type}, ${transaction_date}, ${stock}, ${stock_quantity}, ${currency}, ${stock_price}, ${total_cost}, ${market});
    `;
    if (!res) {
      throw new Error("Failed to add stock");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      message: "Stock added successfully",
    },
    { status: 200 }
  );
}
