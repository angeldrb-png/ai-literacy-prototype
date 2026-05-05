import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isTeacherAuthenticatedFromRequest } from "@/lib/teacher-auth";
import { scoreSession } from "@/lib/scoring";

const teacherRatingSchema = z.object({
  sessionId: z.string().min(1),
  productKey: z.string().min(1),
  worldId: z.string().min(1),
  competenceIds: z.array(z.string().min(1)).min(1),
  score: z.number().min(0).max(3),
  comment: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    if (!isTeacherAuthenticatedFromRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = teacherRatingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const noteText = JSON.stringify({
      type: "teacher_rating",
      productKey: payload.productKey,
      worldId: payload.worldId,
      competenceIds: payload.competenceIds,
      score: payload.score,
      comment: payload.comment ?? "",
      savedAt: new Date().toISOString(),
    });

    const note = await prisma.teacherNote.create({
      data: {
        sessionId: payload.sessionId,
        noteText,
      },
    });

    const scores = await scoreSession(payload.sessionId);

    return NextResponse.json({ ok: true, note, scores });
  } catch (error) {
    console.error("POST /api/teacher/rating failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to save teacher rating",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
