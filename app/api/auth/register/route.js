import { NextResponse } from "next/server";
import { getUser, createUser } from "@/db/users";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { email, password } = await req.json();
  try {
    const existingUser = await getUser(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }
    await createUser(email, password);
    return NextResponse.json({ message: "Registration successful" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
