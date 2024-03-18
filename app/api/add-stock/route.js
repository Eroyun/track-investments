import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { transaction_date, stock, stock_quantity, stock_price, total_cost } =
    await req.json();

  try {
    await sql`
      INSERT INTO Stocks (transaction_date, stock, stock_quantity, stock_price, total_cost)
      VALUES (${transaction_date}, ${stock}, ${stock_quantity}, ${stock_price}, ${total_cost});
    `;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(
    {
      message: "Stock added successfully",
    },
    { status: 200 }
  );
}
