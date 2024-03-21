"use client";

import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteTransaction } from "../helpers/hookHelpers";

const DeleteStockButton = ({ transactionID, getTransactions }) => {
  const handleSubmit = async () => {
    try {
      const response = await deleteTransaction(transactionID);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || response.statusText);
      }

      getTransactions();
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
