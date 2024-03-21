import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { transaction_id } = await req.json();

  try {
    const res = await sql`
      DELETE FROM transactions
      WHERE transaction_id = ${transaction_id};
    `;
    if (!res) {
      throw new Error("Failed to delete transaction.");
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json(
    {
      message: "Transaction deleted successfully",
    },
    { status: 200 }
  );
}
