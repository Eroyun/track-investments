"use client";
import Investments from "@/components/investments";

const Holdings = () => {
  return (
    <Investments dataType="holdings" apiPath="/api/holdings/get-holdings" />
  );
};

export default Holdings;
