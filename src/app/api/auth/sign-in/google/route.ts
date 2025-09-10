import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: "google",
      },
      headers: request.headers,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.redirect(result.redirectTo || "/");
  } catch (error) {
    console.error("Google sign in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
