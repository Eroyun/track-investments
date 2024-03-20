"use client";

import React, { useState, useEffect } from "react";

import StockTable from "./components/stockTable";

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [fields, setFields] = useState([]);
  const [callCount, setCallCount] = useState(0);

  const getStocks = async () => {
    try {
      const response = await fetch("/api/get-stocks");
      if (!response.ok) {
        const res = await fetch("/api/create-table");
        if (!res.ok) {
          if (callCount >= 3) {
            // Check if getStocks has been called more than 3 times
            throw new Error("Maximum call limit reached");
          }
          setCallCount(callCount + 1);
          return getStocks();
        }
      }
      const data = await response.json();
      setStocks(data.rows);
      setFields(data.fields);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    if (stocks.length === 0) {
      getStocks();
    }
  }, []);

  return <StockTable fields={fields} stocks={stocks} />;
};

export default Home;