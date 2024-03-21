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
    // Check if there is an existing row with the same stock but different currency
    const existingTransaction = await sql`
      SELECT * FROM transactions WHERE stock = ${stock} AND currency != ${currency} AND market = ${market};
    `;
    if (existingTransaction.rowCount > 0) {
      return NextResponse.json(
        {
          error:
            "A transaction with the same stock but a different currency already exists.",
        },
        { status: 400 }
      );
    }

    const res = await sql`
      INSERT INTO transactions (transaction_id, transaction_type, transaction_date, stock, stock_quantity, currency, stock_price, total_cost, market)
      VALUES (${transaction_id}, ${transaction_type}, ${transaction_date}, ${stock}, ${stock_quantity}, ${currency}, ${stock_price}, ${total_cost}, ${market});
    `;

    if (!res) {
      throw new Error("Failed to add transaction.");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      message: "Transaction added successfully",
    },
    { status: 200 }
  );
}
