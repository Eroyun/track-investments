"use client";

import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DataTable from "./dataTable";
import { createTables } from "../helpers/hooks";
import AuthDialog from "./authDialog";

const PageComponent = ({ dataType, apiPath, session }) => {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [callCount, setCallCount] = useState(0);

  const getData = async () => {
    try {
      const response = await fetch(apiPath);
      if (!response.ok) {
        const res = await createTables();
        if (!res.ok) {
          if (callCount > 3) {
            throw new Error(res.error || "Failed to create tables.");
          }
          setCallCount(callCount + 1);
          return getData();
        }
      }
      const data = await response.json();
      setData(data.rows);
      setFields(data.fields);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      getData();
    }
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="relative flex flex-col mx-auto px-10 py-10 justify-between h-full">
        {session ? (
          <DataTable
            fields={fields}
            rows={data}
            getData={getData}
            dataType={dataType}
          />
        ) : (
          <AuthDialog />
        )}
      </div>
    </ThemeProvider>
  );
};

export default PageComponent;
