"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DOMAIN_META, DOMAIN_ORDER, type DomainKey, type TeacherLocale, domainLabel, normalizeDomainId } from "./teacher-report-meta";

type OverviewResponse = { ok: boolean; sessions?: any[]; recentSessions?: any[]; domainAverages?: any[]; domainScores?: any[]; averages?: any[] };

const UI: Record<TeacherLocale, any> = {
  "zh-Hans": {
    portal: "Teacher Portal", title: "教师端", note: "查看学生完成情况、班级 AI 素养概览，并进入学生个人报告。", logout: "退出登录", loading: "正在加载教师端……", loadFailed: "加载失败",
    summary: "班级概览", completed: "已完成", inProgress: "进行中", reviewHintTitle: "待教师确认", reviewHint: "进入学生报告后，系统会提示哪些开放作品需要教师确认。",
    profile: "班级 AI 素养概览", profileNote: "基于已完成学生的任务表现，用于教学参考，不作为最终成绩。", records: "学生记录", recordsNote: "点击“查看报告”进入学生个人 AI 素养形成性报告。",
    student: "学生", studentId: "学号", className: "班级", language: "语言", status: "状态", action: "操作", view: "查看报告", noRecords: "暂无学生记录。", included: "名学生记录", zhHans: "简", zhHant: "繁", en: "EN",
  },
  "zh-Hant": {
    portal: "Teacher Portal", title: "教師端", note: "查看學生完成情況、班級 AI 素養概覽，並進入學生個人報告。", logout: "退出登入", loading: "正在載入教師端……", loadFailed: "載入失敗",
    summary: "班級概覽", completed: "已完成", inProgress: "進行中", reviewHintTitle: "待教師確認", reviewHint: "進入學生報告後，系統會提示哪些開放作品需要教師確認。",
    profile: "班級 AI 素養概覽", profileNote: "基於已完成學生的任務表現，用於教學參考，不作為最終成績。", records: "學生記錄", recordsNote: "點擊「查看報告」進入學生個人 AI 素養形成性報告。",
    student: "學生", studentId: "學號", className: "班級", language: "語言", status: "狀態", action: "操作", view: "查看報告", noRecords: "暫無學生記錄。", included: "名學生記錄", zhHans: "简", zhHant: "繁", en: "EN",
  },
  en: {
    portal: "Teacher Portal", title: "Teacher Portal", note: "Review student completion, class AI literacy overview, and individual formative reports.", logout: "Log out", loading: "Loading teacher portal...", loadFailed: "Failed to load",
    summary: "Class overview", completed: "Completed", inProgress: "In progress", reviewHintTitle: "Teacher review", reviewHint: "Open a student report to see which open-ended products need teacher confirmation.",
    profile: "Class AI Literacy Overview", profileNote: "Based on completed students' task performance. For teaching reference, not a final grade.", records: "Student records", recordsNote: "Click “View report” to open the student formative AI literacy report.",
    student: "Student", studentId: "Student ID", className: "Class", language: "Language", status: "Status", action: "Action", view: "View report", noRecords: "No student records yet.", included: "student records", zhHans: "简", zhHant: "繁", en: "EN",
  },
};

function cn(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(" "); }
function Card({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>{children}</section>; }
function scorePct(score: number | null | undefined) { return Math.max(0, Math.min(100, ((Number(score) || 0) / 3) * 100)); }
function getInitialLocale(): TeacherLocale { if (typeof window === "undefined") return "zh-Hans"; const saved = window.localStorage.getItem("teacher_locale"); return saved === "zh-Hant" || saved === "en" || saved === "zh-Hans" ? saved : "zh-Hans"; }
function LanguageSwitch({ locale, setLocale }: { locale: TeacherLocale; setLocale: (l: TeacherLocale) => void }) { const u = UI[locale]; const items: Array<[TeacherLocale, string]> = [["zh-Hans", u.zhHans], ["zh-Hant", u.zhHant], ["en", u.en]]; return <div className="flex gap-2">{items.map(([key, label]) => <button key={key} type="button" onClick={() => { window.localStorage.setItem("teacher_locale", key); setLocale(key); }} className={cn("h-11 min-w-11 rounded-full border px-3 text-sm font-medium transition", locale === key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}>{label}</button>)}</div>; }
function languageLabel(language: string | null | undefined, locale: TeacherLocale) { if (language === "zh-Hans") return locale === "zh-Hant" ? "簡體中文" : "简体中文"; if (language === "zh-Hant") return "繁體中文"; if (language === "en") return "English"; return language || "—"; }
function statusLabel(status: string | null | undefined, locale: TeacherLocale) { if (status === "completed") return UI[locale].completed; if (status === "in_progress") return UI[locale].inProgress; return status || "—"; }
function statusClass(status: string) { return status === "completed" ? "bg-emerald-50 text-emerald-700" : status === "in_progress" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"; }

function normalizeAverageRows(rows: any[]) {
  const map = new Map<DomainKey, { weighted: number; count: number }>();
  for (const row of rows || []) {
    const key = normalizeDomainId(row.domainId ?? row.domain ?? row.name ?? row.label);
    if (key === "unknown") continue;
    const score = Number(row.average ?? row.avg ?? row.score ?? row.value ?? 0);
    const count = Math.max(1, Number(row.count ?? row.n ?? 1));
    const cur = map.get(key) ?? { weighted: 0, count: 0 };
    cur.weighted += score * count; cur.count += count; map.set(key, cur);
  }
  return DOMAIN_ORDER.map((key) => { const item = map.get(key); return { key, average: item && item.count ? item.weighted / item.count : null, count: item?.count ?? 0 }; });
}

export default function TeacherOverviewClient() {
  const [locale, setLocale] = useState<TeacherLocale>("zh-Hans");
  const u = UI[locale];
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => setLocale(getInitialLocale()), []);
  useEffect(() => { let cancelled = false; async function load() { try { setLoading(true); setError(""); const res = await fetch("/api/teacher/overview", { cache: "no-store" }); if (res.status === 401) { window.location.href = "/teacher/login"; return; } const json = await res.json(); if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load"); if (!cancelled) setData(json); } catch (err) { if (!cancelled) setError(err instanceof Error ? err.message : u.loadFailed); } finally { if (!cancelled) setLoading(false); } } load(); return () => { cancelled = true; }; }, [u.loadFailed]);

  const sessions = useMemo(() => data?.sessions ?? data?.recentSessions ?? [], [data]);
  const completed = sessions.filter((s) => s.status === "completed").length;
  const inProgress = sessions.filter((s) => s.status === "in_progress").length;
  const averages = useMemo(() => normalizeAverageRows(data?.domainAverages ?? data?.domainScores ?? data?.averages ?? []), [data]);
  async function logout() { await fetch("/api/teacher/logout", { method: "POST" }); window.location.href = "/teacher/login"; }

  return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-7xl px-6 py-8">
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="text-sm font-medium text-slate-500">{u.portal}</div><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{u.title}</h1><p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{u.note}</p></div><div className="flex items-center gap-3"><LanguageSwitch locale={locale} setLocale={setLocale} /><button onClick={logout} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">{u.logout}</button></div></header>
    {loading ? <Card className="p-6 text-sm text-slate-600">{u.loading}</Card> : error ? <Card className="p-6 text-sm text-rose-600">{u.loadFailed}: {error}</Card> : <div className="space-y-6">
      <Card className="p-6"><h2 className="text-xl font-semibold text-slate-900">{u.summary}</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">{u.completed}</div><div className="mt-2 text-3xl font-semibold text-slate-900">{completed}</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">{u.inProgress}</div><div className="mt-2 text-3xl font-semibold text-slate-900">{inProgress}</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">{u.reviewHintTitle}</div><p className="mt-2 text-sm leading-7 text-slate-700">{u.reviewHint}</p></div></div></Card>
      <Card className="p-6"><h2 className="text-xl font-semibold text-slate-900">{u.profile}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{u.profileNote}</p><div className="mt-5 grid gap-4 lg:grid-cols-2">{averages.map((item) => <div key={item.key} className="rounded-3xl border border-slate-200 p-4"><div className="mb-3 flex items-start justify-between gap-4"><div><h3 className="font-semibold text-slate-900">{domainLabel(item.key, locale)}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{DOMAIN_META[item.key].meaning[locale]}</p></div><div className="shrink-0 text-sm font-semibold text-slate-900">{item.average == null ? "—" : `${item.average.toFixed(2)} / 3.00`}</div></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-900" style={{ width: `${scorePct(item.average)}%` }} /></div><div className="mt-3 text-xs text-slate-500">{item.count} {u.included}</div></div>)}</div></Card>
      <Card className="p-6"><h2 className="text-xl font-semibold text-slate-900">{u.records}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{u.recordsNote}</p><div className="mt-5 overflow-hidden rounded-3xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-5 py-3 font-medium">{u.student}</th><th className="px-5 py-3 font-medium">{u.studentId}</th><th className="px-5 py-3 font-medium">{u.className}</th><th className="px-5 py-3 font-medium">{u.language}</th><th className="px-5 py-3 font-medium">{u.status}</th><th className="px-5 py-3 font-medium">{u.action}</th></tr></thead><tbody className="divide-y divide-slate-200 bg-white">{sessions.length ? sessions.map((s) => <tr key={s.id}><td className="px-5 py-4"><div className="font-medium text-slate-900">{s.studentName ?? "—"}</div></td><td className="px-5 py-4 text-slate-700">{s.studentCode ?? "—"}</td><td className="px-5 py-4 text-slate-700">{s.className ?? "—"}</td><td className="px-5 py-4 text-slate-700">{languageLabel(s.language, locale)}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(s.status)}`}>{statusLabel(s.status, locale)}</span></td><td className="px-5 py-4"><Link href={`/teacher/session/${s.id}`} className="font-medium text-sky-700 hover:text-sky-900">{u.view}</Link></td></tr>) : <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">{u.noRecords}</td></tr>}</tbody></table></div></Card>
    </div>}
  </div></main>;
}
