import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    transaction_id,
    user_id,
    transaction_type,
    transaction_date,
    stock,
    currency,
    stock_quantity,
    stock_price,
    total_cost,
    market,
  } = await req.json();

  try {
    const res = await sql`
      INSERT INTO transactions (transaction_id, user_id, transaction_type, transaction_date, stock, stock_quantity, currency, stock_price, total_cost, market)
      VALUES (${transaction_id}, ${user_id}, ${transaction_type}, ${transaction_date}, ${stock}, ${stock_quantity}, ${currency}, ${stock_price}, ${total_cost}, ${market});
    `;

    if (!res) {
      throw new Error("Failed to add transaction.");
    }
    return NextResponse.json(
      {
        message: "Transaction added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
