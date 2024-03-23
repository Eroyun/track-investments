import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sql } from "@vercel/postgres";

const fetchAPI = async (url, data, method = "POST") => {
  const responseData = {
    method: method,
    headers: { "Content-Type": "application/json" },
  };

  if (method === "POST") {
    responseData.body = JSON.stringify(data);
  }

  const response = await fetch(url, responseData);
  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json({ error: errorData.error }, { status: 500 });
  }

  return response;
};

const addTransaction = async (
  transactionDate,
  stock,
  stockQuantity,
  currency,
  stockPrice,
  totalAmount,
  transactionType,
  market
) => {
  const transactionID = uuidv4();
  const data = {
    transaction_id: transactionID,
    transaction_date: transactionDate,
    stock,
    stock_quantity: stockQuantity,
    currency,
    stock_price: stockPrice,
    total_cost: totalAmount,
    transaction_type: transactionType,
    market,
  };

  try {
    const res = await fetchAPI("/api/holdings/add-holding", data);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to add holding.");
    }

    const response = await fetchAPI("/api/transactions/add-transaction", data);

    if (!response.ok) {
      const deleteResponse = await fetchAPI("/api/holdings/delete-holding", {
        transaction_ids: [transactionID],
      });

      if (!deleteResponse.ok) {
        const deleteErrorData = await res.json();
        throw new Error(deleteErrorData.error || "Failed to delete holding.");
      }
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

const deleteTransactions = async (transactionIDs) => {
  const data = {
    transaction_ids: transactionIDs,
  };

  try {
    const res = await fetchAPI("/api/holdings/delete-holding", data);

    if (!res.ok) {
      throw new Error("Failed to delete holdings.");
    }

    const response = await fetchAPI(
      "/api/transactions/delete-transaction",
      data
    );

    if (!response.ok) {
      const transaction = getTransaction(data);
      const data = await transaction.json();
      const addResponse = await fetchAPI(
        "/api/holdings/add-holding",
        data.rows[0]
      );

      if (!addResponse.ok) {
        const addErrorData = await addResponse.json();
        throw new Error(addErrorData.error || "Failed to add holding.");
      }
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

const getTransaction = async (transactionID) => {
  try {
    const res = await sql`
      SELECT * FROM transactions
      WHERE transaction_id = ${transactionID}
    `;

    if (!res) {
      throw new Error("Failed to get transactions.");
    }

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

const createTables = async () => {
  try {
    const resHoldings = await fetchAPI("/api/holdings/create-table", {}, "GET");
    const resTransactions = await fetchAPI(
      "/api/transactions/create-table",
      {},
      "GET"
    );

    if (!resHoldings.ok || !resTransactions.ok) {
      throw new Error("Failed to create tables. Please refresh the page.");
    }

    const response = NextResponse.json(resHoldings, resTransactions);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

module.exports = {
  addTransaction,
  deleteTransactions,
  createTables,
};
