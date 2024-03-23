import { fetchAPI } from "../hooksHelper";

export const getUser = async (email) => {
  try {
    const res = await fetchAPI(`/api/users/get-user?email=${email}`, {}, "GET");
    if (!res.ok) {
      throw new Error("Failed to get user.");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const addUser = async (email, password) => {
  try {
    const res = await fetchAPI("/api/users/add-user", { email, password });
    if (!res.ok) {
      throw new Error("Failed to add user.");
    }
    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};
