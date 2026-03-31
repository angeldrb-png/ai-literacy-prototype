"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TeacherLanguageSwitch from "./TeacherLanguageSwitch";
import { teacherText } from "@/lib/teacher-i18n";
import { useTeacherLocale } from "./useTeacherLocale";

export default function TeacherLoginClient() {
  const router = useRouter();
  const { locale } = useTeacherLocale();
  const t = teacherText[locale];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      const res = await fetch("/api/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(res.status === 500 ? t.notConfigured : t.invalidCredentials);
        return;
      }
      router.push("/teacher");
      router.refresh();
    } catch {
      setError(t.loadFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-slate-500">Teacher Portal</div>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">{t.loginTitle}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{t.loginNote}</p>
          </div>
          <TeacherLanguageSwitch />
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-4xl">🧑‍🏫</div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">{t.loginTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t.overviewNote}</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">{t.username}</div>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" autoComplete="username" />
            </label>
            <label className="mt-5 block">
              <div className="mb-2 text-sm font-medium text-slate-700">{t.password}</div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" autoComplete="current-password" />
            </label>
            {error ? <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
            <div className="mt-6 flex items-center gap-3">
              <button type="submit" disabled={submitting} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
                {submitting ? t.signingIn : t.signIn}
              </button>
              <Link href="/" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700">{t.backHome}</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
