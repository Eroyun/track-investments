import { drizzle } from "drizzle-orm/postgres-js";
import {
  pgTable,
  varchar,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { eq, neq } from "drizzle-orm";
import { sql } from "@vercel/postgres";

const db = drizzle(sql);

export const holdings = pgTable(
  "holdings",
  {
    stock: varchar("stock", { length: 255 }),
    stock_quantity: integer("stock_quantity"),
    currency: varchar("currency", { length: 3 }),
    stock_price: decimal("stock_price", 10, 2),
    total_cost: decimal("total_cost", 10, 2),
    market: varchar("market", { length: 12 }),
    profit_loss: decimal("profit_loss", 10, 2),
    sold: boolean("sold"),
  },
  (holdings) => {
    return {
      holdingsUnique: uniqueIndex("holdings_unique").on(
        holdings.stock,
        holdings.currency,
        holdings.market
      ),
    };
  }
);

export const getHoldings = async () => {
  return await db.select().from(holdings).orderBy(holdings.stock);
};

// Select query
export const getHoldingsByStockCurrencyMarket = async (
  stock,
  currency,
  market
) => {
  return await db
    .select()
    .from(holdings)
    .where(eq(holdings.stock, stock))
    .where(neq(holdings.currency, currency))
    .where(eq(holdings.market, market));
};

// Insert or update query
export const upsertHoldings = async (
  stock,
  stock_quantity,
  currency,
  stock_price,
  total_cost,
  market
) => {
  const existingHolding = await db
    .select()
    .from(holdings)
    .where(eq(holdings.stock, stock))
    .where(eq(holdings.currency, currency))
    .where(eq(holdings.market, market))
    .first();

  if (existingHolding) {
    return await db
      .update(holdings)
      .set({
        stock_quantity: existingHolding.stock_quantity + stock_quantity,
        total_cost: existingHolding.total_cost + total_cost,
        stock_price:
          (existingHolding.total_cost + total_cost) /
          (existingHolding.stock_quantity + stock_quantity),
        profit_loss: existingHolding.profit_loss,
        sold: false,
      })
      .where(eq(holdings.stock, stock))
      .where(eq(holdings.currency, currency))
      .where(eq(holdings.market, market));
  } else {
    return await db.insert(holdings).values({
      stock,
      stock_quantity,
      currency,
      stock_price,
      total_cost,
      market,
      profit_loss: 0,
      sold: false,
    });
  }
};

// Update holdings
export const updateHoldings = async (
  stock,
  stock_quantity,
  currency,
  stock_price,
  market
) => {
  const existingHolding = await db
    .select()
    .from(holdings)
    .where(eq(holdings.stock, stock))
    .where(eq(holdings.currency, currency))
    .where(eq(holdings.market, market))
    .first();

  if (existingHolding) {
    return await db
      .update(holdings)
      .set({
        stock_quantity: existingHolding.stock_quantity - stock_quantity,
        total_cost:
          (existingHolding.stock_quantity - stock_quantity) * stock_price,
        profit_loss:
          existingHolding.profit_loss +
          stock_quantity * (stock_price - existingHolding.stock_price),
        sold: existingHolding.stock_quantity - stock_quantity <= 0,
      })
      .where(eq(holdings.stock, stock))
      .where(eq(holdings.currency, currency))
      .where(eq(holdings.market, market));
  }
};

// Select stock quantity
export const getStockQuantity = async (stock, currency, market) => {
  return await db
    .select(holdings.stock_quantity)
    .from(holdings)
    .where(eq(holdings.stock, stock))
    .where(eq(holdings.currency, currency))
    .where(eq(holdings.market, market));
};

export const deleteHoldingsBasedOnTransaction = async (transaction) => {
  return await db
    .delete()
    .from(holdings)
    .where(eq(holdings.stock, transaction.stock))
    .where(eq(holdings.currency, transaction.currency))
    .where(eq(holdings.market, transaction.market));
};

export const removeBuyTransaction = async (
  transaction,
  newQuantity,
  newCost,
  newPrice
) => {
  return await db
    .update(holdings)
    .set({
      stock_quantity: newQuantity,
      total_cost: newCost,
      stock_price: newPrice,
      profit_loss: raw("holdings.profit_loss"),
      sold: false,
    })
    .where(eq(holdings.stock, transaction.stock))
    .where(eq(holdings.currency, transaction.currency))
    .where(eq(holdings.market, transaction.market));
};

export const removeSellTransaction = async (transaction) => {
  return await db
    .update(holdings)
    .set({
      stock_quantity: raw(
        `holdings.stock_quantity + ${transaction.stock_quantity}`
      ),
      total_cost: raw(`holdings.total_cost + ${transaction.total_cost}`),
      stock_price: raw(
        `(holdings.total_cost + ${transaction.total_cost}) / (holdings.stock_quantity + ${transaction.stock_quantity})`
      ),
      profit_loss: raw(
        `holdings.profit_loss - ${transaction.stock_quantity} * (${transaction.stock_price} - holdings.stock_price)`
      ),
      sold: false,
    })
    .where(eq(holdings.stock, transaction.stock))
    .where(eq(holdings.currency, transaction.currency))
    .where(eq(holdings.market, transaction.market));
};
