import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isTeacherAuthenticatedFromRequest } from "@/lib/teacher-auth";

export async function GET(request: NextRequest) {
  try {
    if (!isTeacherAuthenticatedFromRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const [sessionCount, completedCount, sessions, averageScores] = await Promise.all([
      prisma.studentSession.count(),
      prisma.studentSession.count({ where: { status: "completed" } }),
      prisma.studentSession.findMany({
        orderBy: { startedAt: "desc" },
        take: 50,
        select: {
          id: true,
          sessionCode: true,
          language: true,
          startedAt: true,
          finishedAt: true,
          currentWorld: true,
          status: true,
          studentName: true,
          studentCode: true,
          className: true,
          schoolName: true,
          gradeLevel: true,
        },
      }),
      prisma.scoreResult.groupBy({
        by: ["domainId"],
        _avg: { score: true },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      summary: { sessionCount, completedCount },
      recentSessions: sessions,
      averageScores,
    });
  } catch (error) {
  console.error("GET /api/teacher/overview failed:", error);

  return NextResponse.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}
