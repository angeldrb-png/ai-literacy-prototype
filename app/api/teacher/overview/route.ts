import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isTeacherAuthenticatedFromRequest } from "@/lib/teacher-auth";

export async function GET(request: NextRequest) {
  try {
    if (!isTeacherAuthenticatedFromRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const [sessionCount, completedCount, sessions] = await Promise.all([
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
]);

const completedSessionIds = sessions
  .filter((s) => s.status === "completed")
  .map((s) => s.id);

const scoreRows = completedSessionIds.length
  ? await prisma.scoreResult.findMany({
      where: { sessionId: { in: completedSessionIds } },
      select: {
        sessionId: true,
        domainId: true,
        competenceId: true,
        score: true,
        evidenceJson: true,
      },
    })
  : [];

// Step 1: average score items within each session + competence.
const competenceBuckets = new Map<string, { sessionId: string; domainId: string; total: number; count: number }>();

for (const row of scoreRows) {
  const evidence =
    typeof row.evidenceJson === "object" && row.evidenceJson
      ? (row.evidenceJson as any)
      : {};

  if (evidence.includeInCompetenceProfile === false) continue;

  const key = `${row.sessionId}__${row.domainId}__${row.competenceId}`;
  const current = competenceBuckets.get(key) ?? {
    sessionId: row.sessionId,
    domainId: row.domainId,
    total: 0,
    count: 0,
  };

  current.total += Number(row.score ?? 0);
  current.count += 1;
  competenceBuckets.set(key, current);
}

// Step 2: average competence scores within each session + domain.
const sessionDomainBuckets = new Map<string, { domainId: string; sessionId: string; total: number; count: number }>();

for (const item of competenceBuckets.values()) {
  if (!item.count) continue;

  const competenceScore = item.total / item.count;
  const key = `${item.sessionId}__${item.domainId}`;
  const current = sessionDomainBuckets.get(key) ?? {
    domainId: item.domainId,
    sessionId: item.sessionId,
    total: 0,
    count: 0,
  };

  current.total += competenceScore;
  current.count += 1;
  sessionDomainBuckets.set(key, current);
}

// Step 3: average session-domain scores across students.
const domainBuckets = new Map<string, { total: number; count: number }>();

for (const item of sessionDomainBuckets.values()) {
  if (!item.count) continue;

  const sessionDomainScore = item.total / item.count;
  const current = domainBuckets.get(item.domainId) ?? { total: 0, count: 0 };

  current.total += sessionDomainScore;
  current.count += 1;
  domainBuckets.set(item.domainId, current);
}

const domainAverages = Array.from(domainBuckets.entries()).map(([domainId, item]) => ({
  domainId,
  average: item.count ? item.total / item.count : null,
  count: item.count,
}));

return NextResponse.json({
  ok: true,
  summary: { sessionCount, completedCount },
  sessions,
  recentSessions: sessions,
  domainAverages,
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
