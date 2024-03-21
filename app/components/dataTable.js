import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import Select from "react-select";

import AddTransactionModal from "./addTransactionModal";
import DeleteStockButton from "./deleteStockButton";
import { formatNumberAsCurrency } from "../helpers/localizationHelper";
import { data } from "autoprefixer";

const DataTable = ({ fields, rows, getData, dataType }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filter, setFilter] = useState({ date: "", stock: "", market: "" });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const newFilteredData = rows.filter((stock) => {
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

    setFilteredData(newFilteredData);
    setSelectedRows([]);
  }, [filter, rows]);

  const handleFilterChange = (name, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]:
        value instanceof Object && value.hasOwnProperty("value")
          ? value.value
          : value,
    }));
  };

  const handleRowSelection = (e) => {
    setSelectedRows(e || []);
  };

  const stockOptions = [...new Set(rows.map((stock) => stock.stock))].map(
    (stock) => ({ value: stock, label: stock })
  );
  const marketOptions = [...new Set(rows.map((stock) => stock.market))].map(
    (market) => ({ value: market, label: market })
  );

  const formatTableCell = (index, field, stock) => {
    if (dataType === "holdings") {
      switch (index) {
        case 3:
        case 4:
          return formatNumberAsCurrency(stock[field.name], stock.currency);
        default:
          return stock[field.name];
      }
    } else {
      switch (index) {
        case 0:
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
        case 1:
          return new Date(stock[field.name]).toLocaleDateString();
        case 5:
        case 6:
          return formatNumberAsCurrency(stock[field.name], stock.currency);
        default:
          return stock[field.name];
      }
    }
  };

  let columns = [];
  if (dataType === "holdings") {
    columns = fields
      .filter((field, index) => index !== 6)
      .map((field, index) => ({
        field: field.name,
        headerName: field.name
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        width:
          Math.max(...rows.map((t) => (`${t[field.name]}` || "").length), 16) *
          13,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => formatTableCell(index, field, params.row),
      }));
  } else {
    columns = fields
      .filter((field, index) => index !== 0)
      .map((field, index) => ({
        field: field.name,
        headerName: field.name
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        width:
          Math.max(...rows.map((t) => (`${t[field.name]}` || "").length), 16) *
          8,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => formatTableCell(index, field, params.row),
      }));

    columns.push({
      field: "delete",
      headerName: "",
      sortable: false,
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <DeleteStockButton
          transactionIDs={[params.row.transaction_id]}
          getData={getData}
          className={"bg-gray-200"}
        />
      ),
    });
  }

  if (!rows || rows.length === 0) {
    return <EmptyData getData={getData} />;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
          value={marketOptions.find((option) => option.value === filter.market)}
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
      <DataGrid
        style={{ height: "80%" }}
        rows={filteredData}
        columns={columns}
        paginationModel={{
          pageSize: rowsPerPage,
          page: page,
        }}
        onPaginationModelChange={(newModel) => {
          setRowsPerPage(newModel.pageSize);
          setPage(newModel.page);
        }}
        checkboxSelection={dataType === "transactions"}
        onRowSelectionModelChange={handleRowSelection}
        getRowId={(row) => {
          if (dataType === "holdings") {
            return `${row.stock}-${row.currency}-${row.market}`;
          } else {
            return row.transaction_id;
          }
        }}
      />
      {dataType === "transactions" && (
        <div className="flex justify-between items-center my-4">
          {selectedRows.length > 0 ? (
            <DeleteStockButton
              transactionIDs={selectedRows}
              getData={getData}
              style={{
                backgroundColor: "rgb(255, 0, 0) !important",
                "&:hover": {
                  backgroundColor: "rgb(150, 0, 0) !important",
                },
                height: "2.75rem",
                mt: -1,
                color: "white",
              }}
              buttonName={"Delete Selected"}
            />
          ) : (
            <div style={{ width: "9rem" }} /> // Empty div to take up space
          )}
          <AddTransactionModal getData={getData} />
        </div>
      )}
    </div>
  );
};

const EmptyData = ({ getData }) => {
  return (
    <div
      style={{ backgroundColor: "#1c1c1c" }}
      className="flex flex-col items-center justify-center h-screen p-10 space-y-5"
    >
      <h2 className="text-2xl text-gray-100">No data available.</h2>
      <p className="text-lg text-gray-300">Please add transactions.</p>
      <AddTransactionModal getData={getData} />
    </div>
  );
};

export default DataTable;
