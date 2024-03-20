"use client";

import React, { useState } from "react";
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

import AddStockModal from "./addStockModal";
import DeleteStockButton from "./deleteStockButton";
import { formatNumberAsCurrency } from "../helpers/localizationHelper";

const StockTable = ({ fields, stocks, getStocks }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
          {stocks
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
