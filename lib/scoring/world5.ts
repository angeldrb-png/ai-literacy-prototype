import { EvidenceBundle, ScoreItem } from "./types";
import { applyTeacherRating, arr, hasAny, makeScore, obj, str } from "./utils";

const CASE_CAUSE_KEY: Record<string, string[]> = {
  recycling_station: [
    "data",
    "similar",
    "rule",
    "training_data_lacks_lighting_variation",
    "training_data_lacks_shape_variation",
    "visual_features_too_similar",
    "rule_boundary_unclear",
    "human_check_needed",
    "data_or_rule_limit",
  ],
  lighting: ["data", "training_data_lacks_lighting_variation"],
  dim_light_bottle: ["data", "training_data_lacks_lighting_variation"],
  crushed: [
  "data",
  "similar",
  "rule",
  "training_data_lacks_shape_variation",
  "visual_features_too_similar",
  "rule_boundary_unclear",
],
  crushed_paper_box: ["data", "training_data_lacks_shape_variation"],
  similar: ["similar", "rule", "visual_features_too_similar", "rule_boundary_unclear"],
  similar_cups: ["similar", "rule", "visual_features_too_similar", "rule_boundary_unclear"],
};

const IMAGE_GOOD_BY_CASE: Record<string, string[]> = {
  recycling_station: [
    "l1",
    "l3",
    "c1",
    "c3",
    "s1",
    "s3",
    "dim",
    "shadow",
    "light",
    "dark",
    "bottle_low_light",
    "bottle_shadow",
    "flat",
    "crushed",
    "box",
    "paper_box_crushed",
    "plastic_cup",
    "paper_cup",
    "cup_pair",
    "similar_cups",
  ],
  lighting: ["l1", "l3", "dim", "shadow", "light", "dark", "bottle_low_light", "bottle_shadow"],
  crushed: ["c1", "c3", "flat", "crushed", "box", "paper_box_crushed"],
  similar: ["s1", "s3", "plastic_cup", "paper_cup", "cup_pair", "similar_cups"],
};

const D2_STRONG_REASON_TAGS = [
  "rule_is_clear_but_inflexible",
  "data_model_needs_representative_examples",
  "data_model_can_generalise_if_training_varied",
  "both_need_human_check",
];

const E4_MEANINGFUL_STAKEHOLDERS = [
  "cleaning_staff",
  "younger_students",
  "students_in_dark_hallway",
  "students_with_similar_items",
  "canteen_users",
];
const E4_VALID_UNFAIR_OUTCOMES = [
  "wrong_bin_guidance",
  "extra_work_for_cleaning_staff",
  "recycling_record_inaccurate",
];
const E4_VALID_CAUSE_LINKS = [
  "training_data_lacks_lighting_variation",
  "training_data_lacks_shape_variation",
  "visual_features_too_similar",
  "rule_boundary_unclear",
  "human_check_needed",
  "data_or_rule_limit",
];

const E4_VALID_MITIGATIONS = [
  "add_diverse_training_images",
  "human_check_uncertain_cases",
  "explain_system_limits",
  "allow_user_correction",
];

function isGoodImageForCase(caseId: string, imageId: string) {
  const ids = IMAGE_GOOD_BY_CASE[caseId] ?? [];
  return ids.some((part) => imageId.includes(part));
}

export function scoreWorld5(evidence: EvidenceBundle): ScoreItem[] {
  const scores: ScoreItem[] = [];
  const step1 = obj(evidence.stepResponses["w5_step1"]);
  const step2 = obj(evidence.stepResponses["w5_step2"]);
  const step3 = obj(evidence.stepResponses["w5_step3"]);
  const step4 = obj(evidence.stepResponses["w5_step4"]); // training data selection in v4.2
  const step5 = obj(evidence.stepResponses["w5_step5"]); // unfair impact map in v4.2
  const step6 = obj(evidence.stepResponses["w5_step6"]); // reminders and resource triage in v4.2
  const step7 = obj(evidence.stepResponses["w5_step7"]); // model card in v4.2
  const submission = evidence.submissionsByWorld["w5"];
    const caseId = str(step1.failureCaseId ?? step1.choice);
const failureCueIds = arr(
  step1.failureCueIds ??
    step1.selectedFailureCueIds
);
const legacyProblemSpotIds = arr(
  step1.identifiedProblemSpotIds ??
    step1.problemSpotIds ??
    step1.selectedProblemSpotIds
);
const cause = str(step2.causeChoiceId ?? step2.choice);
const systemImprovementChoice = str(step2.systemImprovementChoice);
// D1: define the AI system problem and failure point.
if (
  caseId ||
  failureCueIds.length ||
  legacyProblemSpotIds.length ||
  systemImprovementChoice ||
  cause
) {
  const expectedIds = ["handle_special_cases", "handle_special_conditions"];
  const causeExpected = CASE_CAUSE_KEY[caseId] ?? [];
  const causeAligned = causeExpected.includes(cause);
  const improvementAligned = expectedIds.includes(systemImprovementChoice);

  const meaningfulCueIds = failureCueIds.filter((id) =>
    [
      "crushed_shape",
      "paper_material_still_recyclable",
      "confidence_not_final_answer",
      "needs_human_check",
    ].includes(id)
  );

  const distractorCueIds = failureCueIds.filter((id) =>
    ["page_colour_problem", "speed_problem"].includes(id)
  );

  const meaningfulLegacySpotIds = legacyProblemSpotIds.filter((id) =>
    [
      "crushed_paper_box",
      "uncertain_cases_need_human_check",
      "dim_light_bottle",
      "similar_cups",
    ].includes(id)
  );

  const hasOnlyDistractors =
    failureCueIds.length > 0 &&
    meaningfulCueIds.length === 0 &&
    distractorCueIds.length === failureCueIds.length;

  let score = 0;

  if (
    caseId ||
    meaningfulCueIds.length >= 1 ||
    meaningfulLegacySpotIds.length >= 1
  ) {
    score = 1;
  }

  if (
    improvementAligned &&
    (meaningfulCueIds.length >= 2 ||
      meaningfulLegacySpotIds.length >= 1 ||
      causeAligned)
  ) {
    score = 2;
  }

  if (improvementAligned && causeAligned && meaningfulCueIds.length >= 3) {
    score = 3;
  }

  if (hasOnlyDistractors || systemImprovementChoice === "remove_human_check") {
    score = 0;
  }

  scores.push(
    makeScore({
      worldId: "w5",
      competenceId: "D1",
      domainId: "designing",
      score,
      scoreId: "W5-R1",
      scoringSource: "auto_keyed",
      evidenceStrength: "strong",
      coverageLevel: "primary",
      evidence: {
        caseId,
        failureCueIds,
        meaningfulCueIds,
        distractorCueIds,
        legacyProblemSpotIds,
        meaningfulLegacySpotIds,
        cause,
        systemImprovementChoice,
        expectedIds,
        causeAligned,
        improvementAligned,
        hasOnlyDistractors,
      },
      rationale:
        "Scores whether the student identifies meaningful clues in the crushed-paper-box misclassification case and links them to a useful system improvement, rather than focusing on appearance or speed.",
    })
  );
}
  // D2: choose a suitable next-step strategy for similar image-classification errors.
const systemComparisonChoiceByCase = obj(
  step3.systemComparisonChoiceByCase ??
    step2.systemComparisonChoiceByCase ??
    step4.systemComparisonChoiceByCase
);

const systemComparisonReasonTags = arr(
  step3.systemComparisonReasonTags ??
    step2.systemComparisonReasonTags ??
    step4.systemComparisonReasonTags
);

if (Object.keys(systemComparisonChoiceByCase).length || systemComparisonReasonTags.length) {
  const strategy = str(
    systemComparisonChoiceByCase.crushed_paper_box ??
      systemComparisonChoiceByCase.crushed ??
      Object.values(systemComparisonChoiceByCase)[0]
  );

  let score = 0;
  if (strategy === "speed_only") score = 0;
  else if (strategy === "rulebot") score = 1;
  else if (strategy === "both_need_human_check") score = 2;
  else if (strategy === "databot") score = 3;

  const weakOrWrong = systemComparisonReasonTags.some((id) =>
    ["faster_is_better", "newer_is_better", "looks_smarter"].includes(id)
  );

  if (weakOrWrong && score > 1) score = Math.max(1, score - 1);

  scores.push(
    makeScore({
      worldId: "w5",
      competenceId: "D2",
      domainId: "designing",
      score,
      scoreId: "W5-R2A",
      scoringSource: "auto_keyed",
      evidenceStrength: "strong",
      coverageLevel: "primary",
      evidence: {
        strategy,
        systemComparisonChoiceByCase,
        systemComparisonReasonTags,
        weakOrWrong,
      },
      rationale:
        "Scores whether the student chooses a suitable next-step strategy for recurring image-classification errors. Adding more representative examples is the strongest response for the crushed-box case; human checking is responsible but does not directly improve the model.",
    })
  );
}
  // D3: data representation.
const selectedTrainingImageItems = Array.isArray(step4.selectedTrainingImageItems)
  ? step4.selectedTrainingImageItems
  : [];

const selectedImages = arr(
  step4.selectedTrainingImageIds ??
    step4.selectedTrainingImages ??
    step3.selectedTrainingImageIds ??
    step3.selectedTrainingImages
);

if (selectedImages.length || selectedTrainingImageItems.length) {
  const useful = selectedTrainingImageItems.length
    ? selectedTrainingImageItems
        .filter((item: any) => item?.good === true)
        .map((item: any) => String(item.id))
    : selectedImages.filter((id) => isGoodImageForCase(caseId, id));

  const bad = selectedTrainingImageItems.length
    ? selectedTrainingImageItems
        .filter((item: any) => item?.good === false)
        .map((item: any) => String(item.id))
    : selectedImages.filter((id) => !isGoodImageForCase(caseId, id));

  let score = 0;
  if (useful.length === 1) score = bad.length ? 1 : 2;
  if (useful.length >= 2) score = bad.length ? 2 : 3;

  scores.push(
    makeScore({
      worldId: "w5",
      competenceId: "D3",
      domainId: "designing",
      score,
      scoreId: "W5-R3",
      scoringSource: "auto_keyed",
      evidenceStrength: "strong",
      coverageLevel: "primary",
      evidence: {
        caseId,
        selectedImages,
        selectedTrainingImageItems,
        useful,
        bad,
      },
      rationale:
        "Scores whether selected training images improve representation for the chosen failure case. The current version uses the saved good/distractor flag from the student-side image pool.",
    })
  );
}

    const reminders = arr(
    step6.selectedReminderIds ??
      step6.selectedReminders ??
      step4.selectedReminderIds ??
      step4.selectedReminders
  );

  const cardHumanCheckText = str(
    step7.humanCheck ??
      step7.humanChecking ??
      step6.humanCheck ??
      step6.humanChecking ??
      submission?.selfCheckJson?.humanCheck
  );

  const cardReminderText = str(
    step7.reminder ??
      step6.reminder ??
      submission?.selfCheckJson?.reminder
  );

  const responsible = [
    "ai_may_be_wrong",
    "check_uncertain_cases",
    "ask_human_when_unsure",
    "do_not_treat_ai_as_final_authority",
  ];

  const selectedResponsible = reminders.filter((id) =>
    responsible.includes(id) ||
    /错|錯|wrong|检查|檢查|自己看|照着做|照著做|理由|human|check|uncertain/i.test(id)
  );

  const hasHumanCheckText = /人|human|check|检查|檢查|uncertain|不确定|不確定/i.test(
    cardHumanCheckText
  );

  const hasLimitReminderText = /错|錯|wrong|限制|limit|not always|不一定|不能直接/i.test(
    `${cardReminderText} ${cardHumanCheckText}`
  );

  if (reminders.length || hasHumanCheckText || hasLimitReminderText) {
    let score = 1;

    const signalCount =
      selectedResponsible.length +
      (hasHumanCheckText ? 1 : 0) +
      (hasLimitReminderText ? 1 : 0);

    if (signalCount >= 1) score = 2;
    if (signalCount >= 2) score = 3;

    scores.push(
      makeScore({
        worldId: "w5",
        competenceId: "D4",
        domainId: "designing",
        score,
        scoreId: "W5-R4A",
        scoringSource: "auto_keyed",
        evidenceStrength: reminders.length ? "strong" : "moderate",
        linkedCompetences: ["D4", "E6"],
        evidence: {
          reminders,
          selectedResponsible,
          cardHumanCheckText,
          cardReminderText,
          hasHumanCheckText,
          hasLimitReminderText,
        },
        rationale:
          "Scores responsible evaluation and use guidance through reminder choices or model-card text about uncertainty, human checking, and AI limits.",
      })
    );

    scores.push(
      makeScore({
        worldId: "w5",
        competenceId: "E6",
        domainId: "engaging",
        score: Math.min(score, 3),
        scoreId: "W5-R4B",
        scoringSource: "auto_keyed",
        evidenceStrength: reminders.length ? "moderate" : "limited",
        linkedCompetences: ["D4", "E6"],
        includeInCompetenceProfile: false,
        evidence: {
          reminders,
          selectedResponsible,
          cardHumanCheckText,
          cardReminderText,
          hasHumanCheckText,
          hasLimitReminderText,
        },
        rationale:
          "Supporting W5 evidence for values-and-ethics awareness. It is excluded from the individual E6 profile because E6 is handled by the cross-world composite.",
      })
    );
  }

  // E5: AI resource and energy awareness through resource-use triage.
  const resourceTriageAllocation = obj(step6.resourceTriageAllocation ?? step5.resourceTriageAllocation ?? step4.resourceTriageAllocation);
  const resourceReasonTags = arr(step6.resourceReasonTags ?? step5.resourceReasonTags ?? step4.resourceReasonTags);
  const resourceChoice = str(step6.aiResourceUseChoice ?? step4.aiResourceUseChoice ?? step5.aiResourceUseChoice);
  const resourceSelected =
    reminders.includes("use_ai_when_helpful_because_ai_uses_computing_resources") ||
    reminders.some((id) => /资源|資源|能源|energy|computing/.test(id)) ||
    resourceReasonTags.includes("ai_uses_energy_resources") ||
    hasAny(`${str(step7.limits)} ${str(step7.reminder)} ${str(step6.reminder)} ${str(submission?.content)}`, [/资源|資源|能源|energy|computing/i]);

  const triageExpected: Record<string, string[]> = {
    analyse_many_photos: ["worth_using_ai", "ai_assist_human_check"],
    clear_bottle_with_sign: ["simple_method_first"],
    auto_penalty: ["ai_assist_human_check"],
  };
  const triageEntries = Object.entries(resourceTriageAllocation);
  const correctTriageIds = Object.entries(triageExpected)
    .filter(([taskId, expected]) => expected.includes(String(resourceTriageAllocation[taskId] ?? "")))
    .map(([taskId]) => taskId);
  const riskyResourceChoice = ["ai_no_resource", "always_use_ai", "any_task_use_ai"].includes(resourceChoice);

  if (triageEntries.length || resourceChoice || resourceSelected) {
    let score = 0;

        if (triageEntries.length) {
      const hasComplexUse =
        resourceTriageAllocation.analyse_many_photos === "worth_using_ai" ||
        resourceTriageAllocation.analyse_many_photos === "ai_assist_human_check";

      const hasSimpleNoAi =
        resourceTriageAllocation.clear_bottle_with_sign === "simple_method_first";

      const hasHighImpactHumanCheck =
        resourceTriageAllocation.auto_penalty === "ai_assist_human_check";

      if (correctTriageIds.length >= 1) score = 1;

      if (correctTriageIds.length >= 2) {
        score = 2;
      }

      if (
        correctTriageIds.length >= 3 &&
        hasComplexUse &&
        hasSimpleNoAi &&
        hasHighImpactHumanCheck
      ) {
        score = 3;
      }

      if (
        score === 3 &&
        resourceReasonTags.length === 0 &&
        !resourceSelected
      ) {
        // Strong structured evidence from the triage board, but no explicit
        // explanation about computing resources/energy.
        // Keep the score because E5 primary evidence is the triage judgement;
        // evidenceStrength below will still show whether explicit resource
        // reasoning was present.
        score = 3;
      }
    }
    else {
      // Legacy fallback for sessions collected before v4.2.
      score = 1;
      if (resourceChoice === "not_sure") score = 1;
      else if (resourceSelected) score = 2;
      if (resourceChoice === "simple_task_no_ai_resource" || resourceChoice === "use_ai_only_when_helpful") score = 2;
    }

    if (riskyResourceChoice) score = 0;

    scores.push(
      makeScore({
        worldId: "w5",
        competenceId: "E5",
        domainId: "engaging",
        score,
        scoreId: triageEntries.length ? "W5-E5-RESOURCE-TRIAGE" : "W5-R5-legacy",
        scoringSource: "auto_keyed",
        evidenceStrength:
  triageEntries.length && correctTriageIds.length >= 3
    ? "strong"
    : triageEntries.length
    ? "moderate"
    : score >= 2
    ? "moderate"
    : "limited",
        coverageLevel: triageEntries.length ? "primary" : "mixed",
        evidence: {
          reminders,
          resourceChoice,
          resourceSelected,
          resourceTriageAllocation,
          resourceReasonTags,
          correctTriageIds,
          riskyResourceChoice,
        },
        rationale:
          "Scores whether the student weighs AI's computing-resource/energy cost against task complexity and impact: simple tasks may not need AI, large-scale tasks may justify AI, and high-impact uses need human checking.",
      })
    );
  }

  // E4: unfair impact map: stakeholders + unfair outcome/cause + mitigation.
  const affected = arr(step5.affectedStakeholders ?? step4.affectedStakeholders);
  const unfairOutcomeIds = arr(step5.unfairOutcomeIds ?? step4.unfairOutcomeIds);
  const biasCauseLinkIds = arr(step5.biasCauseLinkIds ?? step4.biasCauseLinkIds);
  const biasMitigationIds = arr(step5.biasMitigationIds ?? step4.biasMitigationIds);
  if (affected.length || unfairOutcomeIds.length || biasCauseLinkIds.length || biasMitigationIds.length) {
    const meaningfulStakeholders = affected.filter((id) => E4_MEANINGFUL_STAKEHOLDERS.includes(id));
    const validCauses = biasCauseLinkIds.filter((id) => E4_VALID_CAUSE_LINKS.includes(id));
    const validUnfairOutcomes = unfairOutcomeIds.filter((id) =>
  E4_VALID_UNFAIR_OUTCOMES.includes(id)
);
    const validMitigations = biasMitigationIds.filter((id) => E4_VALID_MITIGATIONS.includes(id));
    const saysNoOne = affected.includes("no_one");

    let score = 0;
    if (saysNoOne && meaningfulStakeholders.length === 0) score = 0;
    else if (meaningfulStakeholders.length >= 1) score = 1;
    if (meaningfulStakeholders.length >= 1 && validUnfairOutcomes.length >= 1 && validCauses.length >= 1) {
      score = 2;
    }
    if (
      meaningfulStakeholders.length >= 1 &&
      validUnfairOutcomes.length >= 1 &&
      validCauses.length >= 1 &&
      validMitigations.length >= 1
    ) {
      score = 3;
    }
    scores.push(
      makeScore({
        worldId: "w5",
        competenceId: "E4",
        domainId: "engaging",
        score,
        scoreId: "W5-R2B",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        coverageLevel: "primary",
        evidence: {
  affected,
  meaningfulStakeholders,
  unfairOutcomeIds,
  validUnfairOutcomes,
  biasCauseLinkIds,
  validCauses,
  biasMitigationIds,
  validMitigations,
  saysNoOne,
},
        rationale:
          "Scores E4 as an unfair-impact judgement: the student links who may be affected, what unfair result may occur, the data/rule/design cause, and a mitigation strategy.",
      })
    );
  }

  // E7: connecting AI technical limitations with possible real-world impact.
  const impactCause = str(step5.impactCauseLinkChoice ?? step6.impactCauseLinkChoice ?? step4.impactCauseLinkChoice);
  if (affected.length || impactCause) {
    const meaningful = affected.filter((id) => id !== "no_one");
    const technicalLinks = ["training_data_not_diverse", "visual_features_too_similar", "human_check_needed", "data_or_rule_limit"];
    const hasTechnicalLink =
      technicalLinks.includes(impactCause) ||
      ["data", "similar", "rule", "training_data_lacks_lighting_variation", "training_data_lacks_shape_variation"].includes(cause) ||
      biasCauseLinkIds.some((id) => E4_VALID_CAUSE_LINKS.includes(id));
    let score = 0;
    if (affected.includes("no_one") && !meaningful.length) score = 0;
    else if (meaningful.length) score = 2;
    if (meaningful.length && hasTechnicalLink) score = 3;
    if (!meaningful.length && hasTechnicalLink) score = 1;

    scores.push(
      makeScore({
        worldId: "w5",
        competenceId: "E7",
        domainId: "engaging",
        score,
        scoreId: "W5-R7",
        scoringSource: "auto_keyed",
        evidenceStrength: score >= 3 ? "strong" : "moderate",
        coverageLevel: "primary",
        evidence: { affectedStakeholders: affected, meaningful, impactCause, hasTechnicalLink, cause, biasCauseLinkIds },
        rationale:
          "Scores whether the student connects technical AI limitations or errors with possible effects on people or school practices.",
      })
    );
  }

  // D5: model-card-like system communication.
  const purpose = str(step7.purpose ?? step5.purpose);
  const intendedUsers = str(step7.intendedUsers ?? step7.users ?? step7.user ?? step5.intendedUsers ?? step5.users ?? step5.user);
  const trainingData = str(step7.trainingData ?? step7.data ?? step5.trainingData ?? step5.data);
  const limits = str(step7.limits ?? step5.limits);
  const reminder = str(step7.reminder ?? step6.reminder ?? step5.reminder);
  const improve = str(step7.improve ?? step5.improve);
  const humanCheck = str(step7.humanCheck ?? step7.humanChecking ?? step5.humanCheck ?? step5.humanChecking);
  const content = str(submission?.content);
  const fieldsPresent = [purpose, intendedUsers, trainingData, limits, reminder || humanCheck, improve].filter((x) => x.trim().length > 0).length;
    const submissionJson = obj(submission?.selfCheckJson);

  const cardDraftAutoFilled = Boolean(
    step7.cardDraftAutoFilled ?? submissionJson.cardDraftAutoFilled
  );

  const cardEditedFields = arr(
    step7.cardEditedFields ?? submissionJson.cardEditedFields
  );

  const cardEditedFieldCount = Number(
    step7.cardEditedFieldCount ??
      submissionJson.cardEditedFieldCount ??
      cardEditedFields.length
  );

  const priorEvidenceCount = [
    selectedImages.length > 0,
    Object.keys(systemComparisonChoiceByCase).length > 0,
    affected.length > 0,
    biasMitigationIds.length > 0,
    Object.keys(resourceTriageAllocation).length > 0,
  ].filter(Boolean).length;
  if (fieldsPresent || content) {
        let baseScore = 0;

    const supportingFields = [
      intendedUsers,
      trainingData,
      limits,
      reminder || humanCheck,
      improve,
    ].filter((x) => x.trim()).length;

    if (purpose.trim()) baseScore = 1;

    if (purpose.trim() && supportingFields >= 2) {
      baseScore = 2;
    }

    if (
      fieldsPresent >= 5 &&
      priorEvidenceCount >= 2 &&
      (cardEditedFieldCount >= 2 || !cardDraftAutoFilled)
    ) {
      baseScore = 3;
    }

    if (cardDraftAutoFilled && cardEditedFieldCount === 0) {
      baseScore = Math.min(baseScore, 2);
    }
    const reviewed = applyTeacherRating(baseScore, evidence, "w5_model_card_lite", "D5");

    scores.push(
      makeScore({
        worldId: "w5",
        competenceId: "D5",
        domainId: "designing",
        score: reviewed.score,
        scoreId: "W5-R6",
        scoringSource: "teacher_light",
        evidenceStrength: "mixed",
        reviewStatus: reviewed.reviewStatus,
        evidence: {
        fieldsPresent,
supportingFields,
priorEvidenceCount,
cardDraftAutoFilled,
cardEditedFields,
cardEditedFieldCount,
teacherRating: reviewed.teacherRating,
purposePreview: purpose.slice(0, 140),
intendedUsersPreview: intendedUsers.slice(0, 140),
trainingDataPreview: trainingData.slice(0, 140),
limitsPreview: limits.slice(0, 140),
humanCheckPreview: humanCheck.slice(0, 140),
reminderPreview: reminder.slice(0, 140),
improvePreview: improve.slice(0, 140),
        },
      rationale:
  "Scores whether the reminder-card output communicates the AI sorting system's purpose, intended users, needed examples, limitations, human checking/reminders, and improvement plans.",  
      })
    );
  }

  return scores;
}
