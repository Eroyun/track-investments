"use client";

import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DataTable from "./dataTable";

const PageComponent = ({ dataType, apiPath }) => {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [callCount, setCallCount] = useState(0);

  const getData = async () => {
    try {
      const response = await fetch(apiPath);
      if (!response.ok) {
        if (callCount > 3) {
          throw new Error(res.error || "Failed to fetch data.");
        }
        setCallCount(callCount + 1);
        return getData();
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
        <DataTable
          fields={fields}
          rows={data}
          getData={getData}
          dataType={dataType}
        />
      </div>
    </ThemeProvider>
  );
};

export default PageComponent;
