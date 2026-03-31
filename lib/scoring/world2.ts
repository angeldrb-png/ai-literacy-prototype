import { ScoreItem, EvidenceBundle } from "./types";

export function scoreWorld2(evidence: EvidenceBundle): ScoreItem[] {
  const step1 = evidence.stepResponses["w2_step1"] ?? {};
  const step2 = evidence.stepResponses["w2_step2"] ?? {};
  const step3 = evidence.stepResponses["w2_step3"] ?? {};
  const card = evidence.submissionsByWorld["w2"]?.content ?? "";

  const roleChoice = step1.choice ?? null;
  const versionChoice = step2.choice ?? null;
  const flagged = Array.isArray(step3.flaggedClaims) ? step3.flaggedClaims : [];

  let e1 = roleChoice ? 2 : 0;
  if (roleChoice && card.length > 30) e1 = 3;

  let e2 = 0;
  if (versionChoice) e2 = 1;
  if (versionChoice && flagged.length >= 1) e2 = 2;
  if (versionChoice && flagged.length >= 1 && card.length > 40) e2 = 3;

  let e5 = 0;
  if (flagged.length >= 1) e5 = 2;
  if (flagged.length >= 2 && card.length > 30) e5 = 3;

  return [
    {
      worldId: "w2",
      competenceId: "E1",
      domainId: "Engaging with AI",
      score: e1,
      evidenceJson: { roleChoice },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w2",
      competenceId: "E2",
      domainId: "Engaging with AI",
      score: e2,
      evidenceJson: { versionChoice, flaggedCount: flagged.length, cardLength: card.length },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w2",
      competenceId: "E5",
      domainId: "Engaging with AI",
      score: e5,
      evidenceJson: { flaggedCount: flagged.length },
      rubricVersion: "v1.0",
    },
  ];
}
