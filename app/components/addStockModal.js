"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  currencies,
  formatNumberAsCurrency,
} from "../helpers/localizationHelper";

const AddStockModal = () => {
  const [transactionType, setTransactionType] = useState("BUY");
  const [currency, setCurrency] = useState("USD");
  const [transactionDate, setTransactionDate] = useState("");
  const [stock, setStock] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [displayQuantity, setDisplayQuantity] = useState("0");
  const [stockPrice, setStockPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState("0");
  const [totalAmount, setTotalAmount] = useState(0);
  const [displayTotal, setDisplayTotal] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Update displayed numbers when currency changes
    setDisplayPrice(formatNumberAsCurrency(stockPrice, currency));
    setDisplayTotal(formatNumberAsCurrency(totalAmount, currency));
  }, [currency]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/add-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_date: transactionDate,
          stock,
          stock_quantity: stockQuantity,
          currency,
          stock_price: stockPrice,
          total_cost: totalAmount,
          transaction_type: transactionType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add stock");
      }

      const data = await response.json();
      console.log(data);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setTransactionDate("");
    setStock("");
    setStockQuantity(0);
    setStockPrice(0);
    setTotalAmount(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "transaction_type":
        setTransactionType(value);
        break;
      case "transaction_date":
        setTransactionDate(value);
        break;
      case "stock":
        setStock(value);
        break;
      case "stock_quantity":
        setDisplayQuantity(value);
        break;
      case "stock_price":
        setDisplayPrice(value);
        break;
      case "currency":
        setCurrency(value);
        break;
      default:
        break;
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "stock_quantity":
        if (value !== "") {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            setStockQuantity(parsedValue);
            setDisplayQuantity(parsedValue.toString());
            // Update total cost automatically
            if (stockPrice > 0 && parsedValue > 0) {
              const total = stockPrice * parsedValue;
              setTotalAmount(total);
              setDisplayTotal(formatNumberAsCurrency(total, currency));
            }
          }
        } else {
          if (displayQuantity === "") {
            e.target.value = stockQuantity;
          } else {
            e.target.value = displayQuantity;
          }
        }
        break;
      case "stock_price":
        if (value !== "") {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            setStockPrice(parsedValue);
            setDisplayPrice(formatNumberAsCurrency(parsedValue, currency));
            // Update total cost automatically
            if (stockQuantity > 0 && parsedValue > 0) {
              const total = stockQuantity * parsedValue;
              setTotalAmount(total);
              setDisplayTotal(formatNumberAsCurrency(total, currency));
            }
          }
        } else {
          if (displayPrice === "") {
            e.target.value = formatNumberAsCurrency(stockPrice, currency);
          } else {
            e.target.value = displayPrice;
          }
        }
        break;
      default:
        break;
    }
  };

  const handleClick = (e) => {
    if (parseFloat(e.target.value) === 0) {
      e.target.value = "";
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ right: "5.25%" }} className="absolute">
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
                htmlFor="transaction_type"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Type
              </label>
              <select
                id="transaction_type"
                name="transaction_type"
                value={transactionType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
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
                placeholder="e.g. AAPL, TSLA, MSFT, etc."
                value={stock}
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
                value={displayQuantity}
                onClick={handleClick}
                onBlur={handleBlur}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={currency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock_price"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Price
              </label>
              <input
                type="text"
                id="stock_price"
                name="stock_price"
                value={displayPrice}
                onClick={handleClick}
                onChange={handleChange}
                onBlur={handleBlur}
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
                type="text"
                id="total_cost"
                name="total_cost"
                value={displayTotal}
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
