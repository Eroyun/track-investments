import { drizzle } from "drizzle-orm/vercel-postgres";
import {
  pgTable,
  varchar,
  integer,
  decimal,
  serial,
  date,
} from "drizzle-orm/pg-core";
import { eq, desc, asc } from "drizzle-orm";
import { sql } from "@vercel/postgres";

const db = drizzle(sql);

export const transactions = pgTable("transactions", {
  transaction_id: serial("transaction_id").primaryKey(),
  transaction_type: varchar("transaction_type", { length: 12 }),
  transaction_date: date("transaction_date"),
  stock: varchar("stock", { length: 255 }),
  stock_quantity: integer("stock_quantity"),
  currency: varchar("currency", { length: 3 }),
  stock_price: decimal("stock_price", 10, 2),
  total_cost: decimal("total_cost", 10, 2),
  market: varchar("market", { length: 12 }),
});

export const getTransactionById = async (transaction_id) => {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.transaction_id, transaction_id));
};

export const insertTransaction = async (transaction) => {
  return await db.insert(transactions, {
    transaction_id: transaction.transaction_id,
    transaction_type: transaction.transaction_type,
    transaction_date: transaction.transaction_date,
    stock: transaction.stock,
    stock_quantity: transaction.stock_quantity,
    currency: transaction.currency,
    stock_price: transaction.stock_price,
    total_cost: transaction.total_cost,
    market: transaction.market,
  });
};

export const deleteTransactions = async (transaction_ids) => {
  for (let id of transaction_ids) {
    await db.delete(transactions, {
      transaction_id: id,
    });
  }
};

export const getTransactions = async () => {
  return await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.transaction_date), asc(transactions.stock));
};
