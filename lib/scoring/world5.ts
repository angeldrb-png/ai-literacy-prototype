import { ScoreItem, EvidenceBundle } from "./types";

export function scoreWorld5(evidence: EvidenceBundle): ScoreItem[] {
  const step1 = evidence.stepResponses["w5_step1"] ?? {};
  const step2 = evidence.stepResponses["w5_step2"] ?? {};
  const step3 = evidence.stepResponses["w5_step3"] ?? {};
  const step4 = evidence.stepResponses["w5_step4"] ?? {};
  const card = evidence.submissionsByWorld["w5"]?.content ?? "";

  const problemChoice = step1.choice ?? null;
  const biasSource = step2.choice ?? null;
  const trainingImages = Array.isArray(step3.selectedTrainingImages) ? step3.selectedTrainingImages : [];
  const reminders = Array.isArray(step4.selectedReminders) ? step4.selectedReminders : [];

  let d1 = problemChoice ? 2 : 0;
  if (problemChoice && card.length > 30) d1 = 3;

  let e4 = biasSource ? 2 : 0;
  if (biasSource && /data|rule|history|training/i.test(String(biasSource))) e4 = 3;

  let d3 = 0;
  if (trainingImages.length >= 1) d3 = 1;
  if (trainingImages.length >= 2) d3 = 2;
  if (trainingImages.length >= 3) d3 = 3;

  let d4e7e5 = 0;
  if (reminders.length >= 1) d4e7e5 = 1;
  if (reminders.length >= 2) d4e7e5 = 2;
  if (reminders.length >= 3) d4e7e5 = 3;

  let d5 = 0;
  if (card.length >= 30) d5 = 1;
  if (card.length >= 80) d5 = 2;
  if (card.length >= 140) d5 = 3;

  return [
    {
      worldId: "w5",
      competenceId: "D1",
      domainId: "Designing AI",
      score: d1,
      evidenceJson: { problemChoice },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w5",
      competenceId: "E4",
      domainId: "Engaging with AI",
      score: e4,
      evidenceJson: { biasSource },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w5",
      competenceId: "D3",
      domainId: "Designing AI",
      score: d3,
      evidenceJson: { trainingImageCount: trainingImages.length, trainingImages },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w5",
      competenceId: "D4_E7_E5",
      domainId: "Designing AI",
      score: d4e7e5,
      evidenceJson: { reminderCount: reminders.length, reminders },
      rubricVersion: "v1.0",
    },
    {
      worldId: "w5",
      competenceId: "D5",
      domainId: "Designing AI",
      score: d5,
      evidenceJson: { modelCardLength: card.length },
      rubricVersion: "v1.0",
    },
  ];
}
