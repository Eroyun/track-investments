import { fetchAPI } from "../helpers/hooksHelper";
import { addUser } from "./hooks";

export const getSession = async () => {
  try {
    const res = await fetchAPI("/api/auth/session", {}, "GET");
    if (!res.ok) {
      throw new Error(res.message || "Failed to get session.");
    }
    return { ok: true, status: "ok", data: res.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const csrfToken = await getCSRFToken();
    const res = await fetchAPI("/api/auth/callback/credentials", {
      email,
      password,
      csrfToken: csrfToken.data.csrfToken,
      json: true,
      redirect: false,
    });

    if (!res.ok) {
      throw new Error(res.message || "Failed to sign in.");
    }

    const session = await getSession();

    if (!session.ok || !session.data) {
      throw new Error(
        session.message ||
          "The email or password you entered is incorrect. Please try again."
      );
    }
    return { ok: true, status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};

const getCSRFToken = async () => {
  try {
    const res = await fetchAPI("/api/auth/csrf", {}, "GET");
    if (!res.ok) {
      throw new Error(res.message || "Failed to get CSRF token.");
    }
    return { ok: true, status: "ok", data: res.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};

export const logout = async () => {
  try {
    const csrfToken = await getCSRFToken();
    const res = await fetchAPI("/api/auth/signout", {
      csrfToken: csrfToken.data.csrfToken,
    });
    if (!res.ok) {
      throw new Error(res.statusText || "Failed to sign out.");
    }
    return { ok: true, status: "ok", data: res.data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};

export const register = async (email, password) => {
  try {
    const res = await addUser(email, password);

    if (!res.ok) {
      throw new Error(res.message || "Failed to register user");
    }

    const resLogin = await login(email, password);

    if (resLogin.status !== "ok") {
      throw new Error(resLogin.message || "User not found");
    }
    return { ok: true, status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};
