"use client";

import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <div>
      <Button
        variant="contained"
        onClick={handleSubmit}
        className="bg-gray-200 flex items-center justify-center" // Tailwind CSS classes
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
    </div>
  );
};

export default DeleteStockButton;
