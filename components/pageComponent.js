"use client";

import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DataTable from "./dataTable";
import { createTables } from "@/helpers/hooks/tableHooks";
import { getSession } from "@/helpers/hooks/authHooks";
import { useRouter } from "next/navigation";
import { getUser } from "@/helpers/hooks/userHooks";

const PageComponent = ({ dataType, apiPath }) => {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [callCount, setCallCount] = useState(0);
  const [userID, setUserID] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (data.length === 0 && userID !== "") {
      getData();
    }
  }, [userID]);

  const checkSession = async () => {
    const session = await getSession();

    if (!session?.user?.email) {
      router.push("/");
    }

    const res = await getUser(session.user.email);

    if (res.rowCount < 1) {
      router.push("/");
    }

    setUserID(res.rows[0].id);
  };

  const getData = async () => {
    try {
      if (userID === "" || !userID) {
        router.push("/");
      }
      console.log(apiPath + "?userID=" + userID);
      const response = await fetch(apiPath + "?userID=" + userID);
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
