import { EvidenceBundle, ScoreItem } from "./types";
import { applyTeacherRating, arr, boolRecordTrueKeys, makeScore, obj, str } from "./utils";

export function scoreWorld1(evidence: EvidenceBundle): ScoreItem[] {
  const scores: ScoreItem[] = [];
  const step2 = obj(evidence.stepResponses["w1_step2"]);
  const step3 = obj(evidence.stepResponses["w1_step3"]);
  const submission = evidence.submissionsByWorld["w1"];

  // W1-R1: E3 recommendation benefit / narrowing risk.
  const helpfulMode = str(step2.helpfulModeId ?? step2.bestMode);
  const narrowMode = str(step2.narrowModeId ?? step2.narrowMode);
  const helpfulReasons = arr(step2.helpfulReasonTags);
  const narrowReasons = arr(step2.narrowReasonTags);
  const validHelpful = ["uses_my_learning_record", "matches_recent_learning", "shows_common_student_interest", "helps_try_new_topics"];
  const validNarrow = ["repeats_similar_content", "overuses_past_record", "follows_the_crowd", "reduces_exploration"];

  if (helpfulMode || narrowMode) {
    let score = 0;
    if (helpfulMode && narrowMode) {
      const hasHelpfulReason = helpfulReasons.some((x) => validHelpful.includes(x));
      const hasNarrowReason = narrowReasons.some((x) => validNarrow.includes(x));
      score = 1;
      if (hasHelpfulReason || hasNarrowReason) score = 2;
      if (hasHelpfulReason && hasNarrowReason) score = 3;
    } else {
      score = 1;
    }

    scores.push(
      makeScore({
        worldId: "w1",
        competenceId: "E3",
        domainId: "engaging",
        score,
        scoreId: "W1-R1",
        scoringSource: "auto_keyed",
        evidenceStrength: score >= 3 ? "strong" : "moderate",
        evidence: { helpfulMode, narrowMode, helpfulReasons, narrowReasons },
        rationale:
          "Scores the student's situated judgement about how recommendation modes may support learning and narrow perspectives. Viewing cards alone is not scored as understanding.",
      })
    );
  }

  // W1-R2: M5 responsible recommendation system rules.
  const rulesObj = obj(step3.rules);
  const selectedRules = arr(step3.rules).length ? arr(step3.rules) : boolRecordTrueKeys(rulesObj);
  const normalizedRules = selectedRules.map((r) =>
    r === "explainReason" ? "explain_reason" :
    r === "teacherReview" ? "teacher_review" :
    r === "tryNewThings" ? "try_new_things" :
    r === "sayWhatDataUsed" ? "say_what_data_used" :
    r === "onlyPopular" ? "only_popular" : r
  );
  const positiveRules = ["explain_reason", "teacher_review", "try_new_things", "say_what_data_used"];
  const positiveCount = normalizedRules.filter((r) => positiveRules.includes(r)).length;
  const hasProblematic = normalizedRules.includes("only_popular");

  if (normalizedRules.length) {
    let score = 0;
    if (positiveCount === 1) score = 1;
    if (positiveCount >= 2 && !hasProblematic) score = 2;
    if (positiveCount >= 3 && !hasProblematic && (normalizedRules.includes("explain_reason") || normalizedRules.includes("teacher_review"))) score = 3;

    scores.push(
      makeScore({
        worldId: "w1",
        competenceId: "M5",
        domainId: "managing",
        score,
        scoreId: "W1-R2",
        scoringSource: "auto_keyed",
        evidenceStrength: "strong",
        evidence: { selectedRules: normalizedRules, positiveCount, hasProblematic },
        rationale:
          "Scores whether the student selected responsible safeguards for an AI recommender. No rule or only a popularity-only rule is treated as an inappropriate judgement, not as missing data.",
      })
    );
  }

  // W1-R3: teacher-light feedback card. Automatic part only checks structure; teacher can adjust quality.
  const meta = obj(submission?.selfCheckJson);
  const good = str(meta.good);
  const warning = str(meta.warning);
  const content = str(submission?.content);
  if (content || good || warning) {
    const hasBenefit = Boolean(good.trim()) || /help|useful|学习|學習|帮助|幫助|推薦|推荐/.test(content);
    const hasWarning = Boolean(warning.trim()) || /risk|warning|narrow|小心|注意|提醒|風險|风险|窄/.test(content);
    const baseScore = hasBenefit && hasWarning ? 2 : 1;
    const reviewed = applyTeacherRating(baseScore, evidence, "w1_feedback_card", "E3");

    scores.push(
      makeScore({
        worldId: "w1",
        competenceId: "E3",
        domainId: "engaging",
        score: reviewed.score,
        scoreId: "W1-R3",
        scoringSource: "teacher_light",
        evidenceStrength: "mixed",
        reviewStatus: reviewed.reviewStatus,
        evidence: { hasBenefit, hasWarning, teacherRating: reviewed.teacherRating, contentPreview: content.slice(0, 240) },
        rationale:
          "Open feedback is stored for teacher-light review. The system only checks whether both benefit and safeguard/caution are present; it does not infer explanation quality from length.",
      })
    );
  }

  return scores;
}
