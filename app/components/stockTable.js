"use client";

import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import Select from "react-select";

import AddStockModal from "./addStockModal";
import DeleteStockButton from "./deleteStockButton";
import { formatNumberAsCurrency } from "../helpers/localizationHelper";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const StockTable = ({ fields, stocks, getStocks }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({ date: "", stock: "", market: "" });
  const [filteredStocks, setFilteredStocks] = useState([]);

  useEffect(() => {
    const newFilteredStocks = stocks.filter((stock) => {
      const dateMatches =
        !filter.date ||
        dayjs(stock.transaction_date).format("YYYY-MM-DD") ===
          dayjs(filter.date).format("YYYY-MM-DD");
      const stockMatches =
        !filter.stock ||
        stock.stock.toLowerCase().includes(filter.stock.toLowerCase());
      const marketMatches =
        !filter.market ||
        stock.market.toLowerCase().includes(filter.market.toLowerCase());

      return dateMatches && stockMatches && marketMatches;
    });

    setFilteredStocks(newFilteredStocks);
  }, [filter, stocks]);

  const handleFilterChange = (name, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]:
        value instanceof Object && value.hasOwnProperty("value")
          ? value.value
          : value,
    }));
  };

  const stockOptions = [...new Set(stocks.map((stock) => stock.stock))].map(
    (stock) => ({ value: stock, label: stock })
  );
  const marketOptions = [...new Set(stocks.map((stock) => stock.market))].map(
    (market) => ({ value: market, label: market })
  );

  const formatTableCell = (index, field, stock) => {
    switch (index) {
      case 1:
        return (
          <span
            style={{
              color:
                stock[field.name].toLowerCase() === "buy" ? "#32CD32" : "red",
            }}
          >
            {stock[field.name]}
          </span>
        );
      case 2:
        return new Date(stock[field.name]).toLocaleDateString();
      case 6:
      case 7:
        return formatNumberAsCurrency(stock[field.name], stock.currency);
      default:
        return stock[field.name];
    }
  };

  if (!stocks || stocks.length === 0) {
    return <EmptyStocks getStocks={getStocks} />;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TableContainer component={Paper} style={{ height: "100%" }}>
        <div className="flex items-center justify-end gap-2 m-2">
          <input
            type="date"
            name="date"
            value={filter.date}
            onChange={(event) => handleFilterChange("date", event.target.value)}
            className="rounded-md p-1 text-black placeholder-gray-800 selection-gray-800"
          />
          <Select
            name="stock"
            options={stockOptions}
            value={stockOptions.find((option) => option.value === filter.stock)}
            onChange={(selectedOption) =>
              handleFilterChange("stock", selectedOption)
            }
            isClearable
            placeholder="Filter by stock"
            className="rounded-md p-1 text-black"
            styles={{
              option: (styles, { isFocused }) => {
                return {
                  ...styles,
                  backgroundColor: isFocused ? "#1c1c1c" : null,
                  color: isFocused ? "white" : null,
                };
              },
            }}
          />
          <Select
            name="market"
            options={marketOptions}
            value={marketOptions.find(
              (option) => option.value === filter.market
            )}
            onChange={(selectedOption) =>
              handleFilterChange("market", selectedOption)
            }
            isClearable
            placeholder="Filter by market"
            className="rounded-md p-1 text-black"
            styles={{
              option: (styles, { isFocused }) => {
                return {
                  ...styles,
                  backgroundColor: isFocused ? "#1c1c1c" : null,
                  color: isFocused ? "white" : null,
                };
              },
            }}
          />
        </div>
        <Table>
          <TableHead>
            <TableRow>
              {fields.map((field, index) =>
                index === 0 ? null : (
                  <TableCell align="center" key={index}>
                    {field.name
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </TableCell>
                )
              )}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((stock, index) => (
                <TableRow key={index}>
                  {fields.map((field, index) =>
                    index === 0 ? null : (
                      <TableCell align="center" key={index}>
                        {formatTableCell(index, field, stock)}
                      </TableCell>
                    )
                  )}
                  <TableCell>
                    <DeleteStockButton
                      transactionID={stock.transaction_id}
                      getStocks={getStocks}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center my-4">
          <TablePagination
            component="div"
            count={stocks.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
            className="ml-4"
          />
          <div className="mr-1">
            <AddStockModal getStocks={getStocks} />
          </div>
        </div>
      </TableContainer>
    </ThemeProvider>
  );
};

const EmptyStocks = ({ getStocks }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-10 space-y-5">
      <h2 className="text-2xl text-gray-700">No transactions available.</h2>
      <p className="text-lg text-gray-500">
        Please add transactions to view them here.
      </p>
      <AddStockModal getStocks={getStocks} style={{ marginLeft: "4rem" }} />
    </div>
  );
};

export default StockTable;
