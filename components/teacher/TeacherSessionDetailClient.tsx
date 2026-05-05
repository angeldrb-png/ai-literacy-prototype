"use client";

import ReScoreSessionButton from "@/components/teacher/ReScoreSessionButton";
import W3CardPreviewShared from "@/components/shared/W3CardPreviewShared";
import { buildProcessEvidence, type ProcessEvidenceItem } from "@/lib/assessment/report";
import { labelList, labelOf as label } from "@/lib/assessment/labels";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  COMPETENCE_META,
  COMPETENCE_ORDER,
  DOMAIN_META,
  DOMAIN_ORDER,
  WORLD_META,
  type DomainKey,
  type TeacherLocale,
  competenceTitle,
  domainLabel,
  normalizeDomainId,
} from "./teacher-report-meta";

type SessionDetailResponse = {
  ok: boolean;
  session: any;
  events: any[];
  responses: any[];
  chats: any[];
  submissions: any[];
  scores: any[];
  teacherRatings?: any[];
};

type RatingTarget = {
  productKey: string;
  worldId: string;
  competenceIds: string[];
  title: Record<TeacherLocale, string>;
  check: Record<TeacherLocale, string>;
  rubric: Record<TeacherLocale, string[]>;
};

const UI: Record<TeacherLocale, any> = {
  "zh-Hans": {
    portal: "Teacher Portal",
    title: "学生 AI 素养形成性报告",
    note: "用于教学参考，不作为最终成绩。",
    back: "班级总览",
    logout: "退出登录",
    loading: "正在加载学生报告……",
    loadFailed: "加载失败",
    zhHans: "简",
    zhHant: "繁",
    en: "EN",
    basic: "学生基本信息",
    student: "学生",
    studentId: "学号",
    className: "班级",
    language: "语言",
    status: "状态",
    finishedAt: "完成时间",
    completed: "已完成",
    inProgress: "进行中",
    notFinished: "未完成",
    noValue: "—",
    domain: "AI 素养总体诊断",
    domainNote: "用于了解学生在不同 AI 使用情境中的初步表现。",
    teachingFocus: "教学关注",
    score: "表现",
    review: "待教师确认的学生作品",
    reviewNote: "请根据评分说明快速确认开放作品。结构化选择已由系统自动判断。",
    noReview: "目前没有需要教师确认的作品。",
    whatCheck: "您需要看什么？",
    studentWork: "学生作品",
    rubric: "评分标准",
    rating: "教师评分",
    comment: "教师评语（可选）",
    save: "保存评分",
    saving: "保存中……",
    saved: "已保存",
    noSubmission: "暂未找到该作品。",
    competence: "22 项 AI 素养能力画像",
    competenceNote: "按 OECD/EC AILit 四个 domain 展示学生的能力表现。",
    teacherAction: "教师操作",
    actionNone: "无需操作",
    actionReview: "请查看对应作品",
    actionReviewed: "已确认",
    noEvidence: "暂无记录",
    mainTask: "主要任务",
    mission: "学生任务过程证据回放",
    missionNote: "这里按任务顺序展示学生做过的关键判断，帮助您追溯能力分数从哪里来。",
    role: "任务背景",
    goal: "任务目标",
    keyEvidence: "过程证据与对应能力",
    benefit: "学生认为有帮助的地方",
    warning: "学生提醒注意",
    finalReason: "学生的发布理由",
    finalCard: "学生最终卡片",
    checklist: "学生自检",
    aiUse: "学生如何使用 AI 建议",
    ideaSupport: "AI 对想法的帮助",
    presentation: "呈现形式与理由",
    workflowRules: "学生选择的 AI 使用规则",
    humanResponsibilities: "人仍然负责的任务",
    noAiReason: "学生不使用 AI 的理由",
    purpose: "用途",
    limits: "限制",
    reminder: "使用提醒",
    improve: "改进建议",
    intendedUsers: "使用对象",
    trainingData: "训练数据",
    humanCheck: "人类检查",
  },
  "zh-Hant": {
    portal: "Teacher Portal",
    title: "學生 AI 素養形成性報告",
    note: "用於教學參考，不作為最終成績。",
    back: "班級總覽",
    logout: "退出登入",
    loading: "正在載入學生報告……",
    loadFailed: "載入失敗",
    zhHans: "简",
    zhHant: "繁",
    en: "EN",
    basic: "學生基本資訊",
    student: "學生",
    studentId: "學號",
    className: "班級",
    language: "語言",
    status: "狀態",
    finishedAt: "完成時間",
    completed: "已完成",
    inProgress: "進行中",
    notFinished: "未完成",
    noValue: "—",
    domain: "AI 素養總體診斷",
    domainNote: "用於了解學生在不同 AI 使用情境中的初步表現。",
    teachingFocus: "教學關注",
    score: "表現",
    review: "待教師確認的學生作品",
    reviewNote: "請根據評分說明快速確認開放作品。結構化選擇已由系統自動判斷。",
    noReview: "目前沒有需要教師確認的作品。",
    whatCheck: "你需要看什麼？",
    studentWork: "學生作品",
    rubric: "評分標準",
    rating: "教師評分",
    comment: "教師評語（可選）",
    save: "保存評分",
    saving: "保存中……",
    saved: "已保存",
    noSubmission: "暫未找到該作品。",
    competence: "22 項 AI 素養能力畫像",
    competenceNote: "按 OECD/EC AILit 四個 domain 展示學生的能力表現。",
    teacherAction: "教師操作",
    actionNone: "無需操作",
    actionReview: "請查看對應作品",
    actionReviewed: "已確認",
    noEvidence: "暫無記錄",
    mainTask: "主要任務",
    mission: "學生任務過程證據回放",
    missionNote: "這裡按任務順序展示學生做過的關鍵判斷，幫助你追溯能力分數從哪裡來。",
    role: "任務背景",
    goal: "任務目標",
    keyEvidence: "過程證據與對應能力",
    benefit: "學生認為有幫助的地方",
    warning: "學生提醒注意",
    finalReason: "學生的發布理由",
    finalCard: "學生最終卡片",
    checklist: "學生自檢",
    aiUse: "學生如何使用 AI 建議",
    ideaSupport: "AI 對想法的幫助",
    presentation: "呈現形式與理由",
    workflowRules: "學生選擇的 AI 使用規則",
    humanResponsibilities: "人仍然負責的任務",
    noAiReason: "學生不使用 AI 的理由",
    purpose: "用途",
    limits: "限制",
    reminder: "使用提醒",
    improve: "改進建議",
    intendedUsers: "使用對象",
    trainingData: "訓練數據",
    humanCheck: "人類檢查",
  },
  en: {
    portal: "Teacher Portal",
    title: "Student AI Literacy Formative Report",
    note: "For teaching reference, not a final grade.",
    back: "Class overview",
    logout: "Log out",
    loading: "Loading student report...",
    loadFailed: "Failed to load",
    zhHans: "简",
    zhHant: "繁",
    en: "EN",
    basic: "Student information",
    student: "Student",
    studentId: "Student ID",
    className: "Class",
    language: "Language",
    status: "Status",
    finishedAt: "Completed at",
    completed: "Completed",
    inProgress: "In progress",
    notFinished: "Not completed",
    noValue: "—",
    domain: "Four AI Literacy Domain Diagnosis",
    domainNote: "Use this section to understand the student's preliminary performance across different AI-use situations.",
    teachingFocus: "Teaching focus",
    score: "Performance",
    review: "Student Work for Teacher Review",
    reviewNote: "Please quickly confirm open-ended work using the rubric. Structured choices have already been judged by the system.",
    noReview: "There is no student work waiting for teacher confirmation.",
    whatCheck: "What should you check?",
    studentWork: "Student work",
    rubric: "Rubric",
    rating: "Teacher rating",
    comment: "Optional teacher comment",
    save: "Save rating",
    saving: "Saving...",
    saved: "Saved",
    noSubmission: "This product has not been found yet.",
    competence: "22-Competence AI Literacy Profile",
    competenceNote: "Shows the student's performance across the four OECD/EC AILit domains.",
    teacherAction: "Teacher action",
    actionNone: "No action needed",
    actionReview: "Review related work",
    actionReviewed: "Reviewed",
    noEvidence: "No record yet",
    mainTask: "Main task",
    mission: "Student Process Evidence Replay",
    missionNote: "This section shows the student's key task judgements in sequence, so you can trace where the competence evidence comes from.",
    role: "Task background",
    goal: "Task goal",
    keyEvidence: "Process evidence and linked competences",
    benefit: "Student's perceived benefit",
    warning: "Student's caution",
    finalReason: "Student's publication reason",
    finalCard: "Student's final card",
    checklist: "Student self-check",
    aiUse: "How the student used AI suggestions",
    ideaSupport: "How AI supported the idea",
    presentation: "Presentation format and reason",
    workflowRules: "Student's AI-use rules",
    humanResponsibilities: "Human responsibilities",
    noAiReason: "Reason for not using AI",
    purpose: "Purpose",
    limits: "Limits",
    reminder: "Reminder",
    improve: "Improvement plan",
    intendedUsers: "Intended users",
    trainingData: "Training data",
    humanCheck: "Human checking",
  },
};

function CompetenceChips({
  ids,
  locale,
}: {
  ids: string[];
  locale: TeacherLocale;
}) {
  if (!ids.length) {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {locale === "en"
            ? "Not scored"
            : locale === "zh-Hant"
            ? "不計分"
            : "不计分"}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {ids.map((id) => (
        <span
          key={id}
          className="inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white"
        >
          {competenceTitle(id, locale)}
        </span>
      ))}
    </div>
  );
}

function ProcessEvidenceList({
  title,
  items,
  locale,
}: {
  title: string;
  items: ProcessEvidenceItem[];
  locale: TeacherLocale;
}) {
  const u = UI[locale];

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 text-xs font-medium text-slate-500">{title}</div>

      {items.length ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="text-sm font-semibold text-slate-900">
                {item.label}
              </div>
              <div className="mt-2 text-sm leading-7 text-slate-700">
                {item.value}
              </div>
              <CompetenceChips ids={item.competenceIds} locale={locale} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">{u.noEvidence}</div>
      )}
    </div>
  );
}
const REQUIRED_TEACHER_REVIEW_KEYS = [
  "w1_feedback_card",
  "w2_final_reason",
  "w3_warm_card",
  "w5_model_card_lite",
] as const;
const RATING_TARGETS: RatingTarget[] = [
  {
    productKey: "w1_feedback_card",
    worldId: "w1",
    competenceIds: ["E3"],
    title: { "zh-Hans": "推荐系统反馈卡", "zh-Hant": "推薦系統反饋卡", en: "Recommendation Feedback Card" },
    check: { "zh-Hans": "请查看学生是否同时说明了 AI 推荐的好处和需要注意的风险。", "zh-Hant": "請查看學生是否同時說明了 AI 推薦的好處和需要注意的風險。", en: "Check whether the student explains both the benefit and caution of AI recommendations." },
    rubric: { "zh-Hans": ["与任务无关或没有回应", "只笼统说有帮助或要小心", "同时提到好处和风险", "能说明推荐系统如何帮助学习，以及为什么需要使用保障规则"], "zh-Hant": ["與任務無關或沒有回應", "只籠統說有幫助或要小心", "同時提到好處和風險", "能說明推薦系統如何幫助學習，以及為什麼需要使用保障規則"], en: ["Irrelevant or missing", "Only general benefit or caution", "Mentions both benefit and risk", "Explains how the recommender helps learning and why safeguards are needed"] },
  },
  {
    productKey: "w2_final_reason",
    worldId: "w2",
    competenceIds: ["E2"],
    title: { "zh-Hans": "信息核查理由", "zh-Hant": "資訊核查理由", en: "Information Checking Reason" },
    check: { "zh-Hans": "请查看学生是否能说明为什么某些 AI 生成内容需要保留、核查或修改。", "zh-Hant": "請查看學生是否能說明為什麼某些 AI 生成內容需要保留、核查或修改。", en: "Check whether the student justifies what should be kept, checked, or revised." },
    rubric: { "zh-Hans": ["与任务无关", "只笼统说要检查", "能提到准确性、核查或避免误导", "能清楚说明发布前判断的理由"], "zh-Hant": ["與任務無關", "只籠統說要檢查", "能提到準確性、核查或避免誤導", "能清楚說明發布前判斷的理由"], en: ["Irrelevant", "General checking only", "Mentions accuracy, checking, or avoiding misleading information", "Clearly justifies the publication judgement"] },
  },
    {
  productKey: "w3_warm_card",
  worldId: "w3",
  competenceIds: ["C4"],
  title: {
    "zh-Hans": "创作表达卡片（作者声音辅助确认）",
    "zh-Hant": "創作表達卡片（作者聲音輔助確認）",
    en: "Creative Expression Card (Authorship Check)",
  },
  check: {
    "zh-Hans":
      "请查看学生是否保留个人表达。素材来源、授权和 AI 辅助说明已由系统结构化评分，此处仅作为补充确认。",
    "zh-Hant":
      "請查看學生是否保留個人表達。素材來源、授權和 AI 輔助說明已由系統結構化評分，此處僅作補充確認。",
    en:
      "Check whether the student keeps personal expression. Source, permission, and AI-use disclosure are scored through structured evidence; this is only a supplementary authorship check.",
  },
  rubric: {
    "zh-Hans": [
      "缺失或明显照搬",
      "有少量修改但主要依赖 AI",
      "能修改 AI 内容并保留部分个人表达",
      "能选择性使用 AI，并清楚保留自己的例子、语气或判断",
    ],
    "zh-Hant": [
      "缺失或明顯照搬",
      "有少量修改但主要依賴 AI",
      "能修改 AI 內容並保留部分個人表達",
      "能選擇性使用 AI，並清楚保留自己的例子、語氣或判斷",
    ],
    en: [
      "Missing or mostly copied",
      "Some revision but mainly AI-dependent",
      "Revises AI output and keeps some personal expression",
      "Selectively uses AI while clearly keeping personal examples, tone, or judgement",
    ],
  },
},
 {
  productKey: "w5_model_card_lite",
  worldId: "w5",
  competenceIds: ["D5"],
  title: {
    "zh-Hans": "AI 分类提醒卡",
    "zh-Hant": "AI 分類提醒卡",
    en: "AI Sorting Reminder Card",
  },
  check: {
    "zh-Hans":
      "请查看学生是否把这张卡当成需要检查和修改的说明卡，而不是直接提交系统草稿。若学生修改字段数为 0，请重点检查内容是否只是照交系统草稿。",
    "zh-Hant":
      "請查看學生是否把這張卡當成需要檢查和修改的說明卡，而不是直接提交系統草稿。若學生修改欄位數為 0，請重點檢查內容是否只是照交系統草稿。",
    en:
      "Check whether the student treated this as a card to review and revise, rather than submitting the system draft directly. If the edited-field count is 0, check carefully whether the draft was submitted as-is.",
  },
  rubric: {
  "zh-Hans": [
    "缺失、空白或与任务无关",
    "基本照交系统草稿，说明笼统，缺少主动检查",
    "说明了用途，并覆盖使用对象、例子、限制、检查或提醒中的几项",
    "内容清楚完整，能看出学生检查并修订过提醒卡",
  ],
  "zh-Hant": [
    "缺失、空白或與任務無關",
    "基本照交系統草稿，說明籠統，缺少主動檢查",
    "說明了用途，並覆蓋使用對象、例子、限制、檢查或提醒中的幾項",
    "內容清楚完整，能看出學生檢查並修訂過提醒卡",
  ],
  en: [
    "Missing, blank, or irrelevant",
    "Mostly submits the system draft with little evidence of checking",
    "Explains the purpose and covers several key parts",
    "Clear and complete, with evidence of student checking and revision",
  ],
},
},
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>{children}</section>;
}
function scorePct(score: number | null | undefined) {
  return Math.max(0, Math.min(100, ((Number(score) || 0) / 3) * 100));
}
function safeJson(value: any) {
  if (!value) return {};
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return {}; }
  }
  return typeof value === "object" && !Array.isArray(value) ? value : {};
}
function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return String(value);
}
function arr(value: any): string[] { return Array.isArray(value) ? value.filter((x) => typeof x === "string") : []; }
function textOrDash(value: any, locale: TeacherLocale) { return typeof value === "string" && value.trim() ? value : UI[locale].noValue; }
function getInitialLocale(): TeacherLocale {
  if (typeof window === "undefined") return "zh-Hans";
  const saved = window.localStorage.getItem("teacher_locale");
  return saved === "zh-Hant" || saved === "en" || saved === "zh-Hans" ? saved : "zh-Hans";
}
function LanguageSwitch({ locale, setLocale }: { locale: TeacherLocale; setLocale: (l: TeacherLocale) => void }) {
  const u = UI[locale];
  const items: Array<[TeacherLocale, string]> = [["zh-Hans", u.zhHans], ["zh-Hant", u.zhHant], ["en", u.en]];
  return <div className="flex gap-2">{items.map(([key, label]) => <button key={key} type="button" onClick={() => { window.localStorage.setItem("teacher_locale", key); setLocale(key); }} className={cn("h-11 min-w-11 rounded-full border px-3 text-sm font-medium transition", locale === key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}>{label}</button>)}</div>;
}
function languageLabel(language: string | null | undefined, locale: TeacherLocale) { if (language === "zh-Hans") return locale === "zh-Hant" ? "簡體中文" : "简体中文"; if (language === "zh-Hant") return "繁體中文"; if (language === "en") return "English"; return language || "—"; }
function statusLabel(status: string | null | undefined, locale: TeacherLocale) { if (status === "completed") return UI[locale].completed; if (status === "in_progress") return UI[locale].inProgress; return status || UI[locale].notFinished; }
function formatDate(value: string | null | undefined, locale: TeacherLocale) { if (!value) return UI[locale].noValue; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleString(locale === "en" ? "en" : locale === "zh-Hant" ? "zh-HK" : "zh-CN"); }
function InfoBlock({ title, value }: { title: string; value: ReactNode }) { return <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-medium text-slate-500">{title}</div><div className="mt-2 text-sm leading-7 text-slate-900">{value}</div></div>; }

function Checklist({ title, items }: { title: string; items: ReactNode[] }) { return <div className="rounded-2xl bg-slate-50 p-4"><div className="mb-2 text-xs font-medium text-slate-500">{title}</div><div className="space-y-1 text-sm leading-7 text-slate-800">{items.length ? items.map((item, i) => <div key={i}>✓ {item}</div>) : <div>—</div>}</div></div>; }
function getResponse(data: SessionDetailResponse, stepId: string) { return safeJson(data.responses.find((r) => r.stepId === stepId)?.responseJson); }
function getSubmission(data: SessionDetailResponse, worldId: string) { return data.submissions.find((s) => s.worldId === worldId); }
function findRating(data: SessionDetailResponse, productKey: string) { return (data.teacherRatings ?? []).find((r) => r.productKey === productKey); }
type PilotCheckStatus = "pass" | "warn" | "fail";

type PilotCheckItem = {
  id: string;
  status: PilotCheckStatus;
  title: string;
  detail: ReactNode;
};

function pilotStatusLabel(status: PilotCheckStatus, locale: TeacherLocale) {
  if (status === "pass") {
    return locale === "en" ? "OK" : locale === "zh-Hant" ? "通過" : "通过";
  }
  if (status === "warn") {
    return locale === "en" ? "Check" : locale === "zh-Hant" ? "需檢查" : "需检查";
  }
  return locale === "en" ? "Fix" : locale === "zh-Hant" ? "需修正" : "需修正";
}

function pilotStatusClass(status: PilotCheckStatus) {
  if (status === "pass") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "warn") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function allCompetenceIds() {
  return DOMAIN_ORDER.flatMap((domainKey) => COMPETENCE_ORDER[domainKey]);
}

function PilotReadinessCard({
  data,
  competenceMap,
  locale,
}: {
  data: SessionDetailResponse;
  competenceMap: Map<string, any[]>;
  locale: TeacherLocale;
}) {
  const worldIds = ["w1", "w2", "w3", "w4", "w5"];

  const submittedWorldIds = worldIds.filter((worldId) =>
    Boolean(getSubmission(data, worldId))
  );

  const missingWorldIds = worldIds.filter(
    (worldId) => !submittedWorldIds.includes(worldId)
  );

  const competenceIds = allCompetenceIds();
  const coveredCompetenceIds = competenceIds.filter(
    (id) => (competenceMap.get(id) ?? []).length > 0
  );

  const missingCompetenceIds = competenceIds.filter(
    (id) => !coveredCompetenceIds.includes(id)
  );

  
  const pendingTeacherReviews = RATING_TARGETS.filter((target) => {
    if (!REQUIRED_TEACHER_REVIEW_KEYS.includes(target.productKey as any)) return false;
    if (!getSubmission(data, target.worldId)) return false;
    return !findRating(data, target.productKey);
  });

  const w5Step7 = getResponse(data, "w5_step7");
  const w5Submission = getSubmission(data, "w5");
  const w5Meta = safeJson(w5Submission?.selfCheckJson);

  const w5CardDraftAutoFilled = Boolean(
    w5Step7.cardDraftAutoFilled ?? w5Meta.cardDraftAutoFilled
  );

  const w5CardEditedFields = arr(
    w5Step7.cardEditedFields ?? w5Meta.cardEditedFields
  );

  const w5CardEditedFieldCount =
    typeof w5Step7.cardEditedFieldCount === "number"
      ? w5Step7.cardEditedFieldCount
      : typeof w5Meta.cardEditedFieldCount === "number"
      ? w5Meta.cardEditedFieldCount
      : w5CardEditedFields.length;

  const hasScores = (data.scores ?? []).length > 0;

  const checks: PilotCheckItem[] = [
    {
      id: "world_completion",
      status: missingWorldIds.length === 0 ? "pass" : "fail",
      title:
        locale === "en"
          ? "World completion"
          : locale === "zh-Hant"
          ? "世界完成情況"
          : "世界完成情况",
      detail:
        missingWorldIds.length === 0
          ? locale === "en"
            ? "All five worlds have submissions."
            : locale === "zh-Hant"
            ? "五個世界都有提交記錄。"
            : "五个世界都有提交记录。"
          : `${locale === "en" ? "Missing" : locale === "zh-Hant" ? "缺少" : "缺少"}：${missingWorldIds
              .map((id) => WORLD_META[id]?.title[locale] ?? id)
              .join("；")}`,
    },
    {
      id: "score_coverage",
      status:
        !hasScores || missingCompetenceIds.length > 0 ? "fail" : "pass",
      title:
        locale === "en"
          ? "22-competence score coverage"
          : locale === "zh-Hant"
          ? "22 項能力評分覆蓋"
          : "22 项能力评分覆盖",
      detail:
        !hasScores
          ? locale === "en"
            ? "No score results found. Click re-score before checking pilot readiness."
            : locale === "zh-Hant"
            ? "暫未找到評分結果。請先點擊重新評分。"
            : "暂未找到评分结果。请先点击重新评分。"
          : missingCompetenceIds.length === 0
          ? locale === "en"
            ? "All 22 competences have profile evidence."
            : locale === "zh-Hant"
            ? "22 項能力都有進入畫像的證據。"
            : "22 项能力都有进入画像的证据。"
          : `${locale === "en" ? "Missing" : locale === "zh-Hant" ? "缺少" : "缺少"}：${missingCompetenceIds
              .map((id) => competenceTitle(id, locale))
              .join("；")}`,
    },
    {
      id: "teacher_review",
      status: pendingTeacherReviews.length ? "warn" : "pass",
      title:
        locale === "en"
          ? "Teacher-light review"
          : locale === "zh-Hant"
          ? "教師輕量確認"
          : "教师轻量确认",
      detail:
        pendingTeacherReviews.length === 0
          ? locale === "en"
            ? "No required teacher-light review is pending."
            : locale === "zh-Hant"
            ? "目前沒有待確認的教師輕量評分。"
            : "目前没有待确认的教师轻量评分。"
          : `${locale === "en" ? "Pending" : locale === "zh-Hant" ? "待確認" : "待确认"}：${pendingTeacherReviews
              .map((target) => target.title[locale])
              .join("；")}`,
    },
    {
  id: "w5_auto_card",
  status:
    !w5Submission || !w5CardDraftAutoFilled
      ? "warn"
      : w5CardEditedFieldCount >= 2
      ? "pass"
      : "warn",
  title:
    locale === "en"
      ? "W5 reminder card draft and revision"
      : locale === "zh-Hant"
      ? "W5 分類提醒卡草稿與修改"
      : "W5 分类提醒卡草稿与修改",
  detail: !w5Submission
    ? locale === "en"
      ? "W5 submission is missing."
      : locale === "zh-Hant"
      ? "缺少 W5 提交。"
      : "缺少 W5 提交。"
    : !w5CardDraftAutoFilled
    ? locale === "en"
      ? "The report did not record an auto-drafted reminder card. Check whether W5 final-card fields were saved."
      : locale === "zh-Hant"
      ? "報告未記錄分類提醒卡自動草稿。請檢查 W5 最終卡片欄位是否保存。"
      : "报告未记录分类提醒卡自动草稿。请检查 W5 最终卡片字段是否保存。"
    : `${locale === "en" ? "Edited fields" : locale === "zh-Hant" ? "學生修改欄位數" : "学生修改字段数"}：${w5CardEditedFieldCount}${
        w5CardEditedFields.length
          ? `(${w5CardEditedFields.map((id) => label(id, locale)).join("；")}）`
          : ""
      }`,
},
  ];

  const failCount = checks.filter((item) => item.status === "fail").length;
  const warnCount = checks.filter((item) => item.status === "warn").length;

  const overallStatus: PilotCheckStatus =
    failCount > 0 ? "fail" : warnCount > 0 ? "warn" : "pass";

  return (
    <Card className="mb-6 p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {locale === "en"
              ? "Pilot Readiness Check"
              : locale === "zh-Hant"
              ? "試行前檢查"
              : "试行前检查"}
          </h2>
          <p className="mt-1 text-sm leading-7 text-slate-500">
  {locale === "en"
    ? "Use this section after a complete student run and re-scoring. It checks submissions, 22-competence evidence, teacher-light review, and W5 reminder-card draft/revision status."
    : locale === "zh-Hant"
    ? "請在學生完整完成並重新評分後查看。這裡檢查提交記錄、22 項能力證據、教師輕量確認，以及 W5 分類提醒卡草稿與修改情況。"
    : "请在学生完整完成并重新评分后查看。这里检查提交记录、22 项能力证据、教师轻量确认，以及 W5 分类提醒卡草稿与修改情况。"}
</p>
        </div>

        <span
          className={cn(
            "inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold",
            pilotStatusClass(overallStatus)
          )}
        >
          {pilotStatusLabel(overallStatus, locale)}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {checks.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl border p-4",
              pilotStatusClass(item.status)
            )}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="font-semibold">{item.title}</div>
              <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-semibold">
                {pilotStatusLabel(item.status, locale)}
              </span>
            </div>
            <div className="text-sm leading-7">{item.detail}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
function firstNonEmptyText(...values: any[]) {
  for (const value of values) {
    const text = str(value).trim();
    if (text) return text;
  }
  return "";
}
function formatWork(data: SessionDetailResponse, target: RatingTarget, locale: TeacherLocale) {
  const u = UI[locale];
  const submission = getSubmission(data, target.worldId);
  const meta = safeJson(submission?.selfCheckJson);
  if (!submission && target.worldId !== "w3") return <InfoBlock title={u.studentWork} value={u.noSubmission} />;
  if (target.worldId === "w1") return <div className="space-y-3"><InfoBlock title={u.benefit} value={textOrDash(meta.good, locale)} /><InfoBlock title={u.warning} value={textOrDash(meta.warning, locale)} /></div>;
  if (target.worldId === "w2") return <InfoBlock title={u.finalReason} value={textOrDash(submission?.content, locale)} />;
  if (target.worldId === "w3") {
  const s1 = getResponse(data, "w3_step1");
  const s2 = getResponse(data, "w3_step2");
  const s3 = getResponse(data, "w3_step3");
  const s4 = getResponse(data, "w3_step4");
  const s5 = getResponse(data, "w3_step5");
  const s7 = getResponse(data, "w3_step7");

  const chatTurns = (data.chats ?? []).filter(
    (turn: any) => turn.worldId === "w3"
  );
  const studentTurns = chatTurns.filter(
    (turn: any) => turn.role === "user" || turn.role === "student"
  );
  const aiTurns = chatTurns.filter((turn: any) => turn.role === "ai");

  const latestStudentPrompt =
  studentTurns.length > 0
    ? firstNonEmptyText(
        studentTurns[studentTurns.length - 1]?.content,
        studentTurns[studentTurns.length - 1]?.text,
        studentTurns[studentTurns.length - 1]?.message
      )
    : "";

const latestAiReply =
  aiTurns.length > 0
    ? firstNonEmptyText(
        aiTurns[aiTurns.length - 1]?.content,
        aiTurns[aiTurns.length - 1]?.text,
        aiTurns[aiTurns.length - 1]?.message
      )
    : "";
  const systemSampleDraft = str(s2.systemSampleDraft ?? meta.systemSampleDraft);
  const studentDraft = str(
    s2.firstDraftText ?? s2.draft ?? meta.firstDraftText ?? meta.draft
  );

  const studentUsedSystemSample = Boolean(
    s2.studentUsedSystemSample ??
      meta.studentUsedSystemSample ??
      (!!systemSampleDraft && studentDraft.trim() === systemSampleDraft.trim())
  );

  const promptText = firstNonEmptyText(
  s3.visibleUserMessage,
  s3.promptText,
  s3.rawPromptText,
  s3.prompt,
  meta.visibleUserMessage,
  meta.promptText,
  meta.rawPromptText,
  latestStudentPrompt
);

const aiReply = firstNonEmptyText(
  s3.aiReply,
  s3.rewritten,
  s3.aiRewritten,
  s3.aiText,
  meta.aiReply,
  meta.aiText,
  latestAiReply
);

  const finalText = str(
    s7.finalText ?? s4.finalText ?? submission?.content ?? meta.finalText
  );

  const recipientId = str(
    s1.recipientId ?? s1.recipient ?? s2.recipient ?? meta.recipientId
  );

  const formatId = str(
    s4.selectedFormatId ??
      s4.presentationFormat ??
      meta.selectedFormatId ??
      meta.presentationFormat ??
      "text_card"
  );

  const selectedDesignElementIdsRaw = arr(
    s4.selectedDesignElementIds ?? meta.selectedDesignElementIds
  );

  const selectedDesignElementIds =
    selectedDesignElementIdsRaw.length > 0
      ? selectedDesignElementIdsRaw
      : ["own_sentence"];

  const assetAllocation = safeJson(
  s5.assetAllocation ??
    s5.w3AssetAllocation ??
    s5.assetAllocationJson ??
    meta.assetAllocation ??
    meta.w3AssetAllocation
);

  const explicitCreditNotes = arr(
    s7.creditNotes ?? s5.creditNotes ?? meta.creditNotes
  );

  const derivedCreditNotes: string[] = [];

const assetValue = (...ids: string[]) => {
  for (const id of ids) {
    const value = assetAllocation[id];
    if (value) return String(value);
  }
  return "";
};

const ownSentenceValue = assetValue("own_sentence");
const aiImageValue = assetValue(
  "ai_background_image",
  "ai_generated_background",
  "ai_image"
);
const freeIconValue = assetValue(
  "free_source_icon",
  "free_icon",
  "free_icon_with_source"
);
const personImageValue = assetValue(
  "ai_person_image",
  "realistic_elder_photo",
  "ai_generated_person"
);
const unknownCartoonValue = assetValue("web_cartoon_unknown_source");
const classmatePhotoValue = assetValue("classmate_photo_without_permission");

if (ownSentenceValue === "use" || ownSentenceValue === "credit") {
  derivedCreditNotes.push(
    locale === "en"
      ? "Text: the card keeps the student's own idea or wording."
      : locale === "zh-Hant"
      ? "文字：卡片保留了學生自己的想法或說法。"
      : "文字：卡片保留了学生自己的想法或说法。"
  );
}

if (aiImageValue === "credit") {
  derivedCreditNotes.push(
    locale === "en"
      ? "Image: AI-generated visual was used and checked."
      : locale === "zh-Hant"
      ? "圖片：使用了 AI 生成視覺素材，並已檢查。"
      : "图片：使用了 AI 生成视觉素材，并已检查。"
  );
}

if (freeIconValue === "credit") {
  derivedCreditNotes.push(
    locale === "en"
      ? "Icon: free-to-use icon with source noted."
      : locale === "zh-Hant"
      ? "圖標：使用可授權素材，並註明來源。"
      : "图标：使用可授权素材，并注明来源。"
  );
}

if (personImageValue === "credit") {
  derivedCreditNotes.push(
    locale === "en"
      ? "Person image: AI-generated person image, not a real photo."
      : locale === "zh-Hant"
      ? "人物圖：AI 生成，並非真實人物照片。"
      : "人物图：AI 生成，并非真实人物照片。"
  );
}

if (unknownCartoonValue === "avoid") {
  derivedCreditNotes.push(
    locale === "en"
      ? "Not used: online cartoon image with unclear source."
      : locale === "zh-Hant"
      ? "未使用：來源不明的網絡卡通圖。"
      : "未使用：来源不明的网络卡通图。"
  );
}

if (classmatePhotoValue === "avoid") {
  derivedCreditNotes.push(
    locale === "en"
      ? "Not used: classmate photo without permission."
      : locale === "zh-Hant"
      ? "未使用：未經同意的同學照片。"
      : "未使用：未经同意的同学照片。"
  );
}
  const teacherCreditNotes =
    explicitCreditNotes.length > 0 ? explicitCreditNotes : derivedCreditNotes;

  return (
    <div className="space-y-3">
      {systemSampleDraft ? (
        <InfoBlock
          title={
            locale === "en"
              ? "System sample draft"
              : locale === "zh-Hant"
              ? "系統示例初稿"
              : "系统示例初稿"
          }
          value={
            <div className="space-y-2">
              <div>{systemSampleDraft}</div>
              {studentUsedSystemSample ? (
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {locale === "en"
                    ? "Student used this sample as a starting point"
                    : locale === "zh-Hant"
                    ? "學生使用了系統示例作為初稿"
                    : "学生使用了系统示例作为初稿"}
                </span>
              ) : null}
            </div>
          }
        />
      ) : null}

      <InfoBlock
        title={
          locale === "en"
            ? "Student first draft"
            : locale === "zh-Hant"
            ? "學生初稿"
            : "学生初稿"
        }
        value={textOrDash(studentDraft, locale)}
      />

      <InfoBlock
        title={
          locale === "en"
            ? "Student request to AI"
            : locale === "zh-Hant"
            ? "學生給 AI 的修改要求"
            : "学生给 AI 的修改要求"
        }
        value={textOrDash(promptText, locale)}
      />

      <InfoBlock
        title={
          locale === "en"
            ? "AI reply"
            : locale === "zh-Hant"
            ? "AI 回覆"
            : "AI 回复"
        }
        value={textOrDash(aiReply, locale)}
      />

      <W3CardPreviewShared
        title={u.finalCard}
        text={finalText}
        locale={locale}
        formatId={formatId}
        selectedDesignElementIds={selectedDesignElementIds}
        recipientId={recipientId}
        creditNotes={teacherCreditNotes}
        forceShowText
      />
    </div>
  );
}
    if (target.worldId === "w5") {
    const s7 = getResponse(data, "w5_step7");
    const cardEditedFields = arr(s7.cardEditedFields ?? meta.cardEditedFields);
    const cardDraftAutoFilled = Boolean(
      s7.cardDraftAutoFilled ?? meta.cardDraftAutoFilled
    );
    const cardEditedFieldCount =
      typeof s7.cardEditedFieldCount === "number"
        ? s7.cardEditedFieldCount
        : typeof meta.cardEditedFieldCount === "number"
        ? meta.cardEditedFieldCount
        : cardEditedFields.length;

    return (
      <div className="space-y-3">
        <InfoBlock
          title={
            locale === "en"
              ? "Draft / edit status"
              : locale === "zh-Hant"
              ? "草稿與修改狀態"
              : "草稿与修改状态"
          }
          value={
            <div className="space-y-1">
              <div>
                {locale === "en"
                  ? "Auto-drafted from previous choices"
                  : locale === "zh-Hant"
                  ? "是否根據前面選擇自動整理草稿"
                  : "是否根据前面选择自动整理草稿"}
                ：
                {cardDraftAutoFilled
                  ? locale === "en"
                    ? "Yes"
                    : "是"
                  : locale === "en"
                  ? "No"
                  : "否"}
              </div>
              <div>
                {locale === "en"
                  ? "Edited fields"
                  : locale === "zh-Hant"
                  ? "學生修改欄位"
                  : "学生修改字段"}
                ：
                {cardEditedFieldCount}
                {cardEditedFields.length
  ? `（${cardEditedFields.map((id) => label(id, locale)).join("；")}）`
  : ""}
                </div>
            </div>
          }
        />

        <InfoBlock title={u.purpose} value={textOrDash(s7.purpose ?? meta.purpose, locale)} />
        <InfoBlock title={u.intendedUsers} value={textOrDash(s7.intendedUsers ?? meta.intendedUsers, locale)} />
        <InfoBlock title={u.trainingData} value={textOrDash(s7.trainingData ?? meta.trainingData, locale)} />
        <InfoBlock title={u.limits} value={textOrDash(s7.limits ?? meta.limits, locale)} />
        <InfoBlock title={u.humanCheck} value={textOrDash(s7.humanCheck ?? meta.humanCheck, locale)} />
        <InfoBlock title={u.reminder} value={textOrDash(s7.reminder ?? meta.reminder, locale)} />
        <InfoBlock title={u.improve} value={textOrDash(s7.improve ?? meta.improve, locale)} />
      </div>
    );
  }
  return <InfoBlock title={u.studentWork} value={textOrDash(submission?.content, locale)} />;
}
function buildCompetenceMap(scores: any[]) { const map = new Map<string, any[]>(); for (const row of scores || []) { const json = safeJson(row.evidenceJson); if (json.includeInCompetenceProfile === false) continue; const list = map.get(row.competenceId) ?? []; list.push(row); map.set(row.competenceId, list); } return map; }
function scoreForRows(rows: any[]) { if (!rows.length) return null; return rows.reduce((sum, row) => sum + Number(row.score ?? 0), 0) / rows.length; }
function buildDomainScores(scores: any[]) {
  const competenceMap = buildCompetenceMap(scores);
  return DOMAIN_ORDER.map((key) => {
    const values = COMPETENCE_ORDER[key].map((code) => scoreForRows(competenceMap.get(code) ?? [])).filter((x): x is number => typeof x === "number");
    return { key, average: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null };
  });
}
function sourceWorld(rows: any[], locale: TeacherLocale) { const worlds = Array.from(new Set(rows.map((r) => r.worldId).filter(Boolean))); return worlds.length ? worlds.map((w) => WORLD_META[w]?.title[locale] ?? w).join("；") : UI[locale].noEvidence; }
function actionFor(rows: any[], locale: TeacherLocale) { const u = UI[locale]; if (!rows.length) return u.noEvidence; const teacher = rows.find((row) => safeJson(row.evidenceJson).scoringSource === "teacher_light"); if (!teacher) return u.actionNone; const status = safeJson(teacher.evidenceJson).reviewStatus; if (status === "reviewed") return u.actionReviewed; return u.actionReview; }
function processEvidence(
  data: SessionDetailResponse,
  worldId: string,
  locale: TeacherLocale
): ProcessEvidenceItem[] {
  return buildProcessEvidence(data, worldId, locale);
}

export default function TeacherSessionDetailClient({ sessionId }: { sessionId: string }) {
  const [locale, setLocale] = useState<TeacherLocale>("zh-Hans");
  const u = UI[locale];
  const [data, setData] = useState<SessionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number | undefined>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  
  useEffect(() => setLocale(getInitialLocale()), []);
  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/teacher/session/${sessionId}`, { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/teacher/login"; return; }
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : u.loadFailed);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(); }, [sessionId]);

  const domainScores = useMemo(() => buildDomainScores(data?.scores ?? []), [data]);
  const competenceMap = useMemo(() => buildCompetenceMap(data?.scores ?? []), [data]);

  async function saveRating(target: RatingTarget) {
    if (!data) return;
    const selected = scores[target.productKey];
    if (typeof selected !== "number") return;
    try {
      setSaving(target.productKey);
      setSaved(null);
      const res = await fetch("/api/teacher/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productKey: target.productKey, worldId: target.worldId, competenceIds: target.competenceIds, score: selected, comment: comments[target.productKey] ?? "" }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to save");
      await load();
      setSaved(target.productKey);
    } finally {
      setSaving(null);
    }
  }

  async function logout() { await fetch("/api/teacher/logout", { method: "POST" }); window.location.href = "/teacher/login"; }

  if (loading) return <main className="min-h-screen bg-slate-50 p-8"><Card className="p-6 text-sm text-slate-600">{u.loading}</Card></main>;
  if (error || !data) return <main className="min-h-screen bg-slate-50 p-8"><Card className="p-6 text-sm text-rose-600">{u.loadFailed}: {error}</Card></main>;

  return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-7xl px-6 py-8">
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
  <div className="min-w-0">
    <div className="text-sm font-medium text-slate-500">{u.portal}</div>

    <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        {u.title}
      </h1>

      <ReScoreSessionButton sessionId={sessionId} />
    </div>

    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
      {u.note}
    </p>
  </div>

  <div className="flex items-center gap-3">
    <LanguageSwitch locale={locale} setLocale={setLocale} />
    <button
      onClick={logout}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
    >
      {u.logout}
    </button>
  </div>
</header>
<PilotReadinessCard
  data={data}
  competenceMap={competenceMap}
  locale={locale}
/>
    <div className="space-y-6">
      <Card className="p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold text-slate-900">{u.basic}</h2><Link href="/teacher" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">{u.back}</Link></div><div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5"><InfoBlock title={u.student} value={textOrDash(data.session.studentName, locale)} /><InfoBlock title={u.studentId} value={textOrDash(data.session.studentCode, locale)} /><InfoBlock title={u.className} value={textOrDash(data.session.className, locale)} /><InfoBlock title={u.language} value={languageLabel(data.session.language, locale)} /><InfoBlock title={u.status} value={statusLabel(data.session.status, locale)} />{(data.session.finishedAt || data.session.endedAt) ? <InfoBlock title={u.finishedAt} value={formatDate(data.session.finishedAt ?? data.session.endedAt, locale)} /> : null}</div></Card>

      <Card className="p-6"><h2 className="text-xl font-semibold text-slate-900">{u.domain}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{u.domainNote}</p><div className="mt-5 grid gap-4 lg:grid-cols-2">{domainScores.map((item) => <div key={item.key} className="rounded-3xl border border-slate-200 p-4"><div className="mb-3 flex items-start justify-between gap-4"><div><h3 className="font-semibold text-slate-900">{domainLabel(item.key, locale)}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{DOMAIN_META[item.key].meaning[locale]}</p></div><div className="shrink-0 text-sm font-semibold text-slate-900">{item.average == null ? "—" : `${item.average.toFixed(2)} / 3.00`}</div></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-900" style={{ width: `${scorePct(item.average)}%` }} /></div><p className="mt-3 text-sm leading-6 text-slate-600"><span className="font-medium text-slate-800">{u.teachingFocus}：</span>{DOMAIN_META[item.key].focus[locale]}</p></div>)}</div></Card>

      <Card className="p-6"><h2 className="text-xl font-semibold text-slate-900">{u.review}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{u.reviewNote}</p><div className="mt-5 space-y-5">{RATING_TARGETS.map((target) => { const submission = getSubmission(data, target.worldId); if (!submission && target.worldId !== "w3") return null; const current = findRating(data, target.productKey); const selected = scores[target.productKey] ?? current?.score; return <div key={target.productKey} className="rounded-3xl border border-slate-200 p-5"><div className="mb-4 flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">{WORLD_META[target.worldId]?.title[locale] ?? target.worldId}</span>{target.competenceIds.map((id) => <span key={id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{competenceTitle(id, locale)}</span>)}</div><h3 className="text-lg font-semibold text-slate-900">{target.title[locale]}</h3><p className="mt-2 text-sm leading-7 text-slate-600"><span className="font-medium text-slate-800">{u.whatCheck}</span> {target.check[locale]}</p><div className="mt-4"><h4 className="mb-2 text-sm font-medium text-slate-900">{u.studentWork}</h4>{formatWork(data, target, locale)}</div><div className="mt-4 rounded-2xl bg-slate-50 p-4"><h4 className="mb-2 text-sm font-medium text-slate-900">{u.rubric}</h4><div className="grid gap-2 md:grid-cols-4">{target.rubric[locale].map((text, i) => <button key={i} type="button" onClick={() => setScores((prev) => ({ ...prev, [target.productKey]: i }))} className={cn("rounded-2xl border p-3 text-left text-sm leading-6 transition", selected === i ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100")}><div className="font-semibold">{i}</div><div>{text}</div></button>)}</div><textarea value={comments[target.productKey] ?? current?.comment ?? ""} onChange={(e) => setComments((prev) => ({ ...prev, [target.productKey]: e.target.value }))} placeholder={u.comment} className="mt-4 min-h-[80px] w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-400" /><div className="mt-3 flex items-center gap-3"><button disabled={typeof selected !== "number" || saving === target.productKey} onClick={() => saveRating(target)} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-40">{saving === target.productKey ? u.saving : u.save}</button>{saved === target.productKey ? <span className="text-sm text-emerald-700">{u.saved}</span> : null}</div></div></div>; })}</div></Card>

      <Card className="p-6"><h2 className="text-xl font-semibold text-slate-900">{u.competence}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{u.competenceNote}</p><div className="mt-5 space-y-6">{DOMAIN_ORDER.map((domain) => <div key={domain}><h3 className="mb-3 text-lg font-semibold text-slate-900">{domainLabel(domain, locale)}</h3><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{COMPETENCE_ORDER[domain].map((code) => { const rows = competenceMap.get(code) ?? []; const score = scoreForRows(rows); return <div key={code} className="rounded-3xl border border-slate-200 p-4"><div className="font-semibold text-slate-900">{competenceTitle(code, locale)}</div><p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">{COMPETENCE_META[code].meaning[locale]}</p><div className="mt-3 flex items-center justify-between text-sm"><span className="text-slate-500">{u.score}</span><span className="font-semibold text-slate-900">{score == null ? u.noEvidence : `${score.toFixed(2)} / 3.00`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-900" style={{ width: `${scorePct(score)}%` }} /></div><div className="mt-3 text-xs leading-6 text-slate-500">{u.mainTask}: {sourceWorld(rows, locale)}</div><div className="text-xs leading-6 text-slate-500">{u.teacherAction}: {actionFor(rows, locale)}</div></div>; })}</div></div>)}</div></Card>

      <Card className="p-6">
  <h2 className="text-xl font-semibold text-slate-900">{u.mission}</h2>
  <p className="mt-2 text-sm leading-7 text-slate-600">{u.missionNote}</p>

  <div className="mt-5 space-y-4">
    {Object.entries(WORLD_META).map(([worldId, meta]) => (
      <details
        key={worldId}
        className="rounded-3xl border border-slate-200 p-4"
      >
        <summary className="cursor-pointer font-semibold text-slate-900">
          {meta.title[locale]}
        </summary>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.75fr_1.65fr]">
          <div className="space-y-3">
            <InfoBlock title={u.role} value={meta.role[locale]} />
            <InfoBlock title={u.goal} value={meta.goal[locale]} />
          </div>

          <ProcessEvidenceList
  title={u.keyEvidence}
  items={processEvidence(data, worldId, locale)}
  locale={locale}
/>
        </div>
      </details>
    ))}
  </div>
</Card>

    </div>
  </div></main>;
}
