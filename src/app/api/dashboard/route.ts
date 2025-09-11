import { NextRequest, NextResponse } from "next/server";
import { db, tables } from "@/lib/db";
import { auth } from "@/lib/auth";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch campaigns (latest 6)
    const campaigns = await db
      .select()
      .from(tables.campaigns)
      .where(eq(tables.campaigns.userId, session.user.id))
      .orderBy(desc(tables.campaigns.createdAt))
      .limit(6);

    // Lead counts per campaign (total and successful)
    const counts = await db
      .select({
        campaignId: tables.leads.campaignId,
        total: sql<number>`count(*)`.mapWith(Number),
        successful: sql<number>`sum(case when ${tables.leads.status} in ('responded','converted') then 1 else 0 end)`.mapWith(Number),
      })
      .from(tables.leads)
      .where(eq(tables.leads.userId, session.user.id))
      .groupBy(tables.leads.campaignId);
    const campaignIdToCounts = new Map<string, { total: number; successful: number }>();
    for (const row of counts) campaignIdToCounts.set(row.campaignId, { total: row.total, successful: row.successful ?? 0 });

    // Fetch LinkedIn accounts
    const linkedinAccounts = await db
      .select()
      .from(tables.linkedinAccounts)
      .where(eq(tables.linkedinAccounts.userId, session.user.id))
      .orderBy(desc(tables.linkedinAccounts.createdAt));

    // Fetch recent leads with campaign info
    const recentLeads = await db
      .select({
        id: tables.leads.id,
        name: tables.leads.name,
        title: tables.leads.title,
        status: tables.leads.status,
        profileImage: tables.leads.profileImage,
        updatedAt: tables.leads.updatedAt,
        campaignId: tables.campaigns.id,
        campaignName: tables.campaigns.name,
      })
      .from(tables.leads)
      .leftJoin(tables.campaigns, eq(tables.leads.campaignId, tables.campaigns.id))
      .where(eq(tables.leads.userId, session.user.id))
      .orderBy(desc(tables.leads.updatedAt))
      .limit(8);

    // Calculate overall statistics
    const [{ count: totalCampaigns }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(tables.campaigns)
      .where(eq(tables.campaigns.userId, session.user.id));

    const [{ count: totalLeads }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(tables.leads)
      .where(eq(tables.leads.userId, session.user.id));

    const [{ count: activeCampaigns }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(tables.campaigns)
      .where(and(eq(tables.campaigns.userId, session.user.id), eq(tables.campaigns.status, 'active')));

    const [{ count: successfulLeads }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(tables.leads)
      .where(and(eq(tables.leads.userId, session.user.id), inArray(tables.leads.status, ['responded', 'converted'])));

    const responseRate = totalLeads > 0 ? (successfulLeads / totalLeads) * 100 : 0;

    // Format campaigns data
    const formattedCampaigns = campaigns.map(c => {
      const cCounts = campaignIdToCounts.get(c.id) ?? { total: 0, successful: 0 };
      return {
        id: c.id,
        name: c.name,
        status: c.status,
        totalLeads: cCounts.total,
        successfulLeads: cCounts.successful,
      };
    });

    // Format LinkedIn accounts data
    const formattedLinkedinAccounts = linkedinAccounts.map(account => ({
      id: account.id,
      name: account.name,
      email: account.email,
      status: account.status,
      requestsSent: account.requestsSent,
      requestsLimit: account.requestsLimit,
      progress: account.progress,
    }));

    // Format recent activity data
    const formattedRecentActivity = recentLeads.map(lead => ({
      id: lead.id,
      name: lead.name,
      title: lead.title || '',
      campaign: lead.campaignName,
      status: lead.status,
      statusType: lead.status,
      profileImage: lead.profileImage,
      updatedAt: lead.updatedAt,
    }));

    return NextResponse.json({
      statistics: {
        totalCampaigns,
        totalLeads,
        activeCampaigns,
        successfulLeads,
        responseRate: responseRate.toFixed(1),
      },
      campaigns: formattedCampaigns,
      linkedinAccounts: formattedLinkedinAccounts,
      recentActivity: formattedRecentActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
