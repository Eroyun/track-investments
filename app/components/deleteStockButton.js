"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";

const DeleteStockButton = ({ transactionDate, stock, stockQuantity }) => {
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/delete-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_date: transactionDate,
          stock,
          stock_quantity: stockQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete stock");
      }

      const data = await response.json();
      console.log("Success:", data.message); // Log success message for debugging
    } catch (error) {
      console.error("Error:", error.message); // Log error message for debugging
      alert("An error occurred. Please try again."); // Alert user about error
    }
  };

  return (
    <div className="add-stock-modal">
      <Button
        variant="contained"
        onClick={handleSubmit}
        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
      >
        Delete Stock
      </Button>
    </div>
  );
};

export default DeleteStockButton;
