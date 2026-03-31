import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.upsert({
      where: {
        sessionId_worldId: {
          sessionId: parsed.data.sessionId,
          worldId: parsed.data.worldId,
        },
      },
      update: {
        submissionType: parsed.data.submissionType,
        content: parsed.data.content,
        selfCheckJson: parsed.data.selfCheckJson,
        submittedAt: new Date(),
      },
      create: parsed.data,
    });

    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    console.error("POST /api/submission failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to save submission" }, { status: 500 });
  }
}
