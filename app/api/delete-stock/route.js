import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { transaction_date, stock, stock_quantity } = await req.json();
  const date = new Date(transaction_date);
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  try {
    const res = await sql`
      DELETE FROM stocks
      WHERE transaction_date = ${formattedDate} AND stock = ${stock} AND stock_quantity = ${stock_quantity};
    `;
    console.log(res);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json(
    {
      message: "Stock deleted successfully",
    },
    { status: 200 }
  );
}
