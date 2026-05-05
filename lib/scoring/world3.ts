import { EvidenceBundle, ScoreItem } from "./types";
import {
  applyTeacherRating,
  arr,
  hasAny,
  jaccardSimilarity,
  makeScore,
  obj,
  str,
  textHasSubstance,
} from "./utils";

const C2_MEANINGFUL_REASONS = [
  "fits_recipient",
  "shows_care_better",
  "clearer_message",
  "helps_visualise_idea",
  "combines_text_and_visual",
  "keeps_important_sentence",
];

const C2_STRONG_ELEMENTS = [
  "own_sentence",
  "ai_warm_title",
  "ai_layout",
  "ai_image",
  "recipient_icon",
  "short_caption",
];

const SAFE_ASSETS = [
  "own_sentence",
  "ai_background_image",
  "ai_generated_background",
  "free_source_icon",
  "free_icon",
  "ai_person_image",
  "school_owned_material",
  "simple_shape_or_emoji",
];

const UNSAFE_ASSETS = [
  "web_cartoon_unknown_source",
  "classmate_photo_without_permission",
  "realistic_elder_photo",
  "celebrity_image",
];

const DISCLOSURE_OK = [
  "state_ai_assisted",
  "state_ai_generated_visual",
  "credit_free_icon",
  "ask_permission_and_credit",
  "not_needed_all_own_or_ai",
];

const C5_ACCURATE_IDS = [
  "prompt_pattern_generation",
  "human_like_not_understanding",
  "student_judgement_needed",
];

const C5_INACCURATE_IDS = [
  "warm_text_means_care",
  "ai_knows_my_intent_better",
];

function sortRecord(value: any): Record<string, string> {
  return obj(value) as Record<string, string>;
}

function countMechanismCorrect(sort: Record<string, string>) {
  let correct = 0;
  for (const id of C5_ACCURATE_IDS) {
    if (sort[id] === "accurate") correct += 1;
  }
  for (const id of C5_INACCURATE_IDS) {
    if (sort[id] === "inaccurate") correct += 1;
  }
  return correct;
}

export function scoreWorld3(evidence: EvidenceBundle): ScoreItem[] {
  const scores: ScoreItem[] = [];
  const step2 = obj(evidence.stepResponses["w3_step2"]);
  const step3 = obj(evidence.stepResponses["w3_step3"]);
  const step4 = obj(evidence.stepResponses["w3_step4"]); // C2 multimodal composition
  const step5 = obj(evidence.stepResponses["w3_step5"]); // C4 asset/source/authorship check
  const step6 = obj(evidence.stepResponses["w3_step6"]); // C5 mechanism puzzle
  const step7 = obj(evidence.stepResponses["w3_step7"]); // final card + AI collaboration review
  const submission = evidence.submissionsByWorld["w3"];
  const submissionJson = obj(submission?.selfCheckJson);
  const chat = evidence.chatTurns.filter((t) => t.worldId === "w3");
  const lastAi = [...chat].reverse().find((t) => t.role === "ai")?.content ?? "";

  const firstDraft = str(step2.firstDraftText ?? step2.draft);
  if (firstDraft.trim()) {
    const hasSubstance = textHasSubstance(firstDraft, 12);
    const hasRecipientSpecific = hasAny(firstDraft, [
      /你/,
      /您/,
      /同学|同學|长者|長者|新同学|新同學|学弟妹|學弟妹/,
      /pressure|new student|elder|classmate/i,
    ]);
    const hasPersonalVoice = hasAny(firstDraft, [/我想|我希望|我覺得|我觉得|有时候|有時候|example|例子|感受/]);

    let score = 0;
    if (hasSubstance) score = 1;
    if (hasSubstance && (hasRecipientSpecific || hasPersonalVoice)) score = 2;
    if (hasSubstance && hasRecipientSpecific && hasPersonalVoice) score = 3;

    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "C4",
        domainId: "creating",
        score,
        scoreId: "W3-R1",
        scoringSource: "auto_indicator",
        evidenceStrength: "moderate",
        coverageLevel: "supporting",
        includeInCompetenceProfile: false,
        reviewStatus: "not_needed",
        evidence: { hasSubstance, hasRecipientSpecific, hasPersonalVoice, contentPreview: firstDraft.slice(0, 200) },
        rationale:
          "Supporting evidence for personal authorship: the student creates an original starting point before AI revision. It is not used as the primary C4 score because C4 now focuses on authenticity, source, attribution, and ownership.",
      })
    );
  }

  const ideaSupportTags = arr(step3.ideaSupportTags);
  if (ideaSupportTags.length) {
    const strongTags = ideaSupportTags.filter((id) =>
      ["gave_new_expression_way", "helped_think_from_recipient_view"].includes(id)
    );
    const weakOnly =
      ideaSupportTags.includes("replaced_my_idea") ||
      ideaSupportTags.includes("only_made_sentence_longer");

    let score = 1;
    if (weakOnly && strongTags.length === 0) score = 1;
    if (strongTags.length >= 1) score = 2;
    if (strongTags.length >= 2) score = 3;

    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "C1",
        domainId: "creating",
        score,
        scoreId: "W3-R1A",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        coverageLevel: "primary",
        evidence: { ideaSupportTags, strongTags },
        rationale:
          "Scores whether the student identifies how AI expanded expression, such as offering a new way to express care or helping them think from the recipient's perspective.",
      })
    );
  }

  // C2: visualise/prototype/combine ideas using simulated multimodal AI outputs.
  const selectedFormatId = str(step4.selectedFormatId ?? step4.presentationFormat ?? submissionJson.selectedFormatId ?? submissionJson.presentationFormat);
  const comparedFormatIds = arr(step4.comparedFormatIds ?? step4.w3ComparedFormatIds ?? submissionJson.comparedFormatIds);
  const selectedDesignElementIds = arr(step4.selectedDesignElementIds ?? step4.w3SelectedDesignElementIds ?? submissionJson.selectedDesignElementIds);
  const rejectedElementIds = arr(step4.rejectedElementIds ?? step4.w3RejectedElementIds ?? submissionJson.rejectedElementIds);
  const formatReasonTags = arr(step4.formatReasonTags ?? step4.presentationReasonTags ?? submissionJson.formatReasonTags ?? submissionJson.presentationReasonTags);
  const meaningfulReasons = formatReasonTags.filter((id) => C2_MEANINGFUL_REASONS.includes(id));
  const strongElements = selectedDesignElementIds.filter((id) => C2_STRONG_ELEMENTS.includes(id));

  if (selectedFormatId || comparedFormatIds.length || selectedDesignElementIds.length || formatReasonTags.length) {
    let score = 0;
    if (selectedFormatId) score = 1;
    if (selectedFormatId && meaningfulReasons.length >= 1) score = 2;
    if (
      selectedFormatId &&
      comparedFormatIds.length >= 2 &&
      strongElements.length >= 2 &&
      meaningfulReasons.length >= 1
    ) {
      score = 3;
    }

    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "C2",
        domainId: "creating",
        score,
        scoreId: "W3-R1B",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        coverageLevel: "primary",
        evidence: {
          selectedFormatId,
          comparedFormatIds,
          selectedDesignElementIds,
          rejectedElementIds,
          formatReasonTags,
          meaningfulReasons,
          strongElements,
        },
        rationale:
          "Scores whether the student compares simulated AI-generated formats and combines visual/textual elements that fit the recipient and purpose, aligning with C2's focus on visualising, prototyping, and combining ideas with AI.",
      })
    );
  }

  const promptText = str(step3.promptText);
  const promptTagIds = arr(step3.promptTagIds ?? step3.promptTags);
  if (promptText.trim() || promptTagIds.length || chat.some((t) => t.role === "student")) {
    const humanAgencyTags = ["keep_voice", "keep_example"];
    const audienceStyleTags = ["warmer", "fit_recipient", "less_formal"];
    const hasHumanAgency =
      promptTagIds.some((t) => humanAgencyTags.includes(t)) ||
      /keep|保留|不要删|不要刪|example|例子|my tone|我的语气|我的語氣/.test(promptText);
    const hasAudienceStyle =
      promptTagIds.some((t) => audienceStyleTags.includes(t)) ||
      /warm|温暖|溫暖|formal|正式|recipient|对象|對象/.test(promptText);
    let score = 1;
    if (hasHumanAgency || hasAudienceStyle) score = 2;
    if (hasHumanAgency && hasAudienceStyle) score = 3;

    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "M3",
        domainId: "managing",
        score,
        scoreId: "W3-R2",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        evidence: { promptTagIds, hasHumanAgency, hasAudienceStyle, promptPreview: promptText.slice(0, 200) },
        rationale:
          "Scores whether the student directs AI with specific constraints. The high score requires both human-agency and audience/tone/style constraints.",
      })
    );
  }

  const strategy = str(step3.aiSuggestionUseStrategy);
  if (strategy) {
    const limitationTags = arr(step7.aiLimitationTagIds ?? step7.limitationTags ?? step5.aiLimitationTagIds ?? step5.limitationTags);
    const specificLimitations = limitationTags.filter((t) => t !== "no_obvious_problem");
    let score = 0;
    if (strategy === "use_most") score = 1;
    if (["use_part_and_revise", "use_idea_not_wording", "reject_and_write_myself"].includes(strategy)) score = 2;
    if (score >= 2 && specificLimitations.length) score = 3;

    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "C3",
        domainId: "creating",
        score,
        scoreId: "W3-R3",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        linkedCompetences: ["C3", "E2"],
        evidence: { strategy, limitationTags },
        rationale:
          "Scores how the student accepts, revises, or rejects AI suggestions. This is stronger evidence than chat-turn count.",
      })
    );
  }

  const finalText = str(step7.finalText ?? step4.finalText ?? submission?.content);
  if (finalText.trim()) {
    const aiCopyRatio = jaccardSimilarity(finalText, lastAi);
    const draftRetainRatio = jaccardSimilarity(finalText, firstDraft);
    const checklist = arr(obj(step7.selfCheckJson).checklist ?? obj(step4.selfCheckJson).checklist ?? submissionJson.checklist);
    let baseScore = 1;
    if (aiCopyRatio > 0.85 && finalText.length > 20) baseScore = 1;
    else if (draftRetainRatio > 0.12 || aiCopyRatio < 0.7) baseScore = 2;

    const reviewed = applyTeacherRating(baseScore, evidence, "w3_warm_card", "C4");

    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "C4",
        domainId: "creating",
        score: reviewed.score,
        scoreId: "W3-R4A",
        scoringSource: "teacher_light",
        evidenceStrength: "mixed",
        coverageLevel: "supporting",
        includeInCompetenceProfile: false,
        reviewStatus: reviewed.reviewStatus,
        evidence: {
          aiCopyRatio,
          draftRetainRatio,
          checklist,
          copyWarning: aiCopyRatio > 0.85,
          teacherRating: reviewed.teacherRating,
          finalPreview: finalText.slice(0, 240),
        },
        rationale:
          "Teacher-light final card review remains as supporting evidence for authorship, but the primary C4 score is now based on source, attribution, permission, and disclosure choices.",
      })
    );
  }

  // C4 primary: authenticity, source/permission, attribution, AI-use disclosure.
  const selectedAssetIds = arr(step5.selectedAssetIds ?? step5.w3SelectedAssetIds ?? step4.selectedAssetIds ?? submissionJson.selectedAssetIds);
  const disclosureChoiceId = str(step5.disclosureChoiceId ?? step5.w3DisclosureChoiceId ?? step4.disclosureChoiceId ?? submissionJson.disclosureChoiceId);
  const attributionChoiceId = str(step5.attributionChoiceId ?? step5.w3AttributionChoiceId ?? step4.attributionChoiceId ?? submissionJson.attributionChoiceId);
  const keptOwnSentence = Boolean(step5.keptOwnSentence ?? step5.w3KeptOwnSentence ?? step4.keptOwnSentence ?? submissionJson.keptOwnSentence);
  if (selectedAssetIds.length || disclosureChoiceId || attributionChoiceId || keptOwnSentence) {
    const unsafeSelected = selectedAssetIds.filter((id) => UNSAFE_ASSETS.includes(id));
    const safeSelected = selectedAssetIds.filter((id) => SAFE_ASSETS.includes(id));
    const hasDisclosure = DISCLOSURE_OK.includes(disclosureChoiceId);
    const hasAttribution = DISCLOSURE_OK.includes(attributionChoiceId) || ["not_needed_all_own_or_ai", "credit_free_icon"].includes(attributionChoiceId);

    let score = 0;

if (unsafeSelected.length > 0) {
  // If unsafe assets are selected, the score should stay low.
  // Disclosure/attribution may show some awareness, but does not make unsafe assets fully acceptable.
  score = hasDisclosure || hasAttribution ? 1 : 0;
} else if (safeSelected.length > 0) {
  score = 1;

  if (hasDisclosure || hasAttribution) {
    score = 2;
  }

  if (keptOwnSentence && hasDisclosure && hasAttribution) {
    score = 3;
  }
}
    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "C4",
        domainId: "creating",
        score,
        scoreId: "W3-R4B",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        coverageLevel: "primary",
        evidence: { selectedAssetIds, unsafeSelected, safeSelected, disclosureChoiceId, attributionChoiceId, keptOwnSentence, hasDisclosure, hasAttribution },
        rationale:
          "Scores C4 as an authenticity/IP/source judgement: students keep their own contribution, avoid unsafe assets, and disclose AI assistance or source attribution where needed.",
      })
    );
  }

  const helpfulTags = arr(step7.aiHelpfulTagIds ?? step7.helpfulTags ?? step5.aiHelpfulTagIds ?? step5.helpfulTags);
  const limitationTags = arr(step7.aiLimitationTagIds ?? step7.limitationTags ?? step5.aiLimitationTagIds ?? step5.limitationTags);
  if (helpfulTags.length || limitationTags.length) {
    const genericHelpful = ["not_much_help"];
    const genericLimit = ["no_obvious_problem"];
    const specificHelpful = helpfulTags.filter((t) => !genericHelpful.includes(t));
    const specificLimit = limitationTags.filter((t) => !genericLimit.includes(t));
    let score = 0;
    if (helpfulTags.length || limitationTags.length) score = 1;
    if (specificHelpful.length || specificLimit.length) score = 2;
    if (specificHelpful.length && specificLimit.length) score = 3;

    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "E6",
        domainId: "engaging",
        score,
        scoreId: "W3-R5",
        scoringSource: "auto_keyed",
        evidenceStrength: score >= 3 ? "strong" : "moderate",
        linkedCompetences: ["E6", "C3"],
        evidence: { helpfulTags, limitationTags, specificHelpful, specificLimit, usabilityFeedbackScored: false },
        rationale:
          "Scores whether the student can identify both AI support and AI limitations. Product feedback is stored but not scored.",
      })
    );
  }

  // C5 primary: accurate explanation of AI generation without anthropomorphism.
  const mechanismSort = sortRecord(step6.mechanismSort ?? step6.w3MechanismSort ?? step4.mechanismSort ?? submissionJson.mechanismSort);
  const mechanismCorrectCount = Number(step6.mechanismCorrectCount ?? step6.w3MechanismCorrectCount ?? step4.mechanismCorrectCount ?? submissionJson.mechanismCorrectCount ?? countMechanismCorrect(mechanismSort));
  const anthropomorphicMistakeIds = C5_INACCURATE_IDS.filter((id) => mechanismSort[id] === "accurate");
  if (Object.keys(mechanismSort).length || mechanismCorrectCount > 0) {
    const hasPromptPatternExplanation =
  mechanismSort.prompt_pattern_generation === "accurate";

const hasNonAnthropomorphicUnderstanding =
  mechanismSort.human_like_not_understanding === "accurate";

const hasStudentJudgement =
  mechanismSort.student_judgement_needed === "accurate";

const rejectsAnthropomorphism = anthropomorphicMistakeIds.length === 0;

let score = 0;

if (mechanismCorrectCount >= 2) {
  score = 1;
}

if (
  mechanismCorrectCount >= 3 &&
  hasPromptPatternExplanation &&
  (hasNonAnthropomorphicUnderstanding || hasStudentJudgement)
) {
  score = 2;
}

if (
  mechanismCorrectCount >= 4 &&
  hasPromptPatternExplanation &&
  hasNonAnthropomorphicUnderstanding &&
  rejectsAnthropomorphism
) {
  score = 3;
}
    scores.push(
      makeScore({
        worldId: "w3",
        competenceId: "C5",
        domainId: "creating",
        score,
        scoreId: "W3-R6",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        coverageLevel: "primary",
        evidence: {
  mechanismSort,
  mechanismCorrectCount,
  anthropomorphicMistakeIds,
  hasPromptPatternExplanation,
  hasNonAnthropomorphicUnderstanding,
  hasStudentJudgement,
  rejectsAnthropomorphism,
},
        rationale:
          "Scores whether the student explains AI generation as prompt/data-pattern based and rejects anthropomorphic claims that AI truly understands, cares, or intends.",
      })
    );
  } else {
    const checklist = arr(obj(step7.selfCheckJson).checklist ?? obj(step4.selfCheckJson).checklist ?? submissionJson.checklist);
    const knowsGeneration = checklist.some((x) => /prompt|提示|生成|不是自己/.test(x));
    if (knowsGeneration) {
      scores.push(
        makeScore({
          worldId: "w3",
          competenceId: "C5",
          domainId: "creating",
          score: 1,
          scoreId: "W3-R6-legacy",
          scoringSource: "auto_indicator",
          evidenceStrength: "limited",
          coverageLevel: "limited",
          evidence: { checklist },
          rationale:
            "Legacy limited evidence only: the student recognizes AI output is prompt-generated, but no mechanism sorting evidence was captured.",
        })
      );
    }
  }

  return scores;
}
