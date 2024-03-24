"use client";

import { createUserTable } from "@/hooks/hooks";
import { useEffect } from "react";
import AuthDialog from "@/components/authDialog";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/hooks/hooks";
import { useFinnhub } from "@/helpers/finnhubHelper";
import { ApiClient, DefaultApi } from "finnhub";

const Page = () => {
  const finnhub = useFinnhub();
  finnhub.getStockData("AAPL").then((res) => console.log(res));

  const router = useRouter();
  const createTable = async () => {
    return await createUserTable();
  };

  const checkSession = async () => {
    await logout();
    const res = await getSession();
    if (res.status === "error") {
      alert(res.message);
    }

    if (res?.data?.user) {
      router.push("/holdings");
    }
  };

  useEffect(() => {
    checkSession();
    createTable();
  }, []);

  return <AuthDialog />;
};

export default Page;
