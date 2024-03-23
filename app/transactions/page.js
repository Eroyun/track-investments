import PageComponent from "../../components/pageComponent";

const Transactions = async () => {
  return (
    <PageComponent dataType="holdings" apiPath="/api/holdings/get-holdings" />
  );
};

export default Transactions;
