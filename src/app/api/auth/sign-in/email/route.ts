import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: request.headers,
    });

    if (result?.error) {
      return NextResponse.json({ error: result?.error?.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
