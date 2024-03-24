"use client";

import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DataTable from "./dataTable";
import {
  createTables,
  getInvestments,
  getSession,
  getUser,
} from "@/hooks/hooks";
import { useRouter } from "next/navigation";

const PageComponent = ({ dataType }) => {
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
    const res = await getSession();

    if (!res.ok || !res?.data?.user?.email) {
      router.push("/");
    }
    const userRes = await getUser(res.data.user.email);
    const userID = userRes.data?.rows[0]?.id;
    if (!userRes.ok || !userID) {
      router.push("/");
    }

    setUserID(userID);
  };

  const getData = async () => {
    try {
      if (userID === "" || !userID) {
        router.push("/");
      }

      const response = await getInvestments(dataType, userID);

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
      const data = response.data;
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
          userID={userID}
        />
      </div>
    </ThemeProvider>
  );
};

export default PageComponent;
