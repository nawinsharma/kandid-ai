import { NextRequest, NextResponse } from "next/server";
import { db, tables } from "@/lib/db";
import { auth } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [campaign] = await db
      .select()
      .from(tables.campaigns)
      .where(and(eq(tables.campaigns.id, id), eq(tables.campaigns.userId, session.user.id)))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Leads for campaign
    const leads = await db
      .select({
        id: tables.leads.id,
        name: tables.leads.name,
        email: tables.leads.email,
        title: tables.leads.title,
        company: tables.leads.company,
        linkedinUrl: tables.leads.linkedinUrl,
        profileImage: tables.leads.profileImage,
        status: tables.leads.status,
        activity: tables.leads.activity,
        lastContactDate: tables.leads.lastContactDate,
        createdAt: tables.leads.createdAt,
      })
      .from(tables.leads)
      .where(and(eq(tables.leads.campaignId, id), eq(tables.leads.userId, session.user.id)))
      .orderBy(desc(tables.leads.createdAt));

    const totalLeads = leads.length;
    const contactedLeads = leads.filter(lead => 
      lead.status === 'contacted' || lead.status === 'responded' || lead.status === 'converted'
    ).length;
    const respondedLeads = leads.filter(lead => 
      lead.status === 'responded' || lead.status === 'converted'
    ).length;
    const convertedLeads = leads.filter(lead => 
      lead.status === 'converted'
    ).length;

    const responseRate = totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    const contactRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0;

    const campaignWithStats = {
      ...campaign,
      leads,
      statistics: {
        totalLeads,
        contactedLeads,
        respondedLeads,
        convertedLeads,
        responseRate: responseRate.toFixed(1),
        conversionRate: conversionRate.toFixed(1),
        contactRate: contactRate.toFixed(1),
      },
    };

    return NextResponse.json(campaignWithStats);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updatedCampaign = await db
      .update(tables.campaigns)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(tables.campaigns.id, id), eq(tables.campaigns.userId, session.user.id)));

    if (!updatedCampaign.rowCount || updatedCampaign.rowCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Fetch the updated campaign
    const [campaign] = await db
      .select()
      .from(tables.campaigns)
      .where(and(eq(tables.campaigns.id, id), eq(tables.campaigns.userId, session.user.id)))
      .limit(1);

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deletedCampaign = await db
      .delete(tables.campaigns)
      .where(and(eq(tables.campaigns.id, id), eq(tables.campaigns.userId, session.user.id)));

    if (!deletedCampaign.rowCount || deletedCampaign.rowCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
