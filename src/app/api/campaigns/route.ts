import { NextRequest, NextResponse } from "next/server";
import { db, tables } from "@/lib/db";
import { auth } from "@/lib/auth";
import { and, desc, eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCampaigns = await db
      .select()
      .from(tables.campaigns)
      .where(eq(tables.campaigns.userId, session.user.id))
      .orderBy(desc(tables.campaigns.createdAt));

    // Calculate statistics for each campaign
    const leadCounts = await db
      .select({
        campaignId: tables.leads.campaignId,
        total: sql<number>`count(*)`.mapWith(Number),
        successful: sql<number>`sum(case when ${tables.leads.status} in ('responded','converted') then 1 else 0 end)`.mapWith(Number),
      })
      .from(tables.leads)
      .where(eq(tables.leads.userId, session.user.id))
      .groupBy(tables.leads.campaignId);
    const countMap = new Map<string, { total: number; successful: number }>();
    for (const r of leadCounts) countMap.set(r.campaignId, { total: r.total, successful: r.successful ?? 0 });

    const campaignsWithStats = userCampaigns.map(c => {
      const cCounts = countMap.get(c.id) ?? { total: 0, successful: 0 };
      const responseRate = cCounts.total > 0 ? (cCounts.successful / cCounts.total) * 100 : 0;
      return { ...c, totalLeads: cCounts.total, successfulLeads: cCounts.successful, responseRate: responseRate.toFixed(2) };
    });

    return NextResponse.json(campaignsWithStats);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
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
    const newCampaign = {
      ...body,
      userId: session.user.id,
    };

    const [campaign] = await db
      .insert(tables.campaigns)
      .values([{ id: crypto.randomUUID(), ...newCampaign }])
      .returning();

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
