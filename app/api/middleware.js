import { NextResponse } from "next/server";
import { auth } from "./auth/auth";

async function middleware(req, res) {
  const session = await auth(req, res);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export function withMiddleware(handler) {
  return async (req, res) => {
    const middlewareResult = await middleware(req, res);

    if (middlewareResult) {
      return middlewareResult;
    }

    return handler(req, res);
  };
}
