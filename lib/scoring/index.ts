import { prisma } from "@/lib/prisma";
import { ScoreItem, EvidenceBundle } from "./types";
import { scoreWorld1 } from "./world1";
import { scoreWorld2 } from "./world2";
import { scoreWorld3 } from "./world3";
import { scoreWorld4 } from "./world4";
import { scoreWorld5 } from "./world5";

export async function loadEvidence(sessionId: string): Promise<EvidenceBundle> {
  const [responses, events, submissions, chatTurns] = await Promise.all([
    prisma.stepResponse.findMany({ where: { sessionId } }),
    prisma.eventLog.findMany({ where: { sessionId } }),
    prisma.submission.findMany({ where: { sessionId } }),
    prisma.aIChatTurn.findMany({ where: { sessionId }, orderBy: [{ turnNo: "asc" }, { createdAt: "asc" }] }),
  ]);

  const stepResponses: Record<string, any> = {};
  responses.forEach((row) => {
    stepResponses[row.stepId] = row.responseJson;
  });

  const eventsByName: Record<string, any[]> = {};
  events.forEach((row) => {
    if (!eventsByName[row.eventName]) eventsByName[row.eventName] = [];
    eventsByName[row.eventName].push(row);
  });

  const submissionsByWorld: Record<string, { content: string; selfCheckJson: any | null }> = {};
  submissions.forEach((row) => {
    submissionsByWorld[row.worldId] = {
      content: row.content,
      selfCheckJson: row.selfCheckJson ?? null,
    };
  });

  return {
    stepResponses,
    eventsByName,
    submissionsByWorld,
    chatTurns: chatTurns.map((t) => ({
      worldId: t.worldId,
      turnNo: t.turnNo,
      role: t.role,
      content: t.content,
    })),
  };
}

export async function scoreSession(sessionId: string) {
  const evidence = await loadEvidence(sessionId);

  const scoreItems: ScoreItem[] = [
    ...scoreWorld1(evidence),
    ...scoreWorld2(evidence),
    ...scoreWorld3(evidence),
    ...scoreWorld4(evidence),
    ...scoreWorld5(evidence),
  ];

  await prisma.$transaction([
    prisma.scoreResult.deleteMany({ where: { sessionId } }),
    prisma.scoreResult.createMany({
      data: scoreItems.map((item) => ({
        sessionId,
        worldId: item.worldId,
        competenceId: item.competenceId,
        domainId: item.domainId,
        score: item.score,
        evidenceJson: item.evidenceJson,
        rubricVersion: item.rubricVersion,
      })),
    }),
  ]);

  return scoreItems;
}
