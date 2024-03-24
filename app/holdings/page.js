"use client";
import PageComponent from "@/components/pageComponent";

const Holdings = () => {
  return (
    <PageComponent dataType="holdings" apiPath="/api/holdings/get-holdings" />
  );
};

export default Holdings;
