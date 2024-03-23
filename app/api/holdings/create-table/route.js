import { NextResponse } from "next/server";
import { holdings } from "@/db/holdings";

export const dynamic = "force-dynamic"; // Resolves the issue with Vercel's caching

export async function GET() {
  try {
    const res = holdings;
    console.log(res);
    return NextResponse.json({ holdings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
