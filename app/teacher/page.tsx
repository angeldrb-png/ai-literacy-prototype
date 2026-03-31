"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type OverviewResponse = {
  ok: boolean;
  summary: { sessionCount: number; completedCount: number };
  recentSessions: Array<{
    id: string;
    sessionCode: string;
    language: string;
    startedAt: string;
    finishedAt: string | null;
    currentWorld: string | null;
    status: string;
    studentName?: string | null;
    studentCode?: string | null;
    className?: string | null;
    schoolName?: string | null;
    gradeLevel?: string | null;
  }>;
  averageScores: Array<{ domainId: string; _avg: { score: number | null } }>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}
function DomainBadge({ domain }: { domain: string }) {
  const cls =
    domain === "Engaging with AI"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : domain === "Creating with AI"
      ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
      : domain === "Managing AI"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", cls)}>{domain}</span>;
}
function languageLabel(language: string) {
  if (language === "zh-Hans") return "简体中文";
  if (language === "zh-Hant") return "繁體中文";
  if (language === "en") return "English";
  return language;
}

export default function TeacherOverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/teacher/overview", { method: "GET", cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load teacher overview");
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load teacher overview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const completionRate = useMemo(() => {
    if (!data || !data.summary.sessionCount) return 0;
    return Math.round((data.summary.completedCount / data.summary.sessionCount) * 100);
  }, [data]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">教师端</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">AI校园任务站 · 教师总览</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              这里先显示对导师真正有用的内容：学生身份、完成状态，以及各 domain 平均分。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
              返回学生端
            </Link>
          </div>
        </div>

        {loading ? (
          <Card className="p-6 text-sm text-slate-600">正在加载教师端总览…</Card>
        ) : error ? (
          <Card className="p-6 text-sm text-rose-600">加载失败：{error}</Card>
        ) : data ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <Card className="p-5"><div className="text-sm text-slate-500">总会话数</div><div className="mt-2 text-3xl font-semibold text-slate-900">{data.summary.sessionCount}</div></Card>
              <Card className="p-5"><div className="text-sm text-slate-500">已完成会话数</div><div className="mt-2 text-3xl font-semibold text-slate-900">{data.summary.completedCount}</div></Card>
              <Card className="p-5"><div className="text-sm text-slate-500">完成率</div><div className="mt-2 text-3xl font-semibold text-slate-900">{completionRate}%</div></Card>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              <Card className="p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">最近学生记录</h2>
                  <p className="mt-1 text-sm text-slate-500">这里先按“学生是谁、是否完成、是否可点进详情”来展示，不再先给一堆原始代码块。</p>
                </div>

                {data.recentSessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">目前还没有会话数据。</div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            <th className="px-4 py-3 font-medium">学生</th>
                            <th className="px-4 py-3 font-medium">学号</th>
                            <th className="px-4 py-3 font-medium">班级</th>
                            <th className="px-4 py-3 font-medium">语言</th>
                            <th className="px-4 py-3 font-medium">状态</th>
                            <th className="px-4 py-3 font-medium">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentSessions.map((session) => (
                            <tr key={session.id} className="border-t border-slate-200 bg-white">
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-900">{session.studentName ?? "—"}</div>
                                <div className="text-xs text-slate-500">{session.sessionCode}</div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">{session.studentCode ?? "—"}</td>
                              <td className="px-4 py-3 text-slate-600">{session.className ?? "—"}</td>
                              <td className="px-4 py-3 text-slate-600">{languageLabel(session.language)}</td>
                              <td className="px-4 py-3">
                                <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", session.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                                  {session.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Link href={`/teacher/session/${session.id}`} className="text-sm font-medium text-sky-700 hover:text-sky-800">查看详情</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-5">
                <h2 className="text-lg font-semibold text-slate-900">各 Domain 平均分</h2>
                <div className="mt-5 space-y-4">
                  {data.averageScores.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">目前还没有评分数据。</div>
                  ) : (
                    data.averageScores.map((item) => {
                      const value = item._avg.score ?? 0;
                      const progress = Math.max(0, Math.min(100, (value / 3) * 100));
                      return (
                        <div key={item.domainId} className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <DomainBadge domain={item.domainId} />
                            <div className="text-sm font-medium text-slate-700">{value.toFixed(2)} / 3.00</div>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-slate-900" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
