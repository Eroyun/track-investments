import React from "react";
import DeleteStockButton from "./deleteStockButton";
import AddTransactionModal from "./addTransactionModal";

const TransactionActions = ({ selectedRows, getData }) => {
  return (
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
  );
};

export default TransactionActions;
