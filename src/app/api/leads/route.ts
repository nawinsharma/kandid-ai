import { NextRequest, NextResponse } from "next/server";
import { db, leads } from "@/lib/db";
import { auth } from "@/lib/auth";
import { eq, and, ilike, or, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const campaignId = searchParams.get("campaignId") || "";

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [eq(leads.userId, session.user.id)];

    if (search) {
      whereConditions.push(
        or(
          ilike(leads.name, `%${search}%`),
          ilike(leads.email, `%${search}%`),
          ilike(leads.company, `%${search}%`)
        )!
      );
    }

    if (status && status !== "all") {
      whereConditions.push(eq(leads.status, status));
    }

    if (campaignId) {
      whereConditions.push(eq(leads.campaignId, campaignId));
    }

    const userLeads = await db
      .select()
      .from(leads)
      .where(and(...whereConditions))
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [totalCount] = await db
      .select({ count: leads.id })
      .from(leads)
      .where(and(...whereConditions));

    return NextResponse.json({
      leads: userLeads,
      pagination: {
        page,
        limit,
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newLead = {
      ...body,
      userId: session.user.id,
    };

    const [lead] = await db.insert(leads).values(newLead).returning();

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
