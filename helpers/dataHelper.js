import { formatNumberAsCurrency } from "./localizationHelper";
import DeleteStockButton from "../../components/deleteStockButton";

const formatTableCell = (index, field, stock, dataType) => {
  if (dataType === "holdings") {
    switch (index) {
      case 3:
      case 4:
        return formatNumberAsCurrency(stock[field.name], stock.currency);
      case 6:
        return (
          <span style={{ color: stock[field.name] < 0 ? "red" : "#32CD32" }}>
            {formatNumberAsCurrency(stock[field.name], stock.currency)}
          </span>
        );
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

const createOptions = (rows) => {
  const stockOptions = [...new Set(rows.map((stock) => stock.stock))].map(
    (stock) => ({ value: stock, label: stock })
  );
  const marketOptions = [...new Set(rows.map((stock) => stock.market))].map(
    (market) => ({ value: market, label: market })
  );

  return { stockOptions, marketOptions };
};

const createColumns = (fields, rows, dataType, getData) => {
  let columns = [];

  if (dataType === "holdings") {
    columns = fields
      .filter((field, index) => index !== 7)
      .map((field, index) => ({
        field: field.name,
        headerName: field.name
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        width:
          Math.max(...rows.map((t) => (`${t[field.name]}` || "").length), 16) *
          11,
        align: "center",
        headerAlign: "center",
        renderCell: (params) =>
          formatTableCell(index, field, params.row, dataType),
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
        renderCell: (params) =>
          formatTableCell(index, field, params.row, dataType),
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
          className={"bg-gray-200 mt-2"}
        />
      ),
    });
  }

  return columns;
};

module.exports = { createOptions, createColumns };
