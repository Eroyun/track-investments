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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Select from "react-select";

import addTransaction from "../helpers/hooks";
import {
  currencies,
  markets,
  formatNumberAsCurrency,
  revertCurrencyFormat,
} from "../helpers/localizationHelper";

const AddTransactionModal = ({ style, className, getData }) => {
  const [transactionType, setTransactionType] = useState("BUY");
  const [currency, setCurrency] = useState(currencies[0]);
  const [market, setMarket] = useState(markets[0]);
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

    if (totalAmount === 0) {
      alert("Total amount cannot be 0.");
      return;
    }

    try {
      const response = await addTransaction(
        transactionDate,
        stock,
        stockQuantity,
        currency,
        stockPrice,
        totalAmount,
        transactionType,
        market
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || response.statusText);
      }
      resetForm();
      getData();
      setOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const resetForm = () => {
    setTransactionType("BUY");
    setCurrency(currencies[0]);
    setMarket(markets[0]);
    setTransactionDate("");
    setStock("");
    setStockQuantity(0);
    setStockPrice(0);
    setTotalAmount(0);
    setDisplayQuantity("0");
    setDisplayPrice("0");
    setDisplayTotal("");
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
      case "market":
        setMarket(value);
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
          const parsedValue = revertCurrencyFormat(value, currency);
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
          } else if (displayPrice) {
            e.target.value = displayPrice;
          } else {
            e.target.value = formatNumberAsCurrency(0, currency);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleClick = (e) => {
    if (
      parseFloat(e.target.value) === 0 ||
      formatNumberAsCurrency(0, currency) === e.target.value
    ) {
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
    <div style={style} className={className}>
      <Button
        variant="contained"
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2.5 px-7 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 w-32 flex justify-center items-center"
      >
        <AddIcon />
        Add
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>
          Add Transaction
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className="absolute top-2 right-2"
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
                className="block text-sm font-medium text-gray-200"
              >
                Transaction Type
              </label>
              <Select
                id="transaction_type"
                name="transaction_type"
                value={{ label: transactionType, value: transactionType }}
                onChange={(selectedOption) =>
                  setTransactionType(selectedOption.value)
                }
                options={[
                  { value: "BUY", label: "BUY" },
                  { value: "SELL", label: "SELL" },
                ]}
                placeholder="Select transaction type"
                className="rounded-md p-1 text-black"
                styles={{
                  option: (styles, { isFocused }) => {
                    return {
                      ...styles,
                      backgroundColor: isFocused ? "#545454" : null,
                      color: isFocused ? "white" : null,
                    };
                  },
                }}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="transaction_date"
                className="block text-sm font-medium text-gray-200"
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
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="market"
                className="block text-sm font-medium text-gray-200"
              >
                Market
              </label>
              <Select
                id="market"
                name="market"
                value={{ label: market, value: market }}
                onChange={(selectedOption) => setMarket(selectedOption.value)}
                options={markets.map((market) => ({
                  value: market,
                  label: market,
                }))}
                placeholder="Select market"
                className="rounded-md p-1 text-black"
                styles={{
                  option: (styles, { isFocused }) => {
                    return {
                      ...styles,
                      backgroundColor: isFocused ? "#545454" : null,
                      color: isFocused ? "white" : null,
                    };
                  },
                }}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-200"
              >
                Stock
              </label>
              <input
                type="text"
                id="stock"
                name="stock"
                placeholder="e.g. AAPL, THYAO, BTC etc."
                value={stock}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock_quantity"
                className="block text-sm font-medium text-gray-200"
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
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-200"
              >
                Currency
              </label>
              <Select
                id="currency"
                name="currency"
                value={{ label: currency, value: currency }}
                onChange={(selectedOption) => setCurrency(selectedOption.value)}
                options={currencies.map((currency) => ({
                  value: currency,
                  label: currency,
                }))}
                placeholder="Select currency"
                className="rounded-md p-1 text-black"
                styles={{
                  option: (styles, { isFocused }) => {
                    return {
                      ...styles,
                      backgroundColor: isFocused ? "#545454" : null,
                      color: isFocused ? "white" : null,
                    };
                  },
                }}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock_price"
                className="block text-sm font-medium text-gray-200"
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
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="total_cost"
                className="block text-sm font-medium text-gray-200"
              >
                Total Cost
              </label>
              <input
                type="text"
                id="total_cost"
                name="total_cost"
                value={displayTotal}
                readOnly
                className="w-full px-3 py-2 rounded-md bg-gray-200 cursor-not-allowed text-black"
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            className="border border-gray-300 hover:border-gray-500 text-gray-200 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Button>
          <Button
            form="addStockForm"
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 "
          >
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddTransactionModal;
