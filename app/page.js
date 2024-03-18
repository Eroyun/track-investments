"use client";

import React from "react";
import AddStockModal from "./components/AddStockModal";
import DeleteStockButton from "./components/deleteStockButton";

const Home = () => {
  return (
    <div>
      <AddStockModal />
      <DeleteStockButton />
    </div>
  );
};

export default Home;
