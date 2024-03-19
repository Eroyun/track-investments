"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const AddStockModal = () => {
  const [transactionDate, setTransactionDate] = useState("");
  const [stock, setStock] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [totalAmount, setTotalAmount] = useState(0.0); // Calculate total cost automatically
  const [open, setOpen] = useState(false); // State for modal visibility

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/add-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_date: transactionDate,
          stock,
          stock_quantity: stockQuantity,
          stock_price: stockPrice,
          total_cost: totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add stock");
      }

      const data = await response.json();
      console.log("Success:", data.message); // Log success message for debugging
      setOpen(false); // Close modal on success
      resetForm(); // Reset form fields
    } catch (error) {
      console.error("Error:", error.message); // Log error message for debugging
      alert("An error occurred. Please try again."); // Alert user about error
    }
  };

  const resetForm = () => {
    setTransactionDate("");
    setStock("");
    setStockQuantity(0);
    setStockPrice(0.0);
    setTotalAmount(0.0);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "transaction_date":
        setTransactionDate(value);
        break;
      case "stock":
        setStock(value);
        break;
      case "stock_quantity":
        setStockQuantity(parseInt(value)); // Ensure integer value
        // Update total cost automatically
        if (stockPrice > 0 && value > 0) setTotalAmount(stockPrice * value);
        break;
      case "stock_price":
        setStockPrice(parseFloat(value)); // Ensure decimal value
        // Update total cost automatically
        if (value > 0 && stockQuantity > 0)
          setTotalAmount(value * stockQuantity);
        break;
      default:
        break;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ right: "10%" }} className="absolute">
      <Button
        variant="contained"
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2.5 px-7 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
      >
        Add
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>
          Add Stock
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: "10px", top: "10px" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form
            id="addStockForm"
            onSubmit={handleSubmit}
            className="flex flex-col space-y-2"
          >
            <div className="mb-2">
              <label
                htmlFor="transaction_date"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Date
              </label>
              <input
                type="date"
                id="transaction_date"
                name="transaction_date"
                value={transactionDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock
              </label>
              <input
                type="text"
                id="stock"
                name="stock"
                value={stock || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock_quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                min="1"
                value={stockQuantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock_price"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Price
              </label>
              <input
                type="number"
                id="stock_price"
                name="stock_price"
                step="0.01"
                value={stockPrice}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="total_cost"
                className="block text-sm font-medium text-gray-700"
              >
                Total Cost
              </label>
              <input
                type="number"
                id="total_cost"
                name="total_cost"
                value={totalAmount.toFixed(2)}
                readOnly
                className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            className="border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Button>
          <Button
            form="addStockForm"
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          >
            Add Stock
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddStockModal;
