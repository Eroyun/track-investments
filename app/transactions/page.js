"use client";

import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import StockTable from "../components/stockTable";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [fields, setFields] = useState([]);
  const [callCount, setCallCount] = useState(0);

  const getTransactions = async () => {
    try {
      const response = await fetch("/api/transactions/get-transactions");
      if (!response.ok) {
        const res = await fetch("/api/transactions/create-table");
        if (!res.ok) {
          if (callCount >= 3) {
            // Check if getTransactions has been called more than 3 times
            throw new Error("Maximum call limit reached");
          }
          setCallCount(callCount + 1);
          return getTransactions();
        }
      }
      const data = await response.json();
      setTransactions(data.rows);
      setFields(data.fields);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (transactions.length === 0) {
      getTransactions();
    }
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="relative flex flex-col mx-auto px-10 py-10 justify-between h-full">
        <StockTable
          fields={fields}
          transactions={transactions}
          getTransactions={getTransactions}
        />
      </div>
    </ThemeProvider>
  );
};

export default Home;
