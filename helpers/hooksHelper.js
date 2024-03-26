export const fetchAPI = async (url, body, method = "POST") => {
  try {
    const responseData = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (method === "POST") {
      responseData.body = JSON.stringify(body);
    }

    const response = await fetch(url, responseData);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch API.");
    }

    if (response.redirected === true) {
      return { ok: true, status: "ok" };
    }

    const data = await response.json();

    return { ok: true, status: "ok", data: data };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
};
