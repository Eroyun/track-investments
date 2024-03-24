"use client";

import Investments from "@/components/investments";

const Transactions = () => {
  return (
    <Investments
      dataType="transactions"
      apiPath="/api/transactions/get-transactions"
    />
  );
};

export default Transactions;
