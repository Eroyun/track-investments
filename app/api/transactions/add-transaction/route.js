import { NextResponse } from "next/server";
import { insertTransaction } from "@/db/transactions";

export async function POST(req) {
  const {
    transaction_id,
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
    const res = await insertTransaction(
      transaction_id,
      transaction_type,
      transaction_date,
      stock,
      currency,
      stock_quantity,
      stock_price,
      total_cost,
      market
    );

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
