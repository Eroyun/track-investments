import { fetchAPI } from "../hooksHelper";

export const getSession = async () => {
  try {
    const res = await fetchAPI("/api/auth/session", {}, "GET");
    return await res.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const signIn = async (email, password) => {
  try {
    const csrfToken = await getCSRFToken();
    const res = await fetchAPI("/api/auth/callback/credentials", {
      email,
      password,
      csrfToken: csrfToken.csrfToken,
      json: true,
    });
    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getCSRFToken = async () => {
  try {
    const res = await fetchAPI("/api/auth/csrf", {}, "GET");
    return await res.json();
  } catch (error) {}
  console.error(error);
  return error;
};

export const signOut = async () => {
  try {
    const csrfToken = await getCSRFToken();
    const res = await fetchAPI("/api/auth/signout", {
      csrfToken: csrfToken.csrfToken,
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};
