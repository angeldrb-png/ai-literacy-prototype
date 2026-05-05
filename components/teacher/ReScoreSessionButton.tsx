"use client";

import { useState } from "react";

type ReScoreSessionButtonProps = {
  sessionId: string;
};

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function ReScoreSessionButton({
  sessionId,
}: ReScoreSessionButtonProps) {
  const [rescoring, setRescoring] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRescore() {
    if (!sessionId) return;

    setRescoring(true);
    setMessage("");

    let lastError: unknown = null;

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        const res = await fetch("/api/score/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.ok === false) {
          throw new Error(json?.error || "Failed to re-score session");
        }

        setMessage("重新评分完成，正在刷新报告…");
        window.location.reload();
        return;
      } catch (error) {
        lastError = error;
        console.error(`[teacher] re-score failed, attempt ${attempt}/5`, error);
        setMessage(`重新评分失败，正在重试 ${attempt}/5…`);
        await sleep(1200 * attempt);
      }
    }

    console.error("[teacher] re-score failed after all retries", lastError);
    setMessage("重新评分失败。请稍后再试，或检查数据库连接。");
    setRescoring(false);
  }

  return (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={handleRescore}
      disabled={rescoring}
      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {rescoring ? "重新评分中…" : "重新评分"}
    </button>

    {message && (
      <span className="hidden max-w-[220px] text-xs leading-5 text-slate-500 xl:inline">
        {message}
      </span>
    )}
  </div>
);
}