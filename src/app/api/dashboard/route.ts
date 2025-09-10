import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch campaigns with lead counts
    const campaigns = await db.campaign.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        leads: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6, // Limit to 6 most recent campaigns
    });

    // Fetch LinkedIn accounts
    const linkedinAccounts = await db.linkedinAccount.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch recent leads with campaign info
    const recentLeads = await db.lead.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 8, // Limit to 8 most recent leads
    });

    // Calculate overall statistics
    const totalCampaigns = await db.campaign.count({
      where: { userId: session.user.id },
    });

    const totalLeads = await db.lead.count({
      where: { userId: session.user.id },
    });

    const activeCampaigns = await db.campaign.count({
      where: { 
        userId: session.user.id,
        status: 'active',
      },
    });

    const successfulLeads = await db.lead.count({
      where: { 
        userId: session.user.id,
        status: { in: ['responded', 'converted'] },
      },
    });

    const responseRate = totalLeads > 0 ? (successfulLeads / totalLeads) * 100 : 0;

    // Format campaigns data
    const formattedCampaigns = campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      totalLeads: campaign.leads.length,
      successfulLeads: campaign.leads.filter(lead => 
        lead.status === 'responded' || lead.status === 'converted'
      ).length,
    }));

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
      campaign: lead.campaign.name,
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
