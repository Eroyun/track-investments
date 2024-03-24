import React from "react";
import AddTransactionModal from "./addTransactionModal";

const EmptyData = ({ getData, userID }) => {
  return (
    <div
      style={{ backgroundColor: "#1c1c1c" }}
      className="flex flex-col items-center justify-center h-screen p-10 space-y-5"
    >
      <h2 className="text-2xl text-gray-100">No data available.</h2>
      <p className="text-lg text-gray-300">Please add transactions.</p>
      <AddTransactionModal getData={getData} userID={userID} />
    </div>
  );
};

export default EmptyData;
