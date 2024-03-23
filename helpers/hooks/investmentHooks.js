import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { fetchAPI } from "../hooksHelper";

export const addTransaction = async (
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
      throw new Error(res || "Failed to add holding.");
    }

    const response = await fetchAPI("/api/transactions/add-transaction", data);

    if (!response.ok) {
      const deleteResponse = await fetchAPI("/api/holdings/delete-holding", {
        transaction_ids: [transactionID],
      });

      if (!deleteResponse.ok) {
        throw new Error(deleteResponse || "Failed to delete holding.");
      }
    }

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const deleteTransactions = async (transactionIDs) => {
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
      const transaction = await getTransaction(data);
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

export const getTransaction = async (transactionID) => {
  try {
    const res = await fetchAPI(
      "/api/transactions/get-transaction?transactionID=" + transactionID,
      {},
      "GET"
    );

    if (!res.ok) {
      throw new Error(res || "Failed to get transaction.");
    }

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};
