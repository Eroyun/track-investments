import { v4 as uuidv4 } from "uuid";
import { fetchAPI } from "../helpers/hooksHelper";

export const addTransaction = async (
  transactionDate,
  userID,
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
    user_id: userID,
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
      throw new Error(res.message || "Failed to add holding.");
    }

    const response = await fetchAPI("/api/transactions/add-transaction", data);

    if (!response.ok) {
      const deleteResponse = await fetchAPI("/api/holdings/delete-holding", {
        transaction_ids: [transactionID],
      });

      if (!deleteResponse.ok) {
        throw new Error(deleteResponse.message || "Failed to delete holding.");
      }
    }

    return { ok: true, status: "ok", data: response.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
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
      const data = transaction.data;
      const addResponse = await fetchAPI(
        "/api/holdings/add-holding",
        data.rows[0]
      );

      if (!addResponse.ok) {
        throw new Error(addResponse.message || "Failed to add holding.");
      }
    }

    return { ok: true, status: "ok", data: response.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
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
      throw new Error(res.message || "Failed to get transaction.");
    }
    return { ok: true, status: "ok", data: res.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};

export const getInvestments = async (dataType, userID) => {
  try {
    let res = {};
    if (dataType === "holdings") {
      res = await fetchAPI(
        `/api/transactions/get-transactions?userID=${userID}`,
        {},
        "GET"
      );
    } else if (dataType === "transactions") {
      res = await fetchAPI(
        `/api/transactions/get-transactions?userID=${userID}`,
        {},
        "GET"
      );
    }

    if (!res.ok) {
      throw new Error(res.message || "Failed to get transactions.");
    }

    return { ok: true, status: "ok", data: res.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};
