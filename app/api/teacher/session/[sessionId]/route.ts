import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isTeacherAuthenticatedFromRequest } from "@/lib/teacher-auth";

type Context = { params: Promise<{ sessionId: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    if (!isTeacherAuthenticatedFromRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await context.params;

    const [session, events, responses, chats, submissions, scores] = await Promise.all([
      prisma.studentSession.findUnique({ where: { id: sessionId } }),
      prisma.eventLog.findMany({ where: { sessionId }, orderBy: { createdAt: "asc" } }),
      prisma.stepResponse.findMany({ where: { sessionId }, orderBy: { savedAt: "asc" } }),
      prisma.aIChatTurn.findMany({ where: { sessionId }, orderBy: [{ turnNo: "asc" }, { createdAt: "asc" }] }),
      prisma.submission.findMany({ where: { sessionId }, orderBy: { submittedAt: "asc" } }),
      prisma.scoreResult.findMany({ where: { sessionId }, orderBy: [{ worldId: "asc" }, { competenceId: "asc" }] }),
    ]);

    if (!session) {
      return NextResponse.json({ ok: false, error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, session, events, responses, chats, submissions, scores });
  } catch (error) {
    console.error("GET /api/teacher/session/[sessionId] failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to load session detail" }, { status: 500 });
  }
}
