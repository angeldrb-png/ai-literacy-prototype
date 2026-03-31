"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SessionDetailResponse = {
  ok: boolean;
  session: any;
  events: Array<any>;
  responses: Array<any>;
  chats: Array<any>;
  submissions: Array<any>;
  scores: Array<any>;
  notes: Array<any>;
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

export default function TeacherSessionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const [sessionId, setSessionId] = useState("");
  const [data, setData] = useState<SessionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function init() {
      const resolved = await params;
      if (active) setSessionId(resolved.sessionId);
    }
    init();
    return () => { active = false; };
  }, [params]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true); setError("");
        const res = await fetch(`/api/teacher/session/${sessionId}`, { method: "GET", cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load session detail");
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load session detail");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [sessionId]);

  const worldCompletion = useMemo(() => {
    if (!data) return [];
    const worlds = ["w1", "w2", "w3", "w4", "w5"];
    return worlds.map((worldId) => ({
      worldId,
      completed: data.submissions.some((item) => item.worldId === worldId),
    }));
  }, [data]);

  const domainAverages = useMemo(() => {
    if (!data) return [];
    const grouped = new Map<string, number[]>();
    data.scores.forEach((item) => {
      const arr = grouped.get(item.domainId) ?? [];
      arr.push(Number(item.score) || 0);
      grouped.set(item.domainId, arr);
    });
    return Array.from(grouped.entries()).map(([domainId, scores]) => ({
      domainId,
      average: scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1),
    }));
  }, [data]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">教师端</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">学生详情</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">这里先呈现导师真正关心的结果，不再直接把一堆原始 JSON 打到页面上。</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/teacher" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">返回教师总览</Link>
            <Link href="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">返回学生端</Link>
          </div>
        </div>

        {loading ? (
          <Card className="p-6 text-sm text-slate-600">正在加载学生详情…</Card>
        ) : error ? (
          <Card className="p-6 text-sm text-rose-600">加载失败：{error}</Card>
        ) : data ? (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4 text-lg font-semibold text-slate-900">学生身份与会话信息</div>
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">姓名</div><div className="mt-2 text-sm font-medium text-slate-900">{data.session.studentName ?? "—"}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">学号</div><div className="mt-2 text-sm font-medium text-slate-900">{data.session.studentCode ?? "—"}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">班级</div><div className="mt-2 text-sm font-medium text-slate-900">{data.session.className ?? "—"}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">学校</div><div className="mt-2 text-sm font-medium text-slate-900">{data.session.schoolName ?? "—"}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">年级</div><div className="mt-2 text-sm font-medium text-slate-900">{data.session.gradeLevel ?? "—"}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">语言</div><div className="mt-2 text-sm font-medium text-slate-900">{languageLabel(data.session.language)}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">状态</div><div className="mt-2 text-sm font-medium text-slate-900">{data.session.status}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">Session Code</div><div className="mt-2 text-sm font-medium text-slate-900">{data.session.sessionCode}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">开始时间</div><div className="mt-2 text-sm font-medium text-slate-900">{formatDate(data.session.startedAt)}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">结束时间</div><div className="mt-2 text-sm font-medium text-slate-900">{formatDate(data.session.finishedAt)}</div></div>
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-6">
                <div className="mb-4 text-lg font-semibold text-slate-900">任务完成情况</div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {worldCompletion.map((item) => (
                    <div key={item.worldId} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                      <div className="font-medium text-slate-900">{item.worldId.toUpperCase()}</div>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-medium", item.completed ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600")}>
                        {item.completed ? "已提交" : "未提交"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-4 text-lg font-semibold text-slate-900">学生的 Domain 表现</div>
                <div className="space-y-4">
                  {domainAverages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">目前还没有评分数据。</div>
                  ) : (
                    domainAverages.map((item) => (
                      <div key={item.domainId} className="rounded-2xl border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <DomainBadge domain={item.domainId} />
                          <div className="text-sm font-medium text-slate-700">{item.average.toFixed(2)} / 3.00</div>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.max(0, Math.min(100, (item.average / 3) * 100))}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="mb-4 text-lg font-semibold text-slate-900">最终提交内容</div>
              {data.submissions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">目前还没有最终提交内容。</div>
              ) : (
                <div className="space-y-4">
                  {data.submissions.map((submission) => (
                    <div key={submission.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">{submission.worldId.toUpperCase()}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{submission.submissionType}</span>
                        <span className="text-xs text-slate-500">{formatDate(submission.submittedAt)}</span>
                      </div>
                      <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-800">{submission.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="mb-4 text-lg font-semibold text-slate-900">AI 对话记录（仅展示文字）</div>
              {data.chats.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">目前还没有 AI 对话记录。</div>
              ) : (
                <div className="space-y-3">
                  {data.chats.map((chat) => (
                    <div key={chat.id} className={cn("rounded-2xl p-4", chat.role === "user" ? "bg-sky-50" : "bg-fuchsia-50")}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-slate-900">{chat.role === "user" ? "学生" : "AI"} · turn {chat.turnNo}</div>
                        <div className="text-xs text-slate-500">{formatDate(chat.createdAt)}</div>
                      </div>
                      <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">{chat.content}</div>
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
