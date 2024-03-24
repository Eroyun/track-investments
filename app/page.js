"use client";

import { createUserTable } from "@/hooks/hooks";
import { useEffect } from "react";
import AuthDialog from "@/components/authDialog";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/hooks/hooks";

const Page = () => {
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
