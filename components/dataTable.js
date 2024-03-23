import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";

import TransactionActions from "./transactionActions";
import EmptyData from "./emptyData";
import Filter from "./filter";
import NavigationButton from "./navigationButton";

import { createColumns } from "../helpers/dataHelper";
import { useTheme } from '@mui/material/styles';

const DataTable = ({ fields, rows, getData, dataType, userID }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filter, setFilter] = useState({ date: "", stock: "", market: "" });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    if (rows && rows.length > 0) {
      setColumns(createColumns(fields, rows, dataType, getData));
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
      clearTimeout(timer);
      setIsLoading(false);
    }

    setSelectedRows([]);
  }, [filter, rows]);

  const handleRowSelection = (e) => {
    setSelectedRows(e || []);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!rows || (rows.length === 0 && userID)) {
    return <EmptyData getData={getData} userID={userID} />;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <NavigationButton dataType={dataType} />
        <Filter
          filter={filter}
          setFilter={setFilter}
          rows={rows}
          dataType={dataType}
        />
      </div>
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={rowsPerPage}
        onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        checkboxSelection={dataType === "transactions"}
        onSelectionModelChange={handleRowSelection}
        getRowId={(row) => {
          if (dataType === "holdings") {
            return `${row.stock}-${row.currency}-${row.market}`;
          } else {
            return row.transaction_id;
          }
        }}
        sx={{
          height: '80%',
          '& .MuiDataGrid-columnHeaders': {
            color: theme.palette.common.white,
          },
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
            backgroundColor: theme.palette.secondary.main,
            border: `1px solid ${theme.palette.secondary.main}`,
          },
          '& .MuiDataGrid-row': {
            border: `1px solid ${theme.palette.secondary.main}`,
          },
          '& .MuiDataGrid-cell': {
            color: theme.palette.common.white,
          },
          '& .MuiDataGrid-footerContainer': {
            border: `1px solid ${theme.palette.secondary.main}`,
          },
          '& .MuiDataGrid-cell .MuiDataGrid-cellEmpty': {
            display: 'none'
          }
        }}
      />
      <TransactionActions
        selectedRows={selectedRows}
        getData={getData}
        userID={userID}
      />
    </div>
  );
};

export default DataTable;
