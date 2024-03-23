import { addUser } from "./hooks/userHooks";
import { signIn } from "./hooks/authHooks";
import { useRouter } from "next/navigation";

export const fetchAPI = async (url, data, method = "POST") => {
  try {
    const responseData = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (method === "POST") {
      responseData.body = JSON.stringify(data);
    }

    const response = await fetch(url, responseData);
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error;
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const login = async (email, password) => {
  try {
    const res = await signIn(email, password);

    if (res.length === 0) {
      throw new Error("User not found");
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};
