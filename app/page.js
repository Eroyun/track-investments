"use client";

import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import StockTable from "./components/transactionsTable";

import { createTables } from "./helpers/hooks";
import { DataObject } from "@mui/icons-material";

const Home = () => {
  const [holdings, setHoldings] = useState([]);
  const [fields, setFields] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (holdings.length === 0) {
      getHoldings();
    }
  }, []);

  const createTable = async () => {
    try {
      const response = await createTables();
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      return { error: error.message };
    }
  };

  const getHoldings = async () => {
    try {
      const response = await fetch("/api/holdings/get-holdings");
      if (!response.ok) {
        const res = await createTable();
        if (!res.ok) {
          if (callCount > 3) {
            throw new Error(res.error || "Failed to create tables.");
          }
          setCallCount(callCount + 1);
          return getTransactions();
        }
      }
      const data = await response.json();
      setHoldings(data.rows);
      setFields(data.fields);
    } catch (error) {
      alert(error.message);
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="relative flex flex-col mx-auto px-10 py-10 justify-between h-full"></div>
    </ThemeProvider>
  );
};

export default Home;
