import { ScoreItem, EvidenceBundle } from "./types";

export function scoreWorld3(evidence: EvidenceBundle): ScoreItem[] {
  const step1 = evidence.stepResponses["w3_step1"] ?? {};
  const step3 = evidence.stepResponses["w3_step3"] ?? {};
  const submission = evidence.submissionsByWorld["w3"];
  const promptTags = Array.isArray(step3.promptTags) ? step3.promptTags : [];
  const prompts = evidence.chatTurns.filter((t) => t.worldId === "w3" && t.role === "user");
  const aiTurns = evidence.chatTurns.filter((t) => t.worldId === "w3" && t.role === "ai");

  const selfCheck = submission?.selfCheckJson ?? {};
  const finalText = submission?.content ?? "";

  let m3 = 0;
  if (prompts.length >= 1) m3 = 1;
  if (prompts.length >= 1 && promptTags.length >= 1) m3 = 2;
  if (prompts.length >= 1 && promptTags.length >= 2) m3 = 3;

  let c3 = 0;
  if (aiTurns.length >= 1) c3 = 1;
  if (aiTurns.length >= 2) c3 = 2;
  if (aiTurns.length >= 2 && prompts.length >= 2) c3 = 3;

  let c4e6 = 0;
  const selfCheckCount = Object.values(selfCheck).filter(Boolean).length;
  if (finalText.length >= 20) c4e6 = 1;
  if (finalText.length >= 20 && selfCheckCount >= 2) c4e6 = 2;
  if (finalText.length >= 50 && selfCheckCount >= 3) c4e6 = 3;

  let c5 = 0;
  if (selfCheck["understands_ai_generates_from_prompts"]) c5 = 3;
  else if (selfCheckCount >= 1) c5 = 1;

  return [
    {
      worldId: "w3",
      competenceId: "M3",
      domainId: "Managing AI",
      score: m3,
      evidenceJson: { promptCount: prompts.length, promptTagCount: promptTags.length, recipient: step1.recipient ?? null },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w3",
      competenceId: "C3",
      domainId: "Creating with AI",
      score: c3,
      evidenceJson: { userTurns: prompts.length, aiTurns: aiTurns.length },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w3",
      competenceId: "C4_E6",
      domainId: "Creating with AI",
      score: c4e6,
      evidenceJson: { finalLength: finalText.length, selfCheckCount },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w3",
      competenceId: "C5",
      domainId: "Creating with AI",
      score: c5,
      evidenceJson: { selfCheck },
      rubricVersion: "v1.0",
    },
  ];
}
