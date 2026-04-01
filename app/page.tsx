"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Locale = "zh-Hans" | "zh-Hant" | "en";
type WorldId = "w1" | "w2" | "w3" | "w4" | "w5";
type Screen = "chooser" | "student-form" | "home" | WorldId;
type ChatMessage = { role: "user" | "ai"; text: string };

const worldOrder: WorldId[] = ["w1", "w2", "w3", "w4", "w5"];
const worldMeta = {
  w1: { title: "学习推荐站", subtitle: "看AI推荐怎么帮你学习，也看它会不会越推越窄。", domains: ["Engaging with AI", "Managing AI", "Designing AI"] },
  w2: { title: "信息核查工作台", subtitle: "判断AI给的信息能不能直接用。", domains: ["Engaging with AI"] },
  w3: { title: "创作表达工坊", subtitle: "和AI一起修改作品，但保留自己的声音。", domains: ["Creating with AI", "Managing AI", "Engaging with AI"] },
  w4: { title: "任务决策站", subtitle: "决定哪些事该交给AI，哪些要自己做。", domains: ["Managing AI", "Creating with AI"] },
  w5: { title: "公平设计所", subtitle: "让一个AI系统变得更公平、更合理。", domains: ["Designing AI", "Engaging with AI"] },
} as const;

const localeShortLabel = {
  "zh-Hans": "简",
  "zh-Hant": "繁",
  en: "EN",
} as const;

const studentEntryText = {
  "zh-Hans": {
    title: "开始前先填一下资料",
    note: "填完就可以进入任务地图。老师会用这些资料对应你的测试结果。",
    name: "姓名 *",
    code: "学号 *",
    className: "班级 *",
    school: "学校",
    grade: "年级",
    start: "开始测试",
    starting: "正在进入…",
    back: "返回入口页",
    required: "带 * 的项目要填写",
  },
  "zh-Hant": {
    title: "開始前先填一下資料",
    note: "填好後就可以進入任務地圖。老師會用這些資料對應你的測試結果。",
    name: "姓名 *",
    code: "學號 *",
    className: "班別 *",
    school: "學校",
    grade: "年級",
    start: "開始測試",
    starting: "正在進入…",
    back: "返回入口頁",
    required: "有 * 的項目需要填寫",
  },
  en: {
    title: "Fill in a few details before you start",
    note: "After that, you can enter the mission map. Your teacher will use these details to match your results.",
    name: "Name *",
    code: "Student ID *",
    className: "Class *",
    school: "School",
    grade: "Grade",
    start: "Start",
    starting: "Entering…",
    back: "Back",
    required: "Fields marked with * are required",
  },
} as const;

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

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("zh-Hans");
  const [screen, setScreen] = useState<Screen>("chooser");
  const [sessionId, setSessionId] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [completedWorlds, setCompletedWorlds] = useState<WorldId[]>([]);

  const [studentName, setStudentName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [className, setClassName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [loadingSession, setLoadingSession] = useState(false);

  const [w1Mode, setW1Mode] = useState("explore");
  const [w1Logic, setW1Logic] = useState("learning");
  const [w1Rules, setW1Rules] = useState<Record<string, boolean>>({ explain: true, teacherReview: true, exploration: true });

  const [w2Role, setW2Role] = useState("");
  const [w2Draft, setW2Draft] = useState("");
  const [w2Flags, setW2Flags] = useState<string[]>([]);
  const [w2Card, setW2Card] = useState("");

  const [w3Card, setW3Card] = useState("");
  const [w3SelfCheck, setW3SelfCheck] = useState<Record<string, boolean>>({
    kept_own_ideas: true,
    did_not_copy: true,
    understands_ai_generates_from_prompts: true,
  });
  const [w3Chat, setW3Chat] = useState<ChatMessage[]>([]);

  const [w4UseAiChoice, setW4UseAiChoice] = useState("partial");
  const [w4Role, setW4Role] = useState("summary_assistant");
  const [w4Card, setW4Card] = useState("");

  const [w5Problem, setW5Problem] = useState("real_world_errors");
  const [w5BiasSource, setW5BiasSource] = useState("training_data");
  const [w5Card, setW5Card] = useState("");

  const unlockedWorlds = useMemo(() => {
    const firstLocked = worldOrder.findIndex((w) => !completedWorlds.includes(w));
    if (firstLocked === -1) return worldOrder;
    return worldOrder.slice(0, firstLocked + 1);
  }, [completedWorlds]);

  useEffect(() => {
    if (!sessionId) return;
    const worldId = screen === "home" ? "home" : screen.startsWith("w") ? screen : "home";
    void fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        worldId,
        stepId: worldId === "home" ? "home" : `${worldId}_entry`,
        eventType: "navigation",
        eventName: worldId === "home" ? "home_view" : `${worldId}_enter`,
        eventValueJson: { locale },
      }),
    });
  }, [screen, sessionId, locale]);

  async function saveStep(worldId: string, stepId: string, responseJson: Record<string, any>) {
    if (!sessionId) return;
    await fetch("/api/response/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, worldId, stepId, responseJson }),
    });
  }

  async function scoreSession() {
    if (!sessionId) return;
    await fetch("/api/score/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
  }

  async function submitWorld(worldId: WorldId, submissionType: "info_card" | "warm_card" | "workflow_card" | "model_card_lite", content: string, selfCheckJson?: Record<string, any>) {
    if (!sessionId) return;
    await fetch("/api/submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, worldId, submissionType, content, selfCheckJson }),
    });
    await scoreSession();
    setCompletedWorlds((prev) => (prev.includes(worldId) ? prev : [...prev, worldId]));
  }

  async function startStudentSession() {
    if (!studentName.trim() || !studentCode.trim() || !className.trim()) {
      alert("请先填写姓名、学号和班级。");
      return;
    }
    try {
      setLoadingSession(true);
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: locale,
          deviceType: "desktop",
          regionNote: "local",
          studentName,
          studentCode,
          className,
          schoolName,
          gradeLevel,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to start session");
      setSessionId(json.session.id);
      setSessionCode(json.session.sessionCode);
      setScreen("home");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setLoadingSession(false);
    }
  }

  async function completeWorld1() {
    await saveStep("w1", "w1_step2", { mode: w1Mode, logic: w1Logic });
    await saveStep("w1", "w1_step3", { rules: w1Rules });
    await submitWorld("w1", "workflow_card", "我希望推荐系统既能帮助学习，也不会越推越窄。");
    setScreen("home");
  }

  async function completeWorld2() {
    await saveStep("w2", "w2_step1", { choice: w2Role || "organize_and_draft" });
    await saveStep("w2", "w2_step2", { choice: w2Draft || "B" });
    await saveStep("w2", "w2_step3", { flaggedClaims: w2Flags });
    await submitWorld("w2", "info_card", w2Card || "这是一张测试信息卡。");
    setScreen("home");
  }

  async function sendWorld3AiMessage() {
    if (!sessionId) return;
    const userText = "请帮我把这段话改得更温暖，但不要改掉我的意思。";
    const aiText = "当然可以。我会保留你的核心意思，只把语气调得更温暖一点。";
    const nextTurn = Math.floor(w3Chat.length / 2) + 1;
    setW3Chat((prev) => [...prev, { role: "user", text: userText }, { role: "ai", text: aiText }]);
    await fetch("/api/chat/log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, worldId: "w3", turnNo: nextTurn, role: "user", content: userText }) });
    await fetch("/api/chat/log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, worldId: "w3", turnNo: nextTurn, role: "ai", content: aiText }) });
    await saveStep("w3", "w3_step3", { promptTags: ["keep_voice", "warmer_tone"] });
  }

  async function completeWorld3() {
    await submitWorld("w3", "warm_card", w3Card || "希望你来到新学校以后，慢慢找到让自己安心的人和事。", w3SelfCheck);
    setScreen("home");
  }

  async function completeWorld4() {
    await saveStep("w4", "w4_step1", { useAiChoice: w4UseAiChoice });
    await saveStep("w4", "w4_step2", { aiTasks: ["统计人数", "整理重点"], humanTasks: ["写建议", "解释原因"] });
    await saveStep("w4", "w4_step3", { aiRole: w4Role });
    await saveStep("w4", "w4_step4", { adjustedWorkflow: true });
    await submitWorld("w4", "workflow_card", w4Card || "AI 可以帮忙统计和整理，但最终建议应由人来决定。");
    setScreen("home");
  }

  async function completeWorld5() {
    await saveStep("w5", "w5_step1", { choice: w5Problem });
    await saveStep("w5", "w5_step2", { choice: w5BiasSource });
    await saveStep("w5", "w5_step3", { selectedTrainingImages: ["different_lighting", "different_angles", "campus_real_scene"] });
    await saveStep("w5", "w5_step4", { selectedReminders: ["double_check", "can_still_fail", "needs_explanation"] });
    await submitWorld("w5", "model_card_lite", w5Card || "这个系统能帮助垃圾分类，但在复杂场景下仍可能出错，使用时需要再次确认。");
    if (sessionId) {
      await fetch("/api/session/end", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, currentWorld: "w5", currentStep: "w5_done", status: "completed" }) });
    }
    setScreen("home");
  }

  if (screen === "chooser") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">AI校园任务站</div>
              <h1 className="mt-1 text-4xl font-semibold text-slate-900">请选择入口</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">学生进入后先填写身份信息，再开始测试；教师可直接进入教师端查看会话与评分结果。</p>
            </div>
            <div className="flex gap-2">
              {(["zh-Hans", "zh-Hant", "en"] as Locale[]).map((lang) => (
                <button key={localeShortLabel[lang]} onClick={() => setLocale(lang)} className={cn("rounded-full border px-3 py-2 text-sm", locale === lang ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700")}>{lang}</button>
              ))}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="text-3xl">🎒</div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">我是学生</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">先填写身份信息，再进入任务地图。完成任务后，教师端可以看到你的姓名、学号、班级和结果。</p>
              <button onClick={() => setScreen("student-form")} className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">进入学生端</button>
            </Card>
            <Card className="p-6">
              <div className="text-3xl">🧑‍🏫</div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">我是教师</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">进入教师端总览，查看最近会话、评分结果，以及单个学生的完整测试记录。</p>
              <Link href="/teacher" className="mt-6 inline-flex rounded-full bg-sky-700 px-5 py-3 text-sm font-medium text-white">进入教师端</Link>
            </Card>
          </div>
        </div>
      </main>
    );
  }

if (screen === "student-form") {
  const t = studentEntryText[locale];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setScreen("chooser")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
          >
            {t.back}
          </button>

          <div className="flex gap-2">
            {(["zh-Hans", "zh-Hant", "en"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={cn(
                  "rounded-full border px-3 py-2 text-sm",
                  locale === lang
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                {localeShortLabel[lang]}
              </button>
            ))}
          </div>
        </div>

        <Card className="p-8">
          <div className="text-sm font-medium text-slate-500">学生端</div>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">{t.title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{t.note}</p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">{t.name}</div>
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">{t.code}</div>
              <input
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">{t.className}</div>
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-700">{t.school}</div>
              <input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </label>

            <label className="block md:col-span-2">
              <div className="mb-2 text-sm font-medium text-slate-700">{t.grade}</div>
              <input
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </label>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={startStudentSession}
              disabled={loadingSession}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {loadingSession ? t.starting : t.start}
            </button>
            <div className="text-xs text-slate-500">{t.required}</div>
          </div>
        </Card>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-slate-500">学生端 · AI任务地图</div>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">欢迎开始测试</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">Session：{sessionCode || "—"} · 学生：{studentName} · 学号：{studentCode} · 班级：{className}</p>
          </div>
          <div className="flex gap-3"><Link href="/teacher" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">教师端</Link><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">任务地图</button></div>
        </div>
        {screen === "home" ? (
          <>
            <Card className="mb-6 p-5"><h2 className="text-lg font-semibold text-slate-900">怎么玩</h2><p className="mt-2 text-sm leading-7 text-slate-600">先完成前面的任务，再解锁后面的世界。每完成一个世界，系统会自动保存数据并更新评分结果。</p></Card>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {worldOrder.map((worldId) => {
                const item = worldMeta[worldId];
                const unlocked = unlockedWorlds.includes(worldId);
                const completed = completedWorlds.includes(worldId);
                return <Card key={worldId} className={cn("p-5 transition", !unlocked && "opacity-50", completed && "ring-2 ring-emerald-300")}><div className="flex items-start justify-between gap-3"><div><div className="text-sm text-slate-500">{worldId.toUpperCase()}</div><h3 className="mt-1 text-xl font-semibold text-slate-900">{item.title}</h3></div><div className="text-2xl">{completed ? "✅" : unlocked ? "🟢" : "🔒"}</div></div><p className="mt-3 text-sm leading-7 text-slate-600">{item.subtitle}</p><div className="mt-4 flex flex-wrap gap-2">{item.domains.map((d) => <DomainBadge key={d} domain={d} />)}</div><div className="mt-6"><button disabled={!unlocked} onClick={() => setScreen(worldId)} className={cn("rounded-full px-5 py-3 text-sm font-medium", unlocked ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500")}>{completed ? "再次进入" : unlocked ? "开始任务" : "尚未解锁"}</button></div></Card>;
              })}
            </div>
          </>
        ) : screen === "w1" ? <Card className="p-6"><h2 className="text-2xl font-semibold text-slate-900">{worldMeta.w1.title}</h2><p className="mt-2 text-sm text-slate-600">{worldMeta.w1.subtitle}</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div><div className="mb-2 text-sm font-medium text-slate-700">推荐方式</div><select value={w1Mode} onChange={(e) => setW1Mode(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="personal">最适合我</option><option value="popular">大家都在学</option><option value="explore">试试新方向</option></select></div><div><div className="mb-2 text-sm font-medium text-slate-700">系统逻辑</div><select value={w1Logic} onChange={(e) => setW1Logic(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="rules">规则式</option><option value="learning">学习式</option></select></div></div><div className="mt-6 space-y-3">{Object.entries(w1Rules).map(([key, value]) => <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"><input type="checkbox" checked={value} onChange={(e) => setW1Rules((prev) => ({ ...prev, [key]: e.target.checked }))} /><span className="text-sm text-slate-700">{key}</span></label>)}</div><div className="mt-6 flex gap-3"><button onClick={completeWorld1} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">完成世界1</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">返回地图</button></div></Card> : screen === "w2" ? <Card className="p-6"><h2 className="text-2xl font-semibold text-slate-900">{worldMeta.w2.title}</h2><p className="mt-2 text-sm text-slate-600">{worldMeta.w2.subtitle}</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div><div className="mb-2 text-sm font-medium text-slate-700">AI 当前在做什么</div><select value={w2Role} onChange={(e) => setW2Role(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">请选择</option><option value="organize_and_draft">整理资料并生成草稿</option><option value="final_judgement">直接做最后判断</option></select></div><div><div className="mb-2 text-sm font-medium text-slate-700">选择更适合继续修改的草稿</div><select value={w2Draft} onChange={(e) => setW2Draft(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">请选择</option><option value="A">版本 A</option><option value="B">版本 B</option></select></div></div><div className="mt-6 space-y-3">{["claim1","claim2","claim3"].map((item) => <label key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"><input type="checkbox" checked={w2Flags.includes(item)} onChange={(e) => setW2Flags((prev) => e.target.checked ? [...prev, item] : prev.filter((x) => x !== item))} /><span className="text-sm text-slate-700">{item}</span></label>)}</div><div className="mt-6"><textarea value={w2Card} onChange={(e) => setW2Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div><div className="mt-6 flex gap-3"><button onClick={completeWorld2} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">完成世界2</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">返回地图</button></div></Card> : screen === "w3" ? <Card className="p-6"><h2 className="text-2xl font-semibold text-slate-900">{worldMeta.w3.title}</h2><p className="mt-2 text-sm text-slate-600">{worldMeta.w3.subtitle}</p><div className="mt-6"><textarea value={w3Card} onChange={(e) => setW3Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div><div className="mt-6"><button onClick={sendWorld3AiMessage} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700">发送一轮 AI 修改请求</button><div className="mt-4 space-y-3">{w3Chat.map((m, i) => <div key={i} className={cn("rounded-2xl p-4 text-sm", m.role === "user" ? "bg-sky-50" : "bg-fuchsia-50")}><div className="mb-1 text-xs text-slate-500">{m.role}</div><div>{m.text}</div></div>)}</div></div><div className="mt-6 space-y-3">{Object.entries(w3SelfCheck).map(([key, value]) => <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"><input type="checkbox" checked={value} onChange={(e) => setW3SelfCheck((prev) => ({ ...prev, [key]: e.target.checked }))} /><span className="text-sm text-slate-700">{key}</span></label>)}</div><div className="mt-6 flex gap-3"><button onClick={completeWorld3} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">完成世界3</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">返回地图</button></div></Card> : screen === "w4" ? <Card className="p-6"><h2 className="text-2xl font-semibold text-slate-900">{worldMeta.w4.title}</h2><p className="mt-2 text-sm text-slate-600">{worldMeta.w4.subtitle}</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div><select value={w4UseAiChoice} onChange={(e) => setW4UseAiChoice(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="partial">部分使用 AI</option><option value="all">几乎都交给 AI</option><option value="none">尽量不用 AI</option></select></div><div><select value={w4Role} onChange={(e) => setW4Role(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="summary_assistant">摘要助手</option><option value="data_assistant">数据整理助手</option><option value="draft_assistant">建议草稿助手</option></select></div></div><div className="mt-6"><textarea value={w4Card} onChange={(e) => setW4Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div><div className="mt-6 flex gap-3"><button onClick={completeWorld4} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">完成世界4</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">返回地图</button></div></Card> : <Card className="p-6"><h2 className="text-2xl font-semibold text-slate-900">{worldMeta.w5.title}</h2><p className="mt-2 text-sm text-slate-600">{worldMeta.w5.subtitle}</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div><select value={w5Problem} onChange={(e) => setW5Problem(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="real_world_errors">真实环境里判断不稳定</option><option value="ui_problem">界面不好看</option></select></div><div><select value={w5BiasSource} onChange={(e) => setW5BiasSource(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="training_data">训练图片太单一</option><option value="rules">规则不清楚</option></select></div></div><div className="mt-6"><textarea value={w5Card} onChange={(e) => setW5Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div><div className="mt-6 flex gap-3"><button onClick={completeWorld5} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">完成世界5并结束测试</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">返回地图</button></div></Card>}
      </div>
    </main>
  );
}
