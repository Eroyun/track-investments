"use client";

import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DataTable from "../components/dataTable";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [fields, setFields] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch("/api/transactions/get-transactions");
      const data = await response.json();
      setTransactions(data.rows);
      setFields(data.fields);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (transactions.length === 0) {
      getData();
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
        {fields && transactions && (
          <DataTable
            fields={fields}
            rows={transactions}
            getData={getData}
            dataType={"transactions"}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Home;
