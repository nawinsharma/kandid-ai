import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAndSeedUserData } from "@/lib/seed-user-data";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await checkAndSeedUserData(session.user.id);

    if (result) {
      return NextResponse.json({
        success: true,
        message: "User data seeded successfully",
        data: result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "User already has data or seeding was skipped"
      });
    }

  } catch (error) {
    console.error("Error seeding user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
