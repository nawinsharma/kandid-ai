import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const result = await auth.api.signOut({
      headers: request.headers,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
