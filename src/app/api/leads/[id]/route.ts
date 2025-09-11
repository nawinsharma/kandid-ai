import { NextRequest, NextResponse } from "next/server";
import { db, tables } from "@/lib/db";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

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
    const [lead] = await db
      .select()
      .from(tables.leads)
      .where(and(eq(tables.leads.id, id), eq(tables.leads.userId, session.user.id)))
      .limit(1);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
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

    const updatedLead = await db
      .update(tables.leads)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(tables.leads.id, id), eq(tables.leads.userId, session.user.id)));

    // Check if any rows were updated
    if (!updatedLead.rowCount || updatedLead.rowCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Fetch the updated lead
    const [lead] = await db
      .select()
      .from(tables.leads)
      .where(and(eq(tables.leads.id, id), eq(tables.leads.userId, session.user.id)))
      .limit(1);

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
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

    const deletedLead = await db
      .delete(tables.leads)
      .where(and(eq(tables.leads.id, id), eq(tables.leads.userId, session.user.id)));

    if (!deletedLead.rowCount || deletedLead.rowCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
