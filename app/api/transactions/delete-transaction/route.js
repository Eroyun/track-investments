import { NextResponse } from "next/server";
import { deleteTransactions } from "@/db/transactions";

export async function POST(req) {
  const { transaction_ids } = await req.json(); // Expect an array of transaction ids

  try {
    const res = await deleteTransactions(transaction_ids);

    if (!res) {
      throw new Error("Failed to delete transaction(s).");
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
