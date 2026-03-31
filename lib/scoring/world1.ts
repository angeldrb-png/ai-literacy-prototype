import { ScoreItem, EvidenceBundle } from "./types";

export function scoreWorld1(evidence: EvidenceBundle): ScoreItem[] {
  const step2 = evidence.stepResponses["w1_step2"] ?? {};
  const step3 = evidence.stepResponses["w1_step3"] ?? {};
  const feedback = evidence.submissionsByWorld["w1"]?.content ?? "";

  const mode = step2.mode ?? null;
  const logic = step2.logic ?? null;
  const rules = step3.rules ?? {};

  let e3 = 0;
  if (mode) e3 = 2;
  if (mode && feedback.length > 40) e3 = 3;

  let d2 = 0;
  if (logic) d2 = 2;
  if (logic && feedback.length > 40) d2 = 3;

  let m5 = 0;
  const ruleCount = Object.values(rules).filter(Boolean).length;
  if (ruleCount >= 1) m5 = 1;
  if (ruleCount >= 2) m5 = 2;
  if (ruleCount >= 3 && feedback.length > 30) m5 = 3;

  return [
    {
      worldId: "w1",
      competenceId: "E3",
      domainId: "Engaging with AI",
      score: e3,
      evidenceJson: { mode, feedbackLength: feedback.length },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w1",
      competenceId: "D2",
      domainId: "Designing AI",
      score: d2,
      evidenceJson: { logic, feedbackLength: feedback.length },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w1",
      competenceId: "M5",
      domainId: "Managing AI",
      score: m5,
      evidenceJson: { ruleCount, rules },
      rubricVersion: "v1.0",
    },
  ];
}
