import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      user_id,
      stock,
      stock_quantity,
      currency,
      stock_price,
      total_cost,
      market,
      transaction_type,
    } = await req.json();
    let res;

    // Check if there is an existing row with the same stock but different currency
    const existingHolding = await sql`
      SELECT * FROM holdings WHERE user_id = ${user_id} AND stock = ${stock} AND currency != ${currency} AND market = ${market};
    `;
    if (existingHolding.rowCount > 0) {
      return NextResponse.json(
        {
          error:
            "A holding with the same stock but different currency already exists.",
        },
        { status: 400 }
      );
    }

    if (transaction_type.toLowerCase() === "buy") {
      res = await sql`
              INSERT INTO holdings (
                user_id,
                stock,
                stock_quantity,
                currency,
                stock_price,
                total_cost,
                market,
                profit_loss,
                sold
              ) VALUES (
                ${user_id},
                ${stock},
                ${stock_quantity},
                ${currency},
                ${stock_price},
                ${total_cost},
                ${market},
                ${0},
                false
              )
              ON CONFLICT (user_id, stock, currency, market) DO UPDATE SET
                stock_quantity = holdings.stock_quantity + EXCLUDED.stock_quantity,
                total_cost = holdings.total_cost + EXCLUDED.total_cost,
                stock_price = (holdings.total_cost + EXCLUDED.total_cost) / (holdings.stock_quantity + EXCLUDED.stock_quantity),
                profit_loss = holdings.profit_loss,
                sold = false;
            `;
    } else if (transaction_type.toLowerCase() === "sell") {
      let currentQuantity = await sql`
          SELECT stock_quantity FROM holdings WHERE user_id = ${user_id} AND stock = ${stock} AND currency = ${currency} AND market = ${market};
      `;

      if (currentQuantity.rowCount === 0) {
        throw new Error("No holding found for the specified stock.");
      } else if (currentQuantity.rows[0].stock_quantity < stock_quantity) {
        throw new Error(
          "You cannot sell more than what you have in your holdings."
        );
      }
      res = await sql`
              UPDATE holdings SET
                stock_quantity = holdings.stock_quantity - ${stock_quantity},
                total_cost = (holdings.stock_quantity::decimal - ${stock_quantity}) * ${stock_price},
                profit_loss = holdings.profit_loss + (${stock_quantity} * (${stock_price} - holdings.stock_price)),
                sold = (holdings.stock_quantity - ${stock_quantity}) <= 0
              WHERE user_id = ${user_id} AND stock = ${stock} AND currency = ${currency} AND market = ${market};
            `;
    }
    if (!res) {
      throw new Error("Failed to add, update, or sell holding.");
    }
    return NextResponse.json(
      {
        message: "Holding added, updated, or sold successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
