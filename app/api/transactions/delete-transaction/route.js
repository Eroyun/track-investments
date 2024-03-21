import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { transaction_ids } = await req.json(); // Expect an array of transaction ids

  try {
    const arr = transaction_ids.map((id) => ({ transaction_id: id }));

    await sql.query(
      `DELETE FROM transactions
       WHERE transaction_id IN (
         SELECT transaction_id FROM json_populate_recordset(NULL::transactions, $1)
       )`,
      [JSON.stringify(arr)]
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json(
    {
      message: "Transactions deleted successfully",
    },
    { status: 200 }
  );
}
