"use client";

import React from "react";
import { Button } from "@mui/material";

const DeleteStockButton = ({ transactionID, getStocks }) => {
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/delete-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: transactionID,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || response.statusText);
      }

      getStocks();
    } catch (error) {
      alert(error.message); // Alert user about error
    }
  };

  return (
    <div className="add-stock-modal">
      <Button
        variant="contained"
        onClick={handleSubmit}
        className="bg-red-500 hover:bg-red-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
      >
        Delete
      </Button>
    </div>
  );
};

export default DeleteStockButton;
