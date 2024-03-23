import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { withMiddleware } from "../../middleware";

export const POST = withMiddleware(async () => {
  try {
    const { transaction_ids } = await req.json();

    for (let transaction_id of transaction_ids) {
      // Fetch the transaction details using the transaction id
      const transactionResponse = await sql`
        SELECT * FROM transactions
        WHERE transaction_id = ${transaction_id};
      `;
      const transaction = transactionResponse.rows[0];

      if (!transaction) {
        throw new Error(`Transaction with id ${transaction_id} not found.`);
      }

      let res;
      if (transaction.transaction_type.toLowerCase() === "buy") {
        // Fetch the current holdings for the stock
        const holdingResponse = await sql`
          SELECT * FROM holdings
          WHERE stock = ${transaction.stock} AND currency = ${transaction.currency} AND market = ${transaction.market};
        `;

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
          res = await sql`
            DELETE FROM holdings
            WHERE stock = ${transaction.stock} AND currency = ${transaction.currency} AND market = ${transaction.market};
          `;
        } else {
          // Otherwise, update the row
          res = await sql`
            UPDATE holdings SET
              stock_quantity = ${newQuantity},
              total_cost = ${newCost},
              stock_price = ${newPrice},
              profit_loss = holdings.profit_loss,
              sold = false
            WHERE stock = ${transaction.stock} AND currency = ${transaction.currency} AND market = ${transaction.market};
          `;
        }
      } else if (transaction.transaction_type.toLowerCase() === "sell") {
        // If the transaction was a sell, we need to buy back the sold stocks
        res = await sql`
          UPDATE holdings SET
            stock_quantity = holdings.stock_quantity + ${transaction.stock_quantity},
            total_cost = holdings.total_cost + ${transaction.total_cost},
            stock_price = (holdings.total_cost + ${transaction.total_cost}) / (holdings.stock_quantity + ${transaction.stock_quantity}),
            profit_loss = holdings.profit_loss - ${transaction.stock_quantity} * (${transaction.stock_price} - holdings.stock_price),
            sold = false
          WHERE stock = ${transaction.stock} AND currency = ${transaction.currency} AND market = ${transaction.market};
        `;
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
});
