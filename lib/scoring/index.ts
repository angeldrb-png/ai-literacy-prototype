import { prisma } from "@/lib/prisma";
import { EvidenceBundle, ScoreItem, TeacherRating } from "./types";
import { makeScore, obj, arr } from "./utils";
import { scoreWorld1 } from "./world1";
import { scoreWorld2 } from "./world2";
import { scoreWorld3 } from "./world3";
import { scoreWorld4 } from "./world4";
import { scoreWorld5 } from "./world5";

function parseTeacherRating(note: any): TeacherRating | null {
  const raw = note?.noteText;
  if (typeof raw !== "string") return null;

  try {
    const json = JSON.parse(raw);
    if (json?.type !== "teacher_rating") return null;
    if (typeof json.productKey !== "string") return null;
    if (typeof json.worldId !== "string") return null;
    if (!Array.isArray(json.competenceIds)) return null;
    if (typeof json.score !== "number") return null;

    return {
      id: note.id,
      productKey: json.productKey,
      worldId: json.worldId,
      competenceIds: json.competenceIds.filter((x: any) => typeof x === "string"),
      score: Math.max(0, Math.min(3, json.score)),
      comment: typeof json.comment === "string" ? json.comment : "",
      createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : String(note.createdAt ?? ""),
    };
  } catch {
    return null;
  }
}

export async function loadEvidence(sessionId: string): Promise<EvidenceBundle> {
  const [responses, events, submissions, chatTurns, teacherNotes] = await Promise.all([
    prisma.stepResponse.findMany({ where: { sessionId } }),
    prisma.eventLog.findMany({ where: { sessionId } }),
    prisma.submission.findMany({ where: { sessionId } }),
    prisma.aIChatTurn.findMany({ where: { sessionId }, orderBy: [{ turnNo: "asc" }, { createdAt: "asc" }] }),
    prisma.teacherNote.findMany({ where: { sessionId }, orderBy: { createdAt: "desc" } }),
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

  const submissionsByWorld: EvidenceBundle["submissionsByWorld"] = {};
  submissions.forEach((row) => {
    submissionsByWorld[row.worldId] = {
      content: row.content,
      selfCheckJson: row.selfCheckJson ?? null,
      submissionType: row.submissionType,
    };
  });

  const teacherRatings = teacherNotes
    .map(parseTeacherRating)
    .filter((item): item is TeacherRating => Boolean(item));

  return {
    stepResponses,
    eventsByName,
    submissionsByWorld,
    teacherRatings,
    chatTurns: chatTurns.map((t) => ({
      worldId: t.worldId,
      turnNo: t.turnNo,
      role: t.role,
      content: t.content,
    })),
  };
}

function latestIncludedScore(items: ScoreItem[], competenceId: string, worldId?: string) {
  const found = [...items].reverse().find((item) => {
    if (item.competenceId !== competenceId) return false;
    if (worldId && item.worldId !== worldId) return false;
    return item.evidenceJson?.includeInCompetenceProfile !== false;
  });
  return found ?? null;
}

function withProfileFlag(item: ScoreItem, includeInCompetenceProfile: boolean): ScoreItem {
  return {
    ...item,
    evidenceJson: {
      ...item.evidenceJson,
      includeInCompetenceProfile,
    },
  };
}

function buildCompositeScores(rawItems: ScoreItem[], evidence: EvidenceBundle): ScoreItem[] {
  let items = rawItems;

  // M5 is assessed in both W1 (recommendation rules) and W4 (project AI-use rules).
  // Use an explicit composite rather than letting one context hide the other.
  const w1M5 = latestIncludedScore(items, "M5", "w1");
  const w4M5 = latestIncludedScore(items, "M5", "w4");
  const m5Components = [w1M5, w4M5].filter((x): x is ScoreItem => Boolean(x));

  if (m5Components.length > 0) {
    items = items.map((item) =>
      item.competenceId === "M5" ? withProfileFlag(item, false) : item
    );

    const average =
      m5Components.reduce((sum, item) => sum + Number(item.score ?? 0), 0) /
      m5Components.length;

    items.push(
      makeScore({
        worldId: "cross",
        competenceId: "M5",
        domainId: "managing",
        score: average,
        scoreId: "X-M5-RESPONSIBLE-RULES-COMPOSITE",
        scoringSource: "auto_keyed",
        evidenceStrength: m5Components.length >= 2 ? "strong" : "moderate",
        coverageLevel: m5Components.length >= 2 ? "primary" : "mixed",
        evidence: {
          formula: "average(W1_M5, W4_M5)",
          componentCount: m5Components.length,
          components: m5Components.map((item) => ({
            worldId: item.worldId,
            scoreId: item.evidenceJson?.scoreId,
            score: item.score,
          })),
          partialEvidence: m5Components.length < 2,
        },
        rationale:
          "Composite M5 score: responsible AI-use rules are assessed across recommendation-system rules and project-workflow rules. Averaging prevents one strong context from masking weak responsibility judgement in another context.",
      })
    );
  }

    // E6 is a cross-world values-and-ethics judgement. Count contexts rather than adding a new task.
  const w1 = obj(evidence.stepResponses["w1_step3"]);
const w3Presentation = obj(evidence.stepResponses["w3_step4"]);
const w3Authorship = obj(evidence.stepResponses["w3_step5"]);
const w3Submission = obj(evidence.submissionsByWorld["w3"]?.selfCheckJson);
const w4 = obj(evidence.stepResponses["w4_step2"]);
  const w4Rules = obj(evidence.stepResponses["w4_step4"]);
  const w5Use = obj(evidence.stepResponses["w5_step6"]);
  const w5Card = obj(evidence.stepResponses["w5_step7"]);

  const w1Rules = arr(w1.rules).length
    ? arr(w1.rules)
    : Object.entries(obj(w1.rules))
        .filter(([, v]) => v === true)
        .map(([k]) => k);

  const w1Context = w1Rules.some((id) =>
    [
      "explain_reason",
      "explainReason",
      "teacher_review",
      "teacherReview",
      "try_new_things",
      "tryNewThings",
      "say_what_data_used",
      "sayWhatDataUsed",
    ].includes(id)
  );

  const selectedAssetIds = arr(
  w3Authorship.selectedAssetIds ??
    w3Authorship.w3SelectedAssetIds ??
    w3Presentation.selectedAssetIds ??
    w3Submission.selectedAssetIds
);

const unsafeAssets = [
  "web_cartoon_unknown_source",
  "classmate_photo_without_permission",
  "realistic_elder_photo",
  "celebrity_image",
];

const hasUnsafeAsset = selectedAssetIds.some((id) =>
  unsafeAssets.includes(id)
);

const hasW3Authorship = Boolean(
  w3Authorship.keptOwnSentence ??
    w3Authorship.w3KeptOwnSentence ??
    w3Submission.keptOwnSentence
);

const hasW3Disclosure = Boolean(
  w3Authorship.disclosureChoiceId ??
    w3Authorship.w3DisclosureChoiceId ??
    w3Submission.disclosureChoiceId
);

const hasW3Attribution = Boolean(
  w3Authorship.attributionChoiceId ??
    w3Authorship.w3AttributionChoiceId ??
    w3Submission.attributionChoiceId
);

const w3Context =
  !hasUnsafeAsset &&
  hasW3Authorship &&
  (hasW3Disclosure || hasW3Attribution);

  const workflowAllocation = obj(
    w4.workflowAllocation ?? w4.taskResponsibilityById
  );

  const humanOnlyValues = ["human", "human_only"];
  const humanJudgementTasks = [
    "decide_final_suggestions",
    "check_fairness_feasibility",
    "disclose_ai_use",
    "decide_what_to_send_school",
  ];

  const humanKeptCount = humanJudgementTasks.filter((id) =>
    humanOnlyValues.includes(String(workflowAllocation[id] ?? ""))
  ).length;

  const ruleIds = arr(w4Rules.aiUseRuleIds ?? w4Rules.rules);

  const w4Context =
    humanKeptCount >= 2 ||
    ruleIds.some((id) =>
      ["human_final_decision", "disclose_ai_use", "check_ai_data"].includes(id)
    );

  const w5Reminders = arr(
    w5Use.selectedReminderIds ?? w5Use.selectedReminders
  );

  const w5CardText = [
    String(w5Card.humanCheck ?? ""),
    String(w5Card.reminder ?? ""),
    String(w5Card.limits ?? ""),
  ].join(" ");

  const w5ResourceAllocation = obj(w5Use.resourceTriageAllocation);

  const w5Context =
    w5Reminders.some((id) =>
      [
        "ai_may_be_wrong",
        "check_uncertain_cases",
        "ask_human_when_unsure",
        "do_not_treat_ai_as_final_authority",
      ].includes(id)
    ) ||
    /人|human|check|检查|檢查|不确定|不確定|wrong|错|錯|限制|limit/i.test(
      w5CardText
    ) ||
    Object.values(w5ResourceAllocation).includes("ai_assist_human_check");

  const contexts = [
    { id: "w1_responsible_recommendation_rules", valid: w1Context },
    { id: "w3_authorship_source_disclosure", valid: w3Context },
    { id: "w4_human_responsibility", valid: w4Context },
    { id: "w5_system_limits_human_check", valid: w5Context },
  ];

  const validContextCount = contexts.filter((item) => item.valid).length;

  if (
    validContextCount > 0 ||
    w1Rules.length ||
    selectedAssetIds.length ||
    Object.keys(workflowAllocation).length ||
    ruleIds.length ||
    w5Reminders.length ||
    Object.keys(w5ResourceAllocation).length ||
    w5CardText.trim().length > 0
  ) {
    let score = Math.min(3, validContextCount);

    // Cap: a serious unsafe-material decision or AI-only responsibility decision prevents a high E6 score.
    const riskyAiOnly = humanJudgementTasks.some((id) =>
      ["ai", "ai_auto"].includes(String(workflowAllocation[id] ?? ""))
    );

    if (hasUnsafeAsset || riskyAiOnly) {
      score = Math.min(score, 2);
    }

    items = items.map((item) =>
      item.competenceId === "E6" ? withProfileFlag(item, false) : item
    );

    items.push(
      makeScore({
        worldId: "cross",
        competenceId: "E6",
        domainId: "engaging",
        score,
        scoreId: "X-E6-VALUES-ETHICS-COMPOSITE",
        scoringSource: "auto_keyed",
        evidenceStrength:
          validContextCount >= 3
            ? "strong"
            : validContextCount >= 2
            ? "moderate"
            : "limited",
        coverageLevel: validContextCount >= 2 ? "primary" : "mixed",
        evidence: {
          formula: "min(3, count(valid contexts from W1, W3, W4, W5))",
          contexts,
          validContextCount,
          caps: { hasUnsafeAsset, riskyAiOnly },
        },
        rationale:
          "Composite E6 score: values-and-ethics awareness is synthesized across recommendation transparency/diversity, authorship/source/disclosure, human responsibility in workflow decisions, and system-level limits/human-check judgement in W5.",
      })
    );
    }

  return items;
}

export async function scoreSession(sessionId: string) {
  const evidence = await loadEvidence(sessionId);

  const rawScoreItems: ScoreItem[] = [
    ...scoreWorld1(evidence),
    ...scoreWorld2(evidence),
    ...scoreWorld3(evidence),
    ...scoreWorld4(evidence),
    ...scoreWorld5(evidence),
  ];

  const scoreItems = buildCompositeScores(rawScoreItems, evidence);

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
