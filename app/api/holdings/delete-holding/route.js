import { NextResponse } from "next/server";
import { getTransactionById } from "@/db/transactions";
import {
  getHoldingsByStockCurrencyMarket,
  deleteHoldingsBasedOnTransaction,
  removeBuyTransaction,
} from "@/db/holdings";

export async function POST(req) {
  try {
    const { transaction_ids } = await req.json();

    for (let transaction_id of transaction_ids) {
      // Fetch the transaction details using the transaction id
      const transactionResponse = await getTransactionById(transaction_id);
      const transaction = transactionResponse.rows[0];

      if (!transaction) {
        throw new Error(`Transaction with id ${transaction_id} not found.`);
      }

      let res;
      if (transaction.transaction_type.toLowerCase() === "buy") {
        // Fetch the current holdings for the stock
        const holdingResponse = await getHoldingsByStockCurrencyMarket(
          transaction.stock,
          transaction.currency,
          transaction.market
        );

        const holding = holdingResponse.rows[0];

        if (!holding) {
          throw new Error(`No holdings found for stock ${transaction.stock}.`);
        }

        // Calculate the new quantities and costs
        const newQuantity = holding.stock_quantity - transaction.stock_quantity;
        const newCost = holding.total_cost - transaction.total_cost;
        const newPrice =
          holding.total_cost - transaction.total_cost / newQuantity;

        if (newQuantity === 0) {
          // If the new quantity is zero, delete the row
          res = await deleteHoldingsBasedOnTransaction(transaction);
        } else {
          // Otherwise, update the row
          res = await removeBuyTransaction(
            transaction,
            newQuantity,
            newCost,
            newPrice
          );
        }
      } else if (transaction.transaction_type.toLowerCase() === "sell") {
        // If the transaction was a sell, we need to buy back the sold stocks
        res = await removeSellTransaction(transaction);
      }

      if (!res) {
        throw new Error(
          `Failed to reverse transaction with id ${transaction_id}.`
        );
      }
    }

    return NextResponse.json({
      message: `Successfully deleted ${transaction_ids.length} transaction(s).`,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
