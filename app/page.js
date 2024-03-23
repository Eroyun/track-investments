"use client";

import { createUserTable } from "@/helpers/hooks/tableHooks";
import { useEffect } from "react";
import AuthDialog from "@/components/authDialog";
import { signIn } from "@/helpers/hooks/authHooks";

const Page = () => {
  const createTable = async () => {
    await signIn("test@test.com", "test");
    return await createUserTable();
  };

  useEffect(() => {
    createTable();
  }, []);

  return <AuthDialog />;
};

export default Page;
