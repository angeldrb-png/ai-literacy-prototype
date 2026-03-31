import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stepResponseSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = stepResponseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const response = await prisma.stepResponse.upsert({
      where: {
        sessionId_worldId_stepId: {
          sessionId: parsed.data.sessionId,
          worldId: parsed.data.worldId,
          stepId: parsed.data.stepId,
        },
      },
      update: {
        responseJson: parsed.data.responseJson,
        savedAt: new Date(),
      },
      create: {
        sessionId: parsed.data.sessionId,
        worldId: parsed.data.worldId,
        stepId: parsed.data.stepId,
        responseJson: parsed.data.responseJson,
      },
    });

    await prisma.studentSession.update({
      where: { id: parsed.data.sessionId },
      data: {
        currentWorld: parsed.data.worldId,
        currentStep: parsed.data.stepId,
      },
    });

    return NextResponse.json({ ok: true, response });
  } catch (error) {
    console.error("POST /api/response/save failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to save step response",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}