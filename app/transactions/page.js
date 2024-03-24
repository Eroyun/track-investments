"use client";

import PageComponent from "@/components/pageComponent";

const Transactions = () => {
  return (
    <PageComponent
      dataType="transactions"
      apiPath="/api/transactions/get-transactions"
    />
  );
};

export default Transactions;
