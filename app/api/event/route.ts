import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventLogSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = eventLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const event = await prisma.eventLog.create({
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, event });
  } catch (error) {
    console.error("POST /api/event failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to save event" }, { status: 500 });
  }
}
