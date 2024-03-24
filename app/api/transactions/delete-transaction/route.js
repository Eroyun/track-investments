import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req) {
  const { transaction_ids } = await req.json(); // Expect an array of transaction ids

  try {
    const arr = transaction_ids.map((id) => ({ transaction_id: id }));

    const res = await sql.query(
      `DELETE FROM transactions
       WHERE transaction_id IN (
         SELECT transaction_id FROM json_populate_recordset(NULL::transactions, $1)
       )`,
      [JSON.stringify(arr)]
    );

    if (!res) {
      throw new Error("Failed to delete transaction(s)");
    }

    return NextResponse.json(
      {
        message: "Transaction(s) deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
