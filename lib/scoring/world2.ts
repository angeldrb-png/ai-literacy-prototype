import { EvidenceBundle, ScoreItem } from "./types";
import { applyTeacherRating, arr, makeScore, obj, str } from "./utils";

export function scoreWorld2(evidence: EvidenceBundle): ScoreItem[] {
  const scores: ScoreItem[] = [];
  const step1 = obj(evidence.stepResponses["w2_step1"]);
  const step2 = obj(evidence.stepResponses["w2_step2"]);
  const step3 = obj(evidence.stepResponses["w2_step3"]);
  const step4 = obj(evidence.stepResponses["w2_step4"]);
  const submission = evidence.submissionsByWorld["w2"];

  // W2-R1: E1 role and human final decision.
  const role = str(step1.aiRoleChoiceId ?? step1.choice);
  const finalDecisionBy = str(step1.finalDecisionBy);
  if (role || finalDecisionBy) {
    let score = 0;
    const roleOk = role === "organize_information_generate_draft" || role === "draft" || role === "provide_reference";
    const finalNotAi = finalDecisionBy === "student_group" || finalDecisionBy === "teacher";
    if (roleOk) score = 2;
    if (roleOk && finalNotAi) score = 3;
    if (!roleOk && finalDecisionBy && finalNotAi) score = 1;

    scores.push(
      makeScore({
        worldId: "w2",
        competenceId: "E1",
        domainId: "engaging",
        score,
        scoreId: "W2-R1",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        evidence: { role, finalDecisionBy },
        rationale:
          "Scores whether the student identifies AI as an information organiser/draft generator and keeps final publication responsibility with humans.",
      })
    );
  }

  // W2-R2: E2 draft comparison.
  const draftChoice = str(step2.draftChoiceId ?? step2.choice);
  const reasonTags = arr(step2.draftReasonTags);
  const validReasons = ["more_specific", "clearer_for_campus_card", "needs_further_checking"];
  if (draftChoice) {
    const strongerDraft = draftChoice === "b" || draftChoice === "B" || draftChoice === "version_b";
    let score = strongerDraft ? 2 : 1;
    if (strongerDraft && reasonTags.some((r) => validReasons.includes(r))) score = 3;
    if (!strongerDraft && reasonTags.some((r) => ["too_general", "may_be_misleading"].includes(r))) score = 0;

    scores.push(
      makeScore({
        worldId: "w2",
        competenceId: "E2",
        domainId: "engaging",
        score,
        scoreId: "W2-R2",
        scoringSource: "auto_keyed",
        evidenceStrength: reasonTags.length ? "strong" : "moderate",
        evidence: { draftChoice, reasonTags },
        rationale:
          "Scores the student's situated judgement when comparing two AI drafts. Reason tags strengthen the inference; draft choice alone is only moderate evidence.",
      })
    );
  }

  // W2-R3: E2 claim-level checking.
  const statuses = obj(step3.claimStatusById);
  const entries = Object.entries(statuses);
  if (entries.length) {
    const expected: Record<string, string[]> = {
      claim_plastic_pollution_affects_ocean: ["keep"],
      claim_problem_can_be_solved_quickly: ["check", "remove"],
      claim_microplastics_enter_food_chain: ["check", "keep"],
      claim_reduce_single_use_plastic: ["keep"],
    };

    function inferExpected(id: string): string[] {
      const text = id.toLowerCase();
      if (expected[id]) return expected[id];
      if (/很快|quick|马上|馬上|解决|解決/.test(id)) return ["check", "remove"];
      if (/微塑料|microplastic|food|食物链|食物鏈/.test(id)) return ["check", "keep"];
      if (/海洋|ocean|污染|pollution|影响|影響/.test(id)) return ["keep"];
      if (/减少|減少|reduce|single-use|一次性/.test(id)) return ["keep"];
      return ["check"];
    }

    let total = 0;
    const itemScores = entries.map(([claimId, statusAny]) => {
      const status = str(statusAny);
      const key = inferExpected(claimId);
      const itemScore = key.includes(status) ? 1 : status === "check" && key.includes("remove") ? 0.5 : 0;
      total += itemScore;
      return { claimId, status, expected: key, itemScore };
    });
    const average = total / entries.length;
    const score = average >= 0.85 ? 3 : average >= 0.6 ? 2 : average >= 0.3 ? 1 : 0;

    scores.push(
      makeScore({
        worldId: "w2",
        competenceId: "E2",
        domainId: "engaging",
        score,
        scoreId: "W2-R3",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        evidence: { itemScores, average },
        rationale:
          "Scores claim checking with a task-specific answer key. This is a primary automatic evidence source for accept/revise/reject judgement.",
      })
    );
  }
  // W2-R3B: optional source-awareness enhancer.
  // This should strengthen evidence but should not reduce the core E2 score if absent.
  const sourceCheckViewed = Boolean(
    step3.sourceCheckViewed ??
      step4.sourceCheckViewed ??
      submission?.selfCheckJson?.sourceCheckViewed
  );

  const sourceCheckChoice = str(
    step3.sourceCheckChoice ??
      step4.sourceCheckChoice ??
      submission?.selfCheckJson?.sourceCheckChoice
  );

  if (sourceCheckViewed || sourceCheckChoice) {
    const responsibleSourceChoices = ["trusted_source", "ask_teacher"];
    const weakSourceChoice = sourceCheckChoice === "ai_only";

    let sourceScore = 1;
    if (responsibleSourceChoices.includes(sourceCheckChoice)) {
      sourceScore = 3;
    }
    if (weakSourceChoice) {
      sourceScore = 1;
    }

    scores.push(
      makeScore({
        worldId: "w2",
        competenceId: "E2",
        domainId: "engaging",
        score: sourceScore,
        scoreId: "W2-R3B",
        scoringSource: "auto_indicator",
        evidenceStrength: responsibleSourceChoices.includes(sourceCheckChoice)
          ? "strong"
          : "limited",
        coverageLevel: "supporting",
        evidence: {
          sourceCheckViewed,
          sourceCheckChoice,
          responsibleSourceChoices,
        },
        rationale:
          "Optional source-awareness evidence. It strengthens the interpretation of E2 when the student chooses to compare AI output with a trusted source or ask a teacher, but absence of this optional action should not reduce the core E2 score.",
      })
    );
  }
  // W2-R4: teacher-light final reason.
 
  const finalReason = str(step4.finalReason ?? submission?.content);
  if (finalReason.trim()) {
    const hasCheckingLogic = /check|verify|核查|查|accuracy|准确|準確|mislead|误导|誤導|clear|清楚/.test(finalReason);
    const baseScore = hasCheckingLogic ? 2 : 1;
    const reviewed = applyTeacherRating(baseScore, evidence, "w2_final_reason", "E2");

    scores.push(
      makeScore({
        worldId: "w2",
        competenceId: "E2",
        domainId: "engaging",
        score: reviewed.score,
        scoreId: "W2-R4",
        scoringSource: "teacher_light",
        evidenceStrength: "mixed",
        reviewStatus: reviewed.reviewStatus,
        evidence: { hasCheckingLogic, teacherRating: reviewed.teacherRating, contentPreview: finalReason.slice(0, 240) },
        rationale:
          "Open final reason needs teacher-light review. The system only flags whether checking/accuracy/clarity logic appears.",
      })
    );
  }

  return scores;
}
