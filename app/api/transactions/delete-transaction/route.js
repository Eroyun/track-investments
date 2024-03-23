import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { withMiddleware } from "../../middleware";

export const POST = withMiddleware(async (req) => {
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
    return NextResponse.json(
      {
        message: "Transactions deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
