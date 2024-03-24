"use client";

import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteTransactions } from "@/hooks/hooks";

const DeleteStockButton = ({
  transactionIDs,
  getData,
  className,
  style,
  buttonName,
}) => {
  const handleSubmit = async () => {
    try {
      const response = await deleteTransactions(transactionIDs);

      if (!response.ok) {
        throw new Error(response.message || "Failed to delete transactions.");
      }

      getData();
    } catch (error) {
      alert(error.message); // Alert user about error
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleSubmit}
      className={`flex items-center justify-center ${className}`}
      sx={style}
      startIcon={<DeleteIcon />}
    >
      {buttonName || "Delete"}
    </Button>
  );
};

export default DeleteStockButton;
