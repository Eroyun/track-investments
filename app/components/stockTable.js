"use client";

import React, { useEffect, useState } from "react";
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
                stock[field.name].toLowerCase() === "buy" ? "green" : "red",
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
    <TableContainer component={Paper} style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={(event) => handleFilterChange("date", event.target.value)}
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
        />
        <Select
          name="market"
          options={marketOptions}
          value={marketOptions.find((option) => option.value === filter.market)}
          onChange={(selectedOption) =>
            handleFilterChange("market", selectedOption)
          }
          isClearable
          placeholder="Filter by market"
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
      <div>
        <AddStockModal
          className="float-right"
          style={{ marginRight: "3.75rem" }}
          getStocks={getStocks}
        />
        <TablePagination
          component="div"
          count={stocks.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
          className="float-left ml-6"
        />
      </div>
    </TableContainer>
  );
};

const EmptyStocks = ({ getStocks }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-10 space-y-5">
      <h2 className="text-2xl text-gray-700">No transactions available.</h2>
      <p className="text-lg text-gray-500">
        Please add transactions to view them here.
      </p>
      <AddStockModal getStocks={getStocks} />
    </div>
  );
};

export default StockTable;
