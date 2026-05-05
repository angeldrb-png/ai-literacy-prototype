import { EvidenceBundle, ScoreItem } from "./types";
import { arr, makeScore, obj, str } from "./utils";

const STRUCTURED_TASKS = [
  "calculate_percentages",
  "organize_key_points",
  "explain_common_pattern",
];

const HUMAN_JUDGEMENT_TASKS = [
  "explain_results",
  "decide_final_suggestions",
  "check_fairness_feasibility",
  "disclose_ai_use",
  "explain_ai_use",
  "decide_what_to_send_school",
];

const ACCEPTABLE_AI_VALUES = [
  "ai",
  "ai_auto",
  "ai_assist_human_check",
  "ai_assisted_human_check",
];

const AUGMENT_VALUES = [
  "ai_assist_human_check",
  "ai_assisted_human_check",
];

const HUMAN_ONLY_VALUES = ["human", "human_only"];

function allocationValue(map: Record<string, any>, id: string) {
  return String(map[id] ?? "");
}

export function scoreWorld4(evidence: EvidenceBundle): ScoreItem[] {
  const scores: ScoreItem[] = [];

  const step1 = obj(evidence.stepResponses["w4_step1"]);
  const step2 = obj(evidence.stepResponses["w4_step2"]);
  const step3 = obj(evidence.stepResponses["w4_step3"]);
  const step4 = obj(evidence.stepResponses["w4_step4"]);

  const useChoice = str(step1.useAiChoice);
  const responsibilityById = obj(step2.taskResponsibilityById);

  const workflowAllocation = obj(
    step2.workflowAllocation ??
      step4.workflowAllocation ??
      step2.taskResponsibilityById
  );

  const aiTasks = arr(step2.aiTaskIds ?? step2.aiTasks);
  const humanStillDo = arr(step4.humanStillDoIds ?? step2.humanTasks);
  const aiRoleId = str(step3.aiRoleId ?? step3.aiRole);
  const aiOutputUseChoiceId = str(step4.aiOutputUseChoiceId ?? step4.useChoice);
  const aiUseRuleIds = arr(step4.aiUseRuleIds ?? step4.rules);

  // M1: judge whether/how AI should be used.
  if (
    useChoice ||
    aiRoleId ||
    aiTasks.length ||
    Object.keys(workflowAllocation).length
  ) {
    let score = 0;

    if (aiRoleId === "no_ai_support") {
      score = 2;
    } else if (
      aiRoleId ||
      aiTasks.length ||
      Object.keys(workflowAllocation).length
    ) {
      score = 2;
    }

    const selectedSensible = STRUCTURED_TASKS.filter(
      (id) =>
        ACCEPTABLE_AI_VALUES.includes(allocationValue(workflowAllocation, id)) ||
        aiTasks.includes(id)
    );

    const selectedRiskyAiOnly = HUMAN_JUDGEMENT_TASKS.filter(
      (id) =>
        allocationValue(workflowAllocation, id) === "ai" ||
        allocationValue(workflowAllocation, id) === "ai_auto" ||
        aiTasks.includes(id)
    );

    if (selectedSensible.length >= 1 && selectedRiskyAiOnly.length === 0) {
      score = 3;
    }

    if (selectedRiskyAiOnly.length >= 2) {
      score = 1;
    }

    scores.push(
      makeScore({
        worldId: "w4",
        competenceId: "M1",
        domainId: "managing",
        score,
        scoreId: "W4-R1",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        evidence: {
          useChoice,
          aiRoleId,
          aiTasks,
          workflowAllocation,
          selectedSensible,
          selectedRiskyAiOnly,
        },
        rationale:
          "Scores whether the student makes a sensible judgement about whether and how AI should be used for a structured project task.",
      })
    );
  }

  // M2: distinguish AI task responsibility from human responsibility.
  if (
    Object.keys(responsibilityById).length ||
    Object.keys(workflowAllocation).length ||
    humanStillDo.length
  ) {
    const humanCriticalKept = HUMAN_JUDGEMENT_TASKS.filter(
      (id) =>
        HUMAN_ONLY_VALUES.includes(allocationValue(workflowAllocation, id)) ||
        HUMAN_ONLY_VALUES.includes(allocationValue(responsibilityById, id)) ||
        humanStillDo.includes(id)
    );

    const aiAppropriateDelegated = STRUCTURED_TASKS.filter(
      (id) =>
        ACCEPTABLE_AI_VALUES.includes(allocationValue(workflowAllocation, id)) ||
        ACCEPTABLE_AI_VALUES.includes(allocationValue(responsibilityById, id)) ||
        aiTasks.includes(id)
    );

    let score = 0;

    if (
      Object.keys(responsibilityById).length ||
      Object.keys(workflowAllocation).length ||
      humanStillDo.length
    ) {
      score = 1;
    }

    if (humanCriticalKept.length >= 2 && aiAppropriateDelegated.length >= 1) {
      score = 2;
    }

    if (humanCriticalKept.length >= 3 && aiAppropriateDelegated.length >= 2) {
      score = 3;
    }

    scores.push(
      makeScore({
        worldId: "w4",
        competenceId: "M2",
        domainId: "managing",
        score,
        scoreId: "W4-R2",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        evidence: {
          responsibilityById,
          workflowAllocation,
          humanStillDo,
          humanCriticalKept,
          aiAppropriateDelegated,
        },
        rationale:
          "Scores whether the student keeps judgement, fairness, disclosure, and final decisions with humans while delegating suitable structured work to AI.",
      })
    );
  }

  // M4: delegate tasks to AI to appropriately automate or augment human workflows.
  if (
    Object.keys(workflowAllocation).length ||
    aiTasks.length ||
    humanStillDo.length
  ) {
    const automationTaskIds = STRUCTURED_TASKS.filter(
      (id) =>
        allocationValue(workflowAllocation, id) === "ai_auto" ||
        allocationValue(workflowAllocation, id) === "ai" ||
        aiTasks.includes(id)
    );

    const augmentationTaskIds = Object.entries(workflowAllocation)
      .filter(([, value]) => AUGMENT_VALUES.includes(String(value)))
      .map(([taskId]) => taskId);

    const humanJudgementTaskIds = HUMAN_JUDGEMENT_TASKS.filter(
      (id) =>
        HUMAN_ONLY_VALUES.includes(allocationValue(workflowAllocation, id)) ||
        humanStillDo.includes(id)
    );

    const riskyAiOnlyJudgementTaskIds = HUMAN_JUDGEMENT_TASKS.filter(
      (id) =>
        allocationValue(workflowAllocation, id) === "ai_auto" ||
        allocationValue(workflowAllocation, id) === "ai"
    );

    let score = 0;

    if (riskyAiOnlyJudgementTaskIds.length >= 2) {
      score = 0;
    } else if (Object.keys(workflowAllocation).length || aiTasks.length) {
      score = 1;
    }

    if (automationTaskIds.length >= 1 && humanJudgementTaskIds.length >= 1) {
      score = 2;
    }

    if (
      automationTaskIds.length >= 1 &&
      augmentationTaskIds.length >= 1 &&
      humanJudgementTaskIds.length >= 3 &&
      riskyAiOnlyJudgementTaskIds.length === 0
    ) {
      score = 3;
    }

    scores.push(
      makeScore({
        worldId: "w4",
        competenceId: "M4",
        domainId: "managing",
        score,
        scoreId: "W4-R3",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        coverageLevel: "primary",
        evidence: {
          workflowAllocation,
          automationTaskIds,
          augmentationTaskIds,
          humanJudgementTaskIds,
          riskyAiOnlyJudgementTaskIds,
        },
        rationale:
          "Scores M4 as workflow delegation: AI automates/augments structured work while humans retain creative, ethical, disclosure, and final-judgement responsibilities.",
      })
    );
  }

  // M3: AI use instructions/constraints via output use choice and role selection.
  if (aiOutputUseChoiceId || aiRoleId) {
    let score = 1;

    if (
      ["revise_check_before_use", "do_not_use_directly"].includes(
        aiOutputUseChoiceId
      )
    ) {
      score = 2;
    }

    if (
      ["revise_check_before_use", "do_not_use_directly"].includes(
        aiOutputUseChoiceId
      ) &&
      aiRoleId &&
      aiRoleId !== "draft"
    ) {
      score = 3;
    }

    scores.push(
      makeScore({
        worldId: "w4",
        competenceId: "M3",
        domainId: "managing",
        score,
        scoreId: "W4-R4",
        scoringSource: "auto_keyed",
        evidenceStrength: "moderate",
        coverageLevel: "mixed",
        evidence: {
          aiRoleId,
          aiOutputUseChoiceId,
        },
        rationale:
          "Moderate evidence that the student uses AI with constraints by selecting a role and deciding whether output needs checking or revision.",
      })
    );
  }

  // M5: responsible AI-use rules.
  if (aiUseRuleIds.length) {
    const responsibleRules = [
      "disclose_ai_use",
      "human_final_decision",
      "check_ai_result",
      "check_ai_data",
      "check_fairness",
      "do_not_copy_directly",
      "do_not_copy_ai_directly",
    ];

    const selectedResponsible = aiUseRuleIds.filter((id) =>
      responsibleRules.includes(id)
    );

    const hasDisclosure = selectedResponsible.includes("disclose_ai_use");
    const hasHumanFinal = selectedResponsible.includes("human_final_decision");
    const hasChecking = selectedResponsible.some((id) =>
      ["check_ai_result", "check_ai_data", "check_fairness"].includes(id)
    );

    let score = 0;

    if (selectedResponsible.length >= 1) {
      score = 1;
    }

    if (selectedResponsible.length >= 2) {
      score = 2;
    }

    if (hasDisclosure && hasHumanFinal && hasChecking) {
      score = 3;
    }

    scores.push(
      makeScore({
        worldId: "w4",
        competenceId: "M5",
        domainId: "managing",
        score,
        scoreId: "W4-R5",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        evidence: {
          aiUseRuleIds,
          selectedResponsible,
          hasDisclosure,
          hasHumanFinal,
          hasChecking,
        },
        rationale:
          "Scores whether the student sets responsible use rules including disclosure, checking, fairness, and human final responsibility.",
      })
    );
  }

  return scores;
}