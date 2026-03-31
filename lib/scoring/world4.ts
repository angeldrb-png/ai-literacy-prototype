import { ScoreItem, EvidenceBundle } from "./types";

export function scoreWorld4(evidence: EvidenceBundle): ScoreItem[] {
  const step1 = evidence.stepResponses["w4_step1"] ?? {};
  const step2 = evidence.stepResponses["w4_step2"] ?? {};
  const step3 = evidence.stepResponses["w4_step3"] ?? {};
  const step4 = evidence.stepResponses["w4_step4"] ?? {};
  const card = evidence.submissionsByWorld["w4"]?.content ?? "";

  const useAiChoice = step1.useAiChoice ?? null;
  const aiTasks = Array.isArray(step2.aiTasks) ? step2.aiTasks : [];
  const humanTasks = Array.isArray(step2.humanTasks) ? step2.humanTasks : [];
  const aiRole = step3.aiRole ?? null;
  const adjusted = !!step4.adjustedWorkflow;

  let m1 = useAiChoice === "partial" ? 3 : useAiChoice ? 1 : 0;

  let m2 = 0;
  if (aiTasks.length || humanTasks.length) m2 = 1;
  if (aiTasks.length >= 1 && humanTasks.length >= 1) m2 = 2;
  if (humanTasks.some((t: string) => /建议|解释|判断/.test(t))) m2 = 3;

  let m4 = 0;
  if (aiRole) m4 = 1;
  if (aiRole && adjusted) m4 = 3;
  else if (aiRole) m4 = 2;

  let m5 = 0;
  if (card.length >= 20) m5 = 1;
  if (card.length >= 50) m5 = 2;
  if (card.length >= 100) m5 = 3;

  return [
    {
      worldId: "w4",
      competenceId: "M1",
      domainId: "Managing AI",
      score: m1,
      evidenceJson: { useAiChoice },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w4",
      competenceId: "M2",
      domainId: "Managing AI",
      score: m2,
      evidenceJson: { aiTaskCount: aiTasks.length, humanTaskCount: humanTasks.length, humanTasks },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w4",
      competenceId: "M4",
      domainId: "Managing AI",
      score: m4,
      evidenceJson: { aiRole, adjusted },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w4",
      competenceId: "M5",
      domainId: "Managing AI",
      score: m5,
      evidenceJson: { workflowCardLength: card.length },
      rubricVersion: "v1.0",
    },
  ];
}
