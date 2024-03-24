import { fetchAPI } from "../helpers/hooksHelper";

export const getUser = async (email) => {
  try {
    const res = await fetchAPI(`/api/users/get-user?email=${email}`, {}, "GET");
    if (!res.ok) {
      throw new Error("Failed to get user.");
    }
    return { ok: true, status: "ok", data: res.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};

export const addUser = async (email, password) => {
  try {
    const res = await fetchAPI("/api/users/add-user", { email, password });
    if (!res.ok) {
      throw new Error("Failed to add user.");
    }
    return { ok: true, status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};
