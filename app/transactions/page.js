import React, { Suspense } from "react";
import PageComponent from "../components/pageComponent";
import { auth } from "../api/auth/auth";
import { CircularProgress } from "@mui/material";

const Transactions = async () => {
  const session = await auth();

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      }
    >
      <PageComponent
        session={session}
        dataType="holdings"
        apiPath="/api/holdings/get-holdings"
      />
      \
    </Suspense>
  );
};

export default Transactions;
