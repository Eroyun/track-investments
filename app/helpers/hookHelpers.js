const addTransaction = async (
  transactionDate,
  stock,
  stockQuantity,
  currency,
  stockPrice,
  totalAmount,
  transactionType,
  market
) => {
  const response = await fetch("/api/transactions/add-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_date: transactionDate,
      stock,
      stock_quantity: stockQuantity,
      currency,
      stock_price: stockPrice,
      total_cost: totalAmount,
      transaction_type: transactionType,
      market,
    }),
  });

  return response;
};

const deleteTransactions = async (transactionIDs) => {
  const response = await fetch("/api/transactions/delete-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_ids: transactionIDs,
    }),
  });

  return response;
};

module.exports = {
  addTransaction,
  deleteTransactions,
};
