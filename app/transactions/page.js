import PageComponent from "../../components/pageComponent";

const Transactions = async () => {
  return (
    <PageComponent
      dataType="transactions"
      apiPath="/api/transactions/get-transactions"
    />
  );
};

export default Transactions;
