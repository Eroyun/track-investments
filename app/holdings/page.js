import PageComponent from "@/components/pageComponent";

const Holdings = async () => {
  return (
    <PageComponent dataType="holdings" apiPath="/api/holdings/get-holdings" />
  );
};

export default Holdings;
