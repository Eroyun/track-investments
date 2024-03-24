import { fetchAPI } from "../helpers/hooksHelper";

export const createTables = async () => {
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

    return {
      ok: true,
      status: "ok",
      data: {
        holdings: dataHoldings.data,
        transactions: dataTransactions.data,
      },
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};

export const createUserTable = async () => {
  try {
    const res = await fetchAPI("/api/users/create-table", {}, "GET");

    if (!res.ok) {
      throw new Error("Failed to create table. Please refresh the page.");
    }

    return { ok: true, status: "ok", data: res.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};
