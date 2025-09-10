import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

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

    const campaign = await db.campaign.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        leads: {
          select: {
            id: true,
            name: true,
            email: true,
            title: true,
            company: true,
            linkedinUrl: true,
            profileImage: true,
            status: true,
            activity: true,
            lastContactDate: true,
            createdAt: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Calculate statistics
    const totalLeads = campaign.leads.length;
    const contactedLeads = campaign.leads.filter(lead => 
      lead.status === 'contacted' || lead.status === 'responded' || lead.status === 'converted'
    ).length;
    const respondedLeads = campaign.leads.filter(lead => 
      lead.status === 'responded' || lead.status === 'converted'
    ).length;
    const convertedLeads = campaign.leads.filter(lead => 
      lead.status === 'converted'
    ).length;

    const responseRate = totalLeads > 0 ? (respondedLeads / totalLeads) * 100 : 0;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    const contactRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0;

    const campaignWithStats = {
      ...campaign,
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

    const updatedCampaign = await db.campaign.updateMany({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    if (updatedCampaign.count === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Fetch the updated campaign
    const campaign = await db.campaign.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

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

    const deletedCampaign = await db.campaign.deleteMany({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (deletedCampaign.count === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
