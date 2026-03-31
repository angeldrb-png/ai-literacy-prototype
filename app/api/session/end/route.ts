import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionEndSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = sessionEndSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const session = await prisma.studentSession.update({
      where: { id: parsed.data.sessionId },
      data: {
        finishedAt: new Date(),
        currentWorld: parsed.data.currentWorld,
        currentStep: parsed.data.currentStep,
        status: parsed.data.status ?? "completed",
      },
    });

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("POST /api/session/end failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to end session" }, { status: 500 });
  }
}
