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

    const userCampaigns = await db.campaign.findMany({
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
    });

    // Calculate statistics for each campaign
    const campaignsWithStats = userCampaigns.map(campaign => {
      const totalLeads = campaign.leads.length;
      const successfulLeads = campaign.leads.filter(lead => 
        lead.status === 'responded' || lead.status === 'converted'
      ).length;
      const responseRate = totalLeads > 0 ? (successfulLeads / totalLeads) * 100 : 0;

      return {
        ...campaign,
        totalLeads,
        successfulLeads,
        responseRate: responseRate.toFixed(2),
        leads: undefined, // Remove the leads array from the response
      };
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

    const campaign = await db.campaign.create({
      data: newCampaign,
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
