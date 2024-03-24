import { NextResponse } from "next/server";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { email, password } = await req.json();
  try {
    const result = await signIn("credentials", {
      redirectTo: "/holdings",
      email: email,
      password: password,
    });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
