"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TeacherLanguageSwitch from "./TeacherLanguageSwitch";
import { teacherText } from "@/lib/teacher-i18n";
import { useTeacherLocale } from "./useTeacherLocale";

type SessionDetailResponse = {
  ok: boolean;
  session: any;
  events: Array<any>;
  responses: Array<any>;
  chats: Array<any>;
  submissions: Array<any>;
  scores: Array<any>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  const className =
    domain === "Engaging with AI"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : domain === "Creating with AI"
      ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
      : domain === "Managing AI"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        className
      )}
    >
      {domain}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function languageLabel(language: string) {
  if (language === "zh-Hans") return "简体中文";
  if (language === "zh-Hant") return "繁體中文";
  if (language === "en") return "English";
  return language;
}

function summarizeObject(value: any) {
  if (!value || typeof value !== "object") return "—";
  const entries = Object.entries(value).slice(0, 6);
  if (!entries.length) return "—";

  return entries
    .map(([key, val]) =>
      Array.isArray(val)
        ? `${key}: ${val.join(", ")}`
        : typeof val === "object" && val !== null
        ? `${key}: [object]`
        : `${key}: ${String(val)}`
    )
    .join(" · ");
}

function safeJsonObject(value: any) {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  if (typeof value === "object") return value;
  return {};
}

function safeArray(value: any): string[] {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : [];
}

const OECD_COMPETENCES = [
  {
    code: "E1",
    domain: "Engaging with AI",
    wording: "Recognize AI’s role and influence in different contexts.",
  },
  {
    code: "E2",
    domain: "Engaging with AI",
    wording: "Evaluate whether AI outputs should be accepted, revised, or rejected.",
  },
  {
    code: "E3",
    domain: "Engaging with AI",
    wording:
      "Examine how predictive AI systems provide recommendations that can inform and limit perspectives.",
  },
  {
    code: "E4",
    domain: "Engaging with AI",
    wording: "Explain how AI could be used to amplify societal biases.",
  },
  {
    code: "E5",
    domain: "Engaging with AI",
    wording: "Describe how AI systems consume energy and natural resources.",
  },
  {
    code: "E6",
    domain: "Engaging with AI",
    wording:
      "Analyze how well the use of an AI system aligns with ethical principles and human values.",
  },
  {
    code: "E7",
    domain: "Engaging with AI",
    wording:
      "Connect AI’s social and ethical impacts to its technical capabilities and limitations.",
  },

  {
    code: "C1",
    domain: "Creating with AI",
    wording:
      "Use AI systems to explore new perspectives and approaches that build upon original ideas.",
  },
  {
    code: "C2",
    domain: "Creating with AI",
    wording:
      "Visualize, prototype, and combine ideas using different types of AI systems.",
  },
  {
    code: "C3",
    domain: "Creating with AI",
    wording:
      "Collaborate with generative AI systems to elicit feedback, refine results, and reflect on thought processes.",
  },
  {
    code: "C4",
    domain: "Creating with AI",
    wording:
      "Analyze how AI can safeguard or violate content authenticity and intellectual property.",
  },
  {
    code: "C5",
    domain: "Creating with AI",
    wording:
      "Explain how AI systems perform tasks using precise language that avoids anthropomorphism.",
  },

  {
    code: "M1",
    domain: "Managing AI",
    wording: "Decide whether to use AI systems based on the nature of the task.",
  },
  {
    code: "M2",
    domain: "Managing AI",
    wording:
      "Decompose a problem based on the capabilities and limitations of both AI systems and humans.",
  },
  {
    code: "M3",
    domain: "Managing AI",
    wording:
      "Direct generative AI systems by providing specific instructions, appropriate context, and evaluation criteria.",
  },
  {
    code: "M4",
    domain: "Managing AI",
    wording:
      "Delegate tasks to AI systems to appropriately automate or augment human workflows.",
  },
  {
    code: "M5",
    domain: "Managing AI",
    wording:
      "Develop and communicate guidelines for using AI systems that align with human values, promote fairness, and prioritize transparency.",
  },

  {
    code: "D1",
    domain: "Designing AI",
    wording:
      "Describe how AI systems can be designed to support a solution to a community problem.",
  },
  {
    code: "D2",
    domain: "Designing AI",
    wording:
      "Compare the capabilities and limitations of AI systems that follow algorithms created by humans with those that make predictions based on data.",
  },
  {
    code: "D3",
    domain: "Designing AI",
    wording:
      "Collect and curate data that could be used to train an AI model by considering relevance, representation, and potential impact.",
  },
  {
    code: "D4",
    domain: "Designing AI",
    wording:
      "Evaluate AI systems using defined criteria, expected outcomes, and user feedback.",
  },
  {
    code: "D5",
    domain: "Designing AI",
    wording:
      "Describe an AI model’s purpose, intended users, and its limitations.",
  },
];

function getScoreLevel(score: number | null) {
  if (score === null || Number.isNaN(score)) {
    return {
      label: "No evidence yet",
      className: "bg-slate-100 text-slate-500",
    };
  }

  if (score < 1) {
    return {
      label: "Emerging",
      className: "bg-rose-50 text-rose-700",
    };
  }

  if (score < 2) {
    return {
      label: "Developing",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Proficient",
    className: "bg-emerald-50 text-emerald-700",
  };
}

function CompetenceProfileCard({ scores }: { scores: Array<any> }) {
  const scoreMap = new Map<string, number[]>();

  for (const row of scores) {
    const key =
      row.competenceId ??
      row.competenceCode ??
      row.competencyId ??
      row.competencyCode ??
      "";

    if (!key) continue;

    const arr = scoreMap.get(key) ?? [];
    arr.push(Number(row.score));
    scoreMap.set(key, arr);
  }

  const grouped = OECD_COMPETENCES.reduce<
    Record<string, typeof OECD_COMPETENCES>
  >((acc, item) => {
    acc[item.domain] = acc[item.domain] ?? [];
    acc[item.domain].push(item);
    return acc;
  }, {});

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          AI Literacy Competence Profile
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Preliminary evidence-based profile aligned with the OECD/EC AILit
          framework. These indicators are formative and should not be interpreted
          as high-stakes assessment results.
        </p>
      </div>

      <div className="space-y-5">
        {Object.entries(grouped).map(([domain, competences]) => (
          <div key={domain} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3">
              <DomainBadge domain={domain} />
            </div>

            <div className="space-y-3">
              {competences.map((competence) => {
                const values = scoreMap.get(competence.code) ?? [];
                const average =
                  values.length > 0
                    ? values.reduce((a, b) => a + b, 0) / values.length
                    : null;

                const level = getScoreLevel(average);

                return (
                  <div
                    key={competence.code}
                    className="rounded-2xl bg-slate-50 p-3"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {competence.code}
                        </div>
                        <div className="mt-1 text-sm leading-6 text-slate-700">
                          {competence.wording}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            level.className
                          )}
                        >
                          {level.label}
                        </span>

                        {average !== null ? (
                          <span className="text-xs text-slate-500">
                            {average.toFixed(2)} / 3
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function getW3CollaborationReviewForSubmission(
  submission: any,
  data: SessionDetailResponse | null
) {
  if (!(submission.worldId === "w3" && submission.submissionType === "warm_card")) {
    return {
      helpfulTags: [],
      limitationTags: [],
      usabilityFeedback: "",
    };
  }

  const selfCheckJson = safeJsonObject(submission.selfCheckJson);
  const reviewFromSubmission = safeJsonObject(
    selfCheckJson?.ai_collaboration_review
  );

  const w3Step5Response = data?.responses?.find(
    (item: any) => item.worldId === "w3" && item.stepId === "w3_step5"
  );

  const w3Step5Json = safeJsonObject(w3Step5Response?.responseJson);

  const helpfulTags = safeArray(
    reviewFromSubmission.helpful_tags ?? w3Step5Json.aiHelpfulTags
  );

  const limitationTags = safeArray(
    reviewFromSubmission.limitation_tags ?? w3Step5Json.aiLimitationTags
  );

  const usabilityFeedback =
    reviewFromSubmission.usability_feedback ??
    w3Step5Json.aiUsabilityFeedback ??
    "";

  return {
    helpfulTags,
    limitationTags,
    usabilityFeedback:
      typeof usabilityFeedback === "string" ? usabilityFeedback : "",
  };
}

function W3CollaborationReviewInline({
  helpfulTags,
  limitationTags,
  usabilityFeedback,
}: {
  helpfulTags: string[];
  limitationTags: string[];
  usabilityFeedback: string;
}) {
  const hasAnyData =
    helpfulTags.length > 0 ||
    limitationTags.length > 0 ||
    usabilityFeedback.trim().length > 0;

  if (!hasAnyData) return null;

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold text-slate-900">
          AI Collaboration Review
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          World 3 · Step 5
        </span>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">
            Helpful aspects
          </div>
          {helpfulTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {helpfulTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No helpful tags recorded.</p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">
            Limitations noticed
          </div>
          {limitationTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {limitationTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No limitation tags recorded.</p>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-700">
            Optional product feedback
          </div>
          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
            Not scored
          </span>
        </div>

        {usabilityFeedback.trim().length > 0 ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {usabilityFeedback}
          </p>
        ) : (
          <p className="text-xs text-slate-400">
            No optional product feedback provided.
          </p>
        )}
      </div>
    </div>
  );
}



/**
 * Newly added helper:
 * Reads World 3 Step 5 data from either:
 * 1) step_response: w3_step5.responseJson
 * 2) submission.selfCheckJson.ai_collaboration_review
 *
 * This makes the teacher page compatible with both storage paths.
 */
function getW3CollaborationReview(data: SessionDetailResponse | null) {
  const responses = data?.responses ?? [];
  const submissions = data?.submissions ?? [];

  const w3Step5Response = responses.find(
    (item: any) => item.worldId === "w3" && item.stepId === "w3_step5"
  );

  const w3Step5Json = safeJsonObject(w3Step5Response?.responseJson);

  const w3WarmCardSubmission = submissions.find(
    (item: any) => item.worldId === "w3" && item.submissionType === "warm_card"
  );

  const w3SelfCheckJson = safeJsonObject(w3WarmCardSubmission?.selfCheckJson);

  const reviewFromSubmission = safeJsonObject(
    w3SelfCheckJson?.ai_collaboration_review
  );

  const helpfulTags = safeArray(
    reviewFromSubmission.helpful_tags ?? w3Step5Json.aiHelpfulTags
  );

  const limitationTags = safeArray(
    reviewFromSubmission.limitation_tags ?? w3Step5Json.aiLimitationTags
  );

  const usabilityFeedback =
    reviewFromSubmission.usability_feedback ??
    w3Step5Json.aiUsabilityFeedback ??
    "";

  return {
    helpfulTags,
    limitationTags,
    usabilityFeedback:
      typeof usabilityFeedback === "string" ? usabilityFeedback : "",
  };
}

export default function TeacherSessionDetailClient({
  sessionId,
}: {
  sessionId: string;
}) {
  const { locale } = useTeacherLocale();
  const t = teacherText[locale];
  const [data, setData] = useState<SessionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/teacher/session/${sessionId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (res.status === 401) {
          window.location.href = "/teacher/login";
          return;
        }

        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Failed to load");
        }

        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t.loadFailed);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [sessionId, t.loadFailed]);

  const completedWorlds = useMemo(
    () => (data ? [...new Set(data.submissions.map((item) => item.worldId))] : []),
    [data]
  );

  const domainScores = useMemo(() => {
    if (!data) return [];

    const map = new Map<string, number[]>();

    for (const row of data.scores) {
      const arr = map.get(row.domainId) ?? [];
      arr.push(Number(row.score));
      map.set(row.domainId, arr);
    }

    return Array.from(map.entries()).map(([domainId, values]) => ({
      domainId,
      average: values.reduce((a, b) => a + b, 0) / values.length,
    }));
  }, [data]);


  function getW3CollaborationReviewForSubmission(
  submission: any,
  data: SessionDetailResponse | null
) {
  if (!(submission.worldId === "w3" && submission.submissionType === "warm_card")) {
    return {
      helpfulTags: [],
      limitationTags: [],
      usabilityFeedback: "",
    };
  }

  const selfCheckJson = safeJsonObject(submission.selfCheckJson);
  const reviewFromSubmission = safeJsonObject(
    selfCheckJson?.ai_collaboration_review
  );

  const w3Step5Response = data?.responses?.find(
    (item: any) => item.worldId === "w3" && item.stepId === "w3_step5"
  );

  const w3Step5Json = safeJsonObject(w3Step5Response?.responseJson);

  const helpfulTags = safeArray(
    reviewFromSubmission.helpful_tags ?? w3Step5Json.aiHelpfulTags
  );

  const limitationTags = safeArray(
    reviewFromSubmission.limitation_tags ?? w3Step5Json.aiLimitationTags
  );

  const usabilityFeedback =
    reviewFromSubmission.usability_feedback ??
    w3Step5Json.aiUsabilityFeedback ??
    "";

  return {
    helpfulTags,
    limitationTags,
    usabilityFeedback:
      typeof usabilityFeedback === "string" ? usabilityFeedback : "",
  };
}

  async function handleLogout() {
    await fetch("/api/teacher/logout", { method: "POST" });
    window.location.href = "/teacher/login";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">
              Teacher Portal
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {t.detailTitle}
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {t.detailNote}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <TeacherLanguageSwitch />
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              {t.logout}
            </button>
          </div>
        </div>

        {loading ? (
          <Card className="p-6 text-sm text-slate-600">{t.loading}</Card>
        ) : error ? (
          <Card className="p-6 text-sm text-rose-600">
            {t.loadFailed}: {error}
          </Card>
        ) : data ? (
          <div className="space-y-6">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t.basicInfo}
                </h2>
                <Link
                  href="/teacher"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                >
                  {t.overviewTitle}
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.student}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.studentName ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.studentCode}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.studentCode ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.className}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.className ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.schoolName}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.schoolName ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.gradeLevel}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.gradeLevel ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.sessionCode}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.sessionCode}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.language}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {languageLabel(data.session.language)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.status}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.status}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.startedAt}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(data.session.startedAt)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.finishedAt}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(data.session.finishedAt)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.currentWorld}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.currentWorld ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{t.currentStep}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {data.session.currentStep ?? "—"}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card className="p-5">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  {t.scoreSummary}
                </h2>

                {domainScores.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                    —
                  </div>
                ) : (
                  <div className="space-y-4">
                    {domainScores.map((item) => {
                      const progress = Math.max(
                        0,
                        Math.min(100, (item.average / 3) * 100)
                      );

                      return (
                        <div
                          key={item.domainId}
                          className="rounded-2xl border border-slate-200 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <DomainBadge domain={item.domainId} />
                            <div className="text-sm font-medium text-slate-700">
                              {item.average.toFixed(2)} / 3.00
                            </div>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-900"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                  <div className="text-sm font-medium text-slate-900">
                    {t.completedWorlds}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {completedWorlds.length
                      ? completedWorlds.map((w) => w.toUpperCase()).join(", ")
                      : "—"}
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  {t.activitySummary}
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">{t.eventsCount}</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">
                      {data.events.length}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">
                      {t.responsesCount}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">
                      {data.responses.length}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">{t.aiTurnsCount}</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">
                      {data.chats.length}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-medium text-slate-900">
                    {t.recentEvents}
                  </h3>

                  {data.events.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      {t.noEvents}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.events
                        .slice(-8)
                        .reverse()
                        .map((event) => (
                          <div
                            key={event.id}
                            className="rounded-2xl border border-slate-200 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                                {event.worldId}
                              </span>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                                {event.eventType}
                              </span>
                              <span className="text-sm font-medium text-slate-900">
                                {event.eventName}
                              </span>
                            </div>

                            <div className="mt-2 text-xs text-slate-500">
                              {formatDate(event.createdAt)}
                            </div>

                            {event.eventValueJson ? (
                              <div className="mt-2 text-sm text-slate-600">
                                {summarizeObject(event.eventValueJson)}
                              </div>
                            ) : null}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <CompetenceProfileCard scores={data.scores} />

            <Card className="p-5">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                {t.finalSubmissions}
              </h2>

              {data.submissions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  {t.noSubmissions}
                </div>
              ) : (
                <div className="space-y-4">
                  {data.submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                          {submission.worldId.toUpperCase()}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          {submission.submissionType}
                        </span>
                        <span className="text-xs text-slate-500">
                          {t.submittedAt}: {formatDate(submission.submittedAt)}
                        </span>
                      </div>

                      <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-800">
                        {submission.content}
                      </div>

                        {submission.selfCheckJson ? (
                           <div className="mt-3 text-sm text-slate-600">
                             {summarizeObject(submission.selfCheckJson)}
                             </div>
                             ) : null}

                      {(() => {
                        const review = getW3CollaborationReviewForSubmission(
                          submission,
                          data
                        );

                        return (
                          <W3CollaborationReviewInline
                            helpfulTags={review.helpfulTags}
                            limitationTags={review.limitationTags}
                            usabilityFeedback={review.usabilityFeedback}
                          />
                        );
                      })()}
                        {(() => {
                          const review = getW3CollaborationReviewForSubmission(submission, data);
                          return (
                          <W3CollaborationReviewInline
                          helpfulTags={review.helpfulTags}
                          limitationTags={review.limitationTags}
                          usabilityFeedback={review.usabilityFeedback}
                          />
                        );
                        })()}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                {t.aiChats}
              </h2>

              {data.chats.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  {t.noChats}
                </div>
              ) : (
                <div className="space-y-3">
                  {data.chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "rounded-2xl p-4",
                        chat.role === "user" ? "bg-sky-50" : "bg-fuchsia-50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-slate-900">
                          {chat.role === "user" ? "Student" : "AI"} · turn{" "}
                          {chat.turnNo}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDate(chat.createdAt)}
                        </div>
                      </div>

                      <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">
                        {chat.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}