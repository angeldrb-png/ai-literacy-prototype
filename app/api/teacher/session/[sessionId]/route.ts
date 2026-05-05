import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isTeacherAuthenticatedFromRequest } from "@/lib/teacher-auth";

function parseTeacherRating(note: any) {
  try {
    const json = JSON.parse(note.noteText);
    if (json?.type !== "teacher_rating") return null;
    return { id: note.id, createdAt: note.createdAt, ...json };
  } catch {
    return null;
  }
}

type Context = { params: Promise<{ sessionId: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    if (!isTeacherAuthenticatedFromRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await context.params;
    const [session, events, responses, chats, submissions, scores, teacherNotes] = await Promise.all([
      prisma.studentSession.findUnique({ where: { id: sessionId } }),
      prisma.eventLog.findMany({ where: { sessionId }, orderBy: { createdAt: "asc" } }),
      prisma.stepResponse.findMany({ where: { sessionId }, orderBy: { savedAt: "asc" } }),
      prisma.aIChatTurn.findMany({ where: { sessionId }, orderBy: [{ turnNo: "asc" }, { createdAt: "asc" }] }),
      prisma.submission.findMany({ where: { sessionId }, orderBy: { submittedAt: "asc" } }),
      prisma.scoreResult.findMany({ where: { sessionId }, orderBy: [{ worldId: "asc" }, { competenceId: "asc" }] }),
      prisma.teacherNote.findMany({ where: { sessionId }, orderBy: { createdAt: "desc" } }),
    ]);

    if (!session) {
      return NextResponse.json({ ok: false, error: "Session not found" }, { status: 404 });
    }

    const teacherRatings = teacherNotes.map(parseTeacherRating).filter(Boolean);
    return NextResponse.json({ ok: true, session, events, responses, chats, submissions, scores, teacherRatings });
  } catch (error) {
    console.error("GET /api/teacher/session/[sessionId] failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to load session detail" }, { status: 500 });
  }
}
