import { NextResponse } from "next/server";
import {
  getHoldingsByStockCurrencyMarket,
  upsertHoldings,
  getStockQuantity,
  updateHoldings,
} from "@/db/holdings";

export async function POST(req) {
  try {
    const {
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
    const existingHolding = await getHoldingsByStockCurrencyMarket(
      stock,
      currency,
      market
    );

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
      res = await upsertHoldings(
        stock,
        stock_quantity,
        currency,
        stock_price,
        total_cost,
        market
      );
    } else if (transaction_type.toLowerCase() === "sell") {
      let currentQuantity = await getStockQuantity(stock, currency, market);

      if (currentQuantity.rowCount === 0) {
        throw new Error("No holding found for the specified stock.");
      } else if (currentQuantity.rows[0].stock_quantity < stock_quantity) {
        throw new Error(
          "You cannot sell more than what you have in your holdings."
        );
      }
      res = await updateHoldings(
        stock,
        stock_quantity,
        currency,
        stock_price,
        market
      );
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
