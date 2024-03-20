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

const StockTable = ({ fields, stocks }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const formatTableCell = (index, field, stock) => {
    switch (index) {
      case 0:
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
      case 1:
        return new Date(stock[field.name]).toLocaleDateString();
      case 5:
      case 6:
        return formatNumberAsCurrency(stock[field.name]);
      default:
        return stock[field.name];
    }
  };
  if (!stocks || stocks.length === 0) {
    return <EmptyStocks />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {fields.map((field, index) => (
              <TableCell key={index}>
                {field.name
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((stock, index) => (
              <TableRow key={index}>
                {fields.map((field, index) => (
                  <TableCell key={index}>
                    {formatTableCell(index, field, stock)}
                  </TableCell>
                ))}
                <TableCell>
                  <DeleteStockButton
                    transactionDate={stock.transaction_date}
                    stock={stock.stock}
                    stockQuantity={stock.stock_quantity}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <AddStockModal style={{ right: "5.25%" }} className="absolute" />
      <TablePagination
        component="div"
        count={stocks.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
        style={{ float: "left", marginLeft: "-5px" }}
      />
    </TableContainer>
  );
};

const EmptyStocks = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-10 space-y-5">
      <h2 className="text-2xl text-gray-700">No stocks available.</h2>
      <p className="text-lg text-gray-500">
        Please add some stocks to view them here.
      </p>
      <AddStockModal />
    </div>
  );
};

export default StockTable;
