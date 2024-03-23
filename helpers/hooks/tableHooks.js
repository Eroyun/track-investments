import { fetchAPI } from "../hooksHelper";
import { NextResponse } from "next/server";

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

    const response = NextResponse.json(resHoldings, resTransactions);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const createUserTable = async () => {
  try {
    const res = await fetchAPI("/api/users/create-table", {}, "GET");

    if (!res.ok) {
      throw new Error("Failed to create table. Please refresh the page.");
    }

    const response = await res.json();

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
