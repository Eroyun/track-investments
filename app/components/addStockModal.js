"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

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
      case "buy_date":
        setTransactionDate(value);
        break;
      case "stock":
        setStock(value);
        break;
      case "buy_quantity":
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
    <div className="add-stock-modal">
      <Button
        variant="contained"
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
      >
        Add Stock
      </Button>

      {/* Modal content */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Stock</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <TextField
              label="Buy Date"
              type="date"
              name="buy_date"
              value={transactionDate}
              onChange={handleChange}
              required
              className="text-field px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <TextField
              label="Stock"
              type="text"
              name="stock"
              value={stock}
              onChange={handleChange}
              required
              className="text-field px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <TextField
              label="Buy Quantity"
              type="number"
              name="buy_quantity"
              min="1" // Set minimum quantity to 1
              value={stockQuantity}
              onChange={handleChange}
              required
              className="text-field px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <TextField
              label="Stock Price"
              type="number"
              step="0.01" // Allow decimal input for stock price
              name="stock_price"
              value={stockPrice}
              onChange={handleChange}
              required
              className="text-field px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <TextField
              label="Total Cost"
              type="number"
              name="total_cost"
              value={totalAmount.toFixed(2)} // Display total cost with 2 decimal places
              readOnly // Make total cost read-only as it's calculated automatically
              className="text-field px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              variant="contained"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              Add Stock
            </Button>
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
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddStockModal;
