"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";

import AddStockModal from "./components/addStockModal";
import DeleteStockButton from "./components/deleteStockButton";

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [fields, setFields] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");

  const getStocks = async () => {
    try {
      const response = await fetch("/api/get-stocks");
      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }
      const data = await response.json();
      setStocks(data.rows);
      setFields(data.fields);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    if (stocks.length === 0) {
      getStocks();
    }
  }, [stocks.length]);

  return (
    <div>
      <TextField
        label="Filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
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
              .filter((stock) => {
                return (
                  filter === "" ||
                  fields.some((field) =>
                    String(stock[field.name]).toLowerCase().includes(filter)
                  )
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((stock, index) => (
                <TableRow key={index}>
                  {fields.map((field, index) => (
                    <TableCell key={index}>
                      {index === 0
                        ? new Date(stock[field.name]).toLocaleDateString()
                        : index === 3 || index === 4
                        ? new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(stock[field.name])
                        : stock[field.name]}
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
        <AddStockModal />
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
    </div>
  );
};

export default Home;
