import { EvidenceBundle, EvidenceStrength, ReviewStatus, ScoreItem, ScoringSource, TeacherRating } from "./types";

export const RUBRIC_VERSION = "v2.2-situated-judgement";

export function clampScore(score: number, min = 0, max = 3) {
  return Math.max(min, Math.min(max, score));
}

export function arr(value: any): string[] {
  return Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
}

export function str(value: any): string {
  return typeof value === "string" ? value : "";
}

export function obj(value: any): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function boolRecordTrueKeys(value: any): string[] {
  const record = obj(value);
  return Object.entries(record)
    .filter(([, v]) => v === true)
    .map(([k]) => k);
}

export function hasAny(text: string, patterns: Array<string | RegExp>) {
  const value = text || "";
  return patterns.some((p) => (typeof p === "string" ? value.includes(p) : p.test(value)));
}

export function makeScore(args: {
  worldId: string;
  competenceId: string;
  domainId: string;
  score: number;
  scoreId: string;
  scoringSource: ScoringSource;
  evidenceStrength: EvidenceStrength;
  reviewStatus?: ReviewStatus;
  evidence: Record<string, any>;
  linkedCompetences?: string[];
  rationale?: string;
  includeInCompetenceProfile?: boolean;
  coverageLevel?: "primary" | "mixed" | "supporting" | "limited";
  scoreMeaning?: string;
}): ScoreItem {
  const includeInCompetenceProfile =
  args.includeInCompetenceProfile ??
  (args.scoringSource !== "supporting" &&
    args.scoringSource !== "not_scored");
  return {
    worldId: args.worldId,
    competenceId: args.competenceId,
    domainId: args.domainId,
    score: clampScore(Number.isFinite(args.score) ? args.score : 0),
    rubricVersion: RUBRIC_VERSION,
    evidenceJson: {
      scoreId: args.scoreId,
      scoringSource: args.scoringSource,
      evidenceStrength: args.evidenceStrength,
      reviewStatus: args.reviewStatus ?? (args.scoringSource === "teacher_light" ? "needs_review" : "not_needed"),
      linkedCompetences: args.linkedCompetences ?? [args.competenceId],
      includeInCompetenceProfile,
      coverageLevel: args.coverageLevel ?? (includeInCompetenceProfile ? "primary" : "supporting"),
      scoreMeaning: args.scoreMeaning ?? "",
      scoringRationale: args.rationale ?? "",
      ...args.evidence,
    },
  };
}

export function latestTeacherRating(evidence: EvidenceBundle, productKey: string, competenceId?: string): TeacherRating | null {
  const ratings = evidence.teacherRatings
    .filter((r) => r.productKey === productKey)
    .filter((r) => !competenceId || r.competenceIds.includes(competenceId))
    .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
  return ratings[0] ?? null;
}

export function applyTeacherRating(baseScore: number, evidence: EvidenceBundle, productKey: string, competenceId: string) {
  const rating = latestTeacherRating(evidence, productKey, competenceId);
  if (!rating) {
    return {
      score: baseScore,
      reviewStatus: "needs_review" as const,
      teacherRating: null,
    };
  }
  return {
    score: clampScore(rating.score),
    reviewStatus: "reviewed" as const,
    teacherRating: {
      score: rating.score,
      comment: rating.comment ?? "",
      createdAt: rating.createdAt ?? null,
    },
  };
}

export function normalizeForSimilarity(text: string) {
  return (text || "")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .trim();
}

export function charNgrams(text: string, n = 3) {
  const s = normalizeForSimilarity(text);
  if (!s) return new Set<string>();
  if (s.length <= n) return new Set([s]);
  const grams = new Set<string>();
  for (let i = 0; i <= s.length - n; i++) grams.add(s.slice(i, i + n));
  return grams;
}

export function jaccardSimilarity(a: string, b: string) {
  const A = charNgrams(a);
  const B = charNgrams(b);
  if (!A.size || !B.size) return 0;
  let intersection = 0;
  for (const item of A) if (B.has(item)) intersection += 1;
  const union = A.size + B.size - intersection;
  return union ? intersection / union : 0;
}

export function textHasSubstance(text: string, minChars = 12) {
  const clean = normalizeForSimilarity(text);
  return clean.length >= minChars && !/^(.)\1{6,}$/.test(clean);
}

export function mapLegacyChineseTask(text: string): string {
  if (/人数|人數|比例|百分比|統計|统计/.test(text)) return "calculate_percentages";
  if (/3 条重点|3 條重點|整理.*重点|整理.*重點/.test(text)) return "organize_key_points";
  if (/解释为什么|解釋為什麼|最常见|最常見/.test(text)) return "explain_common_pattern";
  if (/最后.*建议|最後.*建議|給學校.*建議|给学校.*建议/.test(text)) return "decide_final_suggestions";
  if (/公平|合理|可执行|可執行/.test(text)) return "check_fairness_feasibility";
  if (/说明.*AI|說明.*AI|用了 AI|使用 AI/.test(text)) return "disclose_ai_use";
  return text;
}

export function mapLegacyRule(text: string): string {
  if (/说明|說明|用了 AI|使用 AI/.test(text)) return "disclose_ai_use";
  if (/不能直接整段|不能直接|照搬/.test(text)) return "do_not_copy_ai_directly";
  if (/最后建议必须由人|最後建議必須由人|由人来决定|由人來決定/.test(text)) return "human_final_decision";
  if (/数据.*检查|數據.*檢查|再检查|再檢查/.test(text)) return "check_ai_data";
  return text;
}

export function includesAny(values: string[], targets: string[]) {
  return values.some((v) => targets.includes(v));
}
