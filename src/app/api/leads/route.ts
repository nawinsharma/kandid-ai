import { NextRequest, NextResponse } from "next/server";
import { db, tables } from "@/lib/db";
import { auth } from "@/lib/auth";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

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
    const filters = [eq(tables.leads.userId, session.user.id)];
    if (status && status !== "all") filters.push(eq(tables.leads.status, status));
    if (campaignId) filters.push(eq(tables.leads.campaignId, campaignId));

    const searchFilter = search
      ? or(
          ilike(tables.leads.name, `%${search}%`),
          ilike(tables.leads.email, `%${search}%`),
          ilike(tables.leads.company, `%${search}%`)
        )
      : undefined;

    const whereExpr = searchFilter ? and(...filters, searchFilter) : and(...filters);

    const userLeads = await db
      .select({
        id: tables.leads.id,
        name: tables.leads.name,
        email: tables.leads.email,
        profileImage: tables.leads.profileImage,
        company: tables.leads.company,
        status: tables.leads.status,
        createdAt: tables.leads.createdAt,
        campaign: tables.campaigns.name,
        campaignId: tables.campaigns.id,
        campaignStatus: tables.campaigns.status,
      })
      .from(tables.leads)
      .leftJoin(tables.campaigns, eq(tables.leads.campaignId, tables.campaigns.id))
      .where(whereExpr)
      .orderBy(desc(tables.leads.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count: totalCount }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(tables.leads)
      .where(whereExpr);

    return NextResponse.json({
      leads: userLeads,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
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

    const [lead] = await db
      .insert(tables.leads)
      .values([{ id: crypto.randomUUID(), ...newLead }])
      .returning();

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
