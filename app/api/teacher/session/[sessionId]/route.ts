import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { sessionId } = await context.params;

    const [session, events, responses, chats, submissions, scores, notes] = await Promise.all([
      prisma.studentSession.findUnique({ where: { id: sessionId } }),
      prisma.eventLog.findMany({ where: { sessionId }, orderBy: { createdAt: "asc" } }),
      prisma.stepResponse.findMany({ where: { sessionId }, orderBy: { savedAt: "asc" } }),
      prisma.aIChatTurn.findMany({ where: { sessionId }, orderBy: [{ turnNo: "asc" }, { createdAt: "asc" }] }),
      prisma.submission.findMany({ where: { sessionId }, orderBy: { submittedAt: "asc" } }),
      prisma.scoreResult.findMany({ where: { sessionId }, orderBy: [{ worldId: "asc" }, { competenceId: "asc" }] }),
      prisma.teacherNote.findMany({ where: { sessionId }, orderBy: { createdAt: "asc" } }),
    ]);

    if (!session) {
      return NextResponse.json({ ok: false, error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      session,
      events,
      responses,
      chats,
      submissions,
      scores,
      notes,
    });
  } catch (error) {
    console.error("GET /api/teacher/session/[sessionId] failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to load session detail" }, { status: 500 });
  }
}
