"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Locale = "zh-Hans" | "zh-Hant" | "en";
type WorldId = "w1" | "w2" | "w3" | "w4" | "w5";
type Screen = "home" | WorldId;
type ChatMessage = { role: "user" | "ai"; text: string };

const worldOrder: WorldId[] = ["w1", "w2", "w3", "w4", "w5"];

const localeShortLabel = {
  "zh-Hans": "简",
  "zh-Hant": "繁",
  en: "EN",
} as const;

const uiText = {
  "zh-Hans": {
    mapTitle: "AI任务地图",
    mapSubtitle: "从第一个任务开始，完成后就能解锁下一个世界。",
    howTo: "怎么玩",
    howToText: "先完成前面的任务，再解锁后面的世界。",
    rules: "规则",
    rulesText: "每个世界都会让你和 AI 一起做不同的事。",
    progress: "进度",
    progressText: (done: number) => `已点亮 ${done} / 5 个世界。`,
    taskMap: "任务地图",
    taskMapText: "沿着路线完成任务。已完成的世界会被点亮，没解锁的世界会暂时灰暗。",
    currentTask: "当前任务",
    locked: "未解锁",
    unlockHint: "完成前一个任务后解锁",
    startTask: "开始任务",
    continueTask: "继续任务",
    returnMap: "返回地图",
    finishWorld: "完成这个世界",
    teacherPortal: "教师端",
    sessionPrefix: "本次编号",
    studentInfoTitle: "开始前先填一下资料",
    studentInfoNote: "填完就可以开始任务。老师会用这些资料对应你的测试结果。",
    name: "姓名 *",
    code: "学号 *",
    className: "班级 *",
    school: "学校",
    grade: "年级",
    start: "开始测试",
    starting: "正在进入…",
    cancel: "取消",
    required: "带 * 的项目要填写",
    needBasicInfo: "请先填写姓名、学号和班级。",
    world1Title: "学习推荐站",
    world1Sub: "看AI推荐怎么帮你学习，也看它会不会越推越窄。",
    world2Title: "信息核查工作台",
    world2Sub: "判断AI给的信息能不能直接用。",
    world3Title: "创作表达工坊",
    world3Sub: "和AI一起修改作品，但保留自己的声音。",
    world4Title: "任务决策站",
    world4Sub: "决定哪些事该交给AI，哪些要自己做。",
    world5Title: "公平设计所",
    world5Sub: "让一个AI系统变得更公平、更合理。",
    w1Mode: "推荐方式",
    w1Logic: "系统逻辑",
    w1RuleTitle: "你希望系统遵守哪些规则",
    w2Role: "AI 当前在做什么",
    w2Draft: "选择更适合继续修改的草稿",
    w2Check: "发布前核查（可多选）",
    w2Card: "最终信息卡",
    w3Card: "最终温暖卡片",
    w3Chat: "和 AI 聊一聊",
    w3ChatButton: "发送一轮 AI 修改请求",
    w3Check: "提交前，先检查一下（可多选）",
    w4Use: "这个任务是否适合使用 AI",
    w4Role: "AI 助手类型",
    w4Card: "分工与规则卡",
    w5Problem: "系统当前最需要解决的问题",
    w5Reason: "最可能的原因",
    w5Card: "系统改进说明卡",
  },
  "zh-Hant": {
    mapTitle: "AI任務地圖",
    mapSubtitle: "從第一個任務開始，完成後就能解鎖下一個世界。",
    howTo: "怎樣玩",
    howToText: "先完成前面的任務，再解鎖後面的世界。",
    rules: "規則",
    rulesText: "每個世界都會讓你和 AI 一起做不同的事。",
    progress: "進度",
    progressText: (done: number) => `已點亮 ${done} / 5 個世界。`,
    taskMap: "任務地圖",
    taskMapText: "沿著路線完成任務。已完成的世界會被點亮，未解鎖的世界會暫時變灰。",
    currentTask: "當前任務",
    locked: "未解鎖",
    unlockHint: "完成前一個任務後解鎖",
    startTask: "開始任務",
    continueTask: "繼續任務",
    returnMap: "返回地圖",
    finishWorld: "完成這個世界",
    teacherPortal: "教師端",
    sessionPrefix: "本次編號",
    studentInfoTitle: "開始前先填一下資料",
    studentInfoNote: "填好後就可以開始任務。老師會用這些資料對應你的測試結果。",
    name: "姓名 *",
    code: "學號 *",
    className: "班別 *",
    school: "學校",
    grade: "年級",
    start: "開始測試",
    starting: "正在進入…",
    cancel: "取消",
    required: "有 * 的項目需要填寫",
    needBasicInfo: "請先填寫姓名、學號和班別。",
    world1Title: "學習推薦站",
    world1Sub: "看 AI 推薦怎樣幫你學習，也看它會不會越推越窄。",
    world2Title: "資訊核查工作台",
    world2Sub: "判斷 AI 給的資訊能否直接使用。",
    world3Title: "創作表達工坊",
    world3Sub: "和 AI 一起修改作品，但保留自己的聲音。",
    world4Title: "任務決策站",
    world4Sub: "決定哪些事該交給 AI，哪些要自己做。",
    world5Title: "公平設計所",
    world5Sub: "讓一個 AI 系統變得更公平、更合理。",
    w1Mode: "推薦方式",
    w1Logic: "系統邏輯",
    w1RuleTitle: "你希望系統遵守哪些規則",
    w2Role: "AI 現在正在做什麼",
    w2Draft: "選擇更適合繼續修改的草稿",
    w2Check: "發佈前核查（可多選）",
    w2Card: "最終資訊卡",
    w3Card: "最終溫暖卡片",
    w3Chat: "和 AI 聊一聊",
    w3ChatButton: "發送一輪 AI 修改請求",
    w3Check: "提交前先檢查一下（可多選）",
    w4Use: "這個任務是否適合使用 AI",
    w4Role: "AI 助手類型",
    w4Card: "分工與規則卡",
    w5Problem: "系統目前最需要解決的問題",
    w5Reason: "最可能的原因",
    w5Card: "系統改進說明卡",
  },
  en: {
    mapTitle: "AI Mission Map",
    mapSubtitle: "Start with the first mission. Finish one to unlock the next world.",
    howTo: "How it works",
    howToText: "Finish the earlier missions first, then unlock the next ones.",
    rules: "Rules",
    rulesText: "Each world asks you to do something different with AI.",
    progress: "Progress",
    progressText: (done: number) => `${done} / 5 worlds completed.`,
    taskMap: "Mission Map",
    taskMapText: "Follow the route. Finished worlds light up, while locked ones stay dim.",
    currentTask: "Current mission",
    locked: "Locked",
    unlockHint: "Unlock after finishing the previous mission",
    startTask: "Start mission",
    continueTask: "Continue",
    returnMap: "Back to map",
    finishWorld: "Finish this world",
    teacherPortal: "Teacher Portal",
    sessionPrefix: "Session",
    studentInfoTitle: "Fill in a few details before you start",
    studentInfoNote: "After that, you can begin the missions. Your teacher will use these details to match your results.",
    name: "Name *",
    code: "Student ID *",
    className: "Class *",
    school: "School",
    grade: "Grade",
    start: "Start",
    starting: "Entering…",
    cancel: "Cancel",
    required: "Fields marked with * are required",
    needBasicInfo: "Please enter your name, student ID, and class first.",
    world1Title: "Learning Recommendation Hub",
    world1Sub: "See how AI recommendations can help you learn, and whether they may become too narrow.",
    world2Title: "Fact Check Desk",
    world2Sub: "Decide whether information from AI can be used directly.",
    world3Title: "Creative Studio",
    world3Sub: "Revise work with AI, while keeping your own voice.",
    world4Title: "Task Decision Hub",
    world4Sub: "Decide what AI should do and what people should do.",
    world5Title: "Fair Design Lab",
    world5Sub: "Make an AI system fairer and more reasonable.",
    w1Mode: "Recommendation style",
    w1Logic: "System logic",
    w1RuleTitle: "Which rules should the system follow",
    w2Role: "What is the AI doing here",
    w2Draft: "Choose the better draft to continue with",
    w2Check: "Checks before publishing (multiple choice)",
    w2Card: "Final info card",
    w3Card: "Final warm message",
    w3Chat: "Talk with AI",
    w3ChatButton: "Send one AI revision request",
    w3Check: "Before submitting, check these points",
    w4Use: "Should this task use AI",
    w4Role: "AI helper type",
    w4Card: "Work plan and rules card",
    w5Problem: "What problem should the system fix first",
    w5Reason: "Most likely reason",
    w5Card: "System improvement note",
  },
} as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
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

  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", className)}>{domain}</span>;
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("zh-Hans");
  const t = uiText[locale];
  const [screen, setScreen] = useState<Screen>("home");
  const [sessionId, setSessionId] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [completedWorlds, setCompletedWorlds] = useState<WorldId[]>([]);
  const [loadingSession, setLoadingSession] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [pendingWorld, setPendingWorld] = useState<WorldId | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [className, setClassName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [w1Mode, setW1Mode] = useState("explore");
  const [w1Logic, setW1Logic] = useState("learning");
  const [w1Rules, setW1Rules] = useState<Record<string, boolean>>({ explain: true, teacherReview: true, exploration: true });
  const [w2Role, setW2Role] = useState("");
  const [w2Draft, setW2Draft] = useState("");
  const [w2Flags, setW2Flags] = useState<string[]>([]);
  const [w2Card, setW2Card] = useState("");
  const [w3Card, setW3Card] = useState("");
  const [w3SelfCheck, setW3SelfCheck] = useState<Record<string, boolean>>({ kept_own_ideas: true, did_not_copy: true, understands_ai_generates_from_prompts: true });
  const [w3Chat, setW3Chat] = useState<ChatMessage[]>([]);
  const [w4UseAiChoice, setW4UseAiChoice] = useState("partial");
  const [w4AiTasks] = useState<string[]>(["统计人数", "整理重点"]);
  const [w4HumanTasks] = useState<string[]>(["写建议", "解释原因"]);
  const [w4Role, setW4Role] = useState("summary_assistant");
  const [w4Adjusted] = useState(true);
  const [w4Card, setW4Card] = useState("");
  const [w5Problem, setW5Problem] = useState("real_world_errors");
  const [w5BiasSource, setW5BiasSource] = useState("training_data");
  const [w5TrainingImages] = useState<string[]>(["different_lighting", "different_angles", "campus_real_scene"]);
  const [w5Reminders] = useState<string[]>(["double_check", "can_still_fail", "needs_explanation"]);
  const [w5Card, setW5Card] = useState("");

  const worldMeta = {
    w1: { title: t.world1Title, subtitle: t.world1Sub, domains: ["Engaging with AI", "Managing AI", "Designing AI"], emoji: "1" },
    w2: { title: t.world2Title, subtitle: t.world2Sub, domains: ["Engaging with AI"], emoji: "🔎" },
    w3: { title: t.world3Title, subtitle: t.world3Sub, domains: ["Creating with AI", "Managing AI", "Engaging with AI"], emoji: "✍️" },
    w4: { title: t.world4Title, subtitle: t.world4Sub, domains: ["Managing AI", "Creating with AI"], emoji: "🧭" },
    w5: { title: t.world5Title, subtitle: t.world5Sub, domains: ["Designing AI", "Engaging with AI"], emoji: "♻️" },
  } as const;

  const unlockedWorlds = useMemo(() => {
    const firstLocked = worldOrder.findIndex((w) => !completedWorlds.includes(w));
    if (firstLocked === -1) return worldOrder;
    return worldOrder.slice(0, firstLocked + 1);
  }, [completedWorlds]);

  useEffect(() => {
    if (!sessionId) return;
    const worldId = screen === "home" ? "home" : screen;
    void fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, worldId, stepId: worldId === "home" ? "home" : `${worldId}_entry`, eventType: "navigation", eventName: worldId === "home" ? "home_view" : `${worldId}_enter`, eventValueJson: { locale } }),
    });
  }, [screen, sessionId, locale]);

  async function saveStep(worldId: string, stepId: string, responseJson: Record<string, any>) {
    if (!sessionId) return;
    await fetch("/api/response/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, worldId, stepId, responseJson }) });
  }
  async function scoreSession() {
    if (!sessionId) return;
    await fetch("/api/score/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }) });
  }
  async function submitWorld(worldId: WorldId, submissionType: "info_card" | "warm_card" | "workflow_card" | "model_card_lite", content: string, selfCheckJson?: Record<string, any>) {
    if (!sessionId) return;
    await fetch("/api/submission", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, worldId, submissionType, content, selfCheckJson }) });
    await scoreSession();
    setCompletedWorlds((prev) => (prev.includes(worldId) ? prev : [...prev, worldId]));
  }

  async function startStudentSession() {
    if (!studentName.trim() || !studentCode.trim() || !className.trim()) {
      alert(t.needBasicInfo);
      return;
    }
    try {
      setLoadingSession(true);
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: locale, deviceType: "desktop", regionNote: "local", studentName, studentCode, className, schoolName, gradeLevel }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to start session");
      setSessionId(json.session.id);
      setSessionCode(json.session.sessionCode);
      setShowIdentityModal(false);
      if (pendingWorld) {
        setScreen(pendingWorld);
        setPendingWorld(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setLoadingSession(false);
    }
  }

  function handleEnterWorld(worldId: WorldId) {
    if (!sessionId) {
      setPendingWorld(worldId);
      setShowIdentityModal(true);
      return;
    }
    setScreen(worldId);
  }

  async function completeWorld1() { await saveStep("w1", "w1_step2", { mode: w1Mode, logic: w1Logic }); await saveStep("w1", "w1_step3", { rules: w1Rules }); await submitWorld("w1", "workflow_card", "我希望推荐系统既能帮助学习，也不会越推越窄。"); setScreen("home"); }
  async function completeWorld2() { await saveStep("w2", "w2_step1", { choice: w2Role || "organize_and_draft" }); await saveStep("w2", "w2_step2", { choice: w2Draft || "B" }); await saveStep("w2", "w2_step3", { flaggedClaims: w2Flags }); await submitWorld("w2", "info_card", w2Card || "这是一张测试信息卡。"); setScreen("home"); }

  async function sendWorld3AiMessage() {
    if (!sessionId) return;
    const userText = locale === "en" ? "Please make this message warmer without changing my main idea." : locale === "zh-Hant" ? "請把這段話改得更溫暖，但不要改掉我的原意。" : "请把这段话改得更温暖，但不要改掉我的原意。";
    const aiText = locale === "en" ? "Sure. I will keep your main idea and only make the tone warmer." : locale === "zh-Hant" ? "可以。我會保留你的主要意思，只把語氣調得更溫暖一點。" : "可以。我会保留你的主要意思，只把语气调得更温暖一点。";
    const nextTurn = Math.floor(w3Chat.length / 2) + 1;
    setW3Chat((prev) => [...prev, { role: "user", text: userText }, { role: "ai", text: aiText }]);
    await fetch("/api/chat/log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, worldId: "w3", turnNo: nextTurn, role: "user", content: userText }) });
    await fetch("/api/chat/log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, worldId: "w3", turnNo: nextTurn, role: "ai", content: aiText }) });
    await saveStep("w3", "w3_step3", { promptTags: ["keep_voice", "warmer_tone"] });
  }

  async function completeWorld3() {
    const defaultCard = locale === "en" ? "I hope you slowly find people and places that make you feel safe in your new school." : locale === "zh-Hant" ? "希望你來到新學校後，慢慢找到讓自己安心的人和事。" : "希望你来到新学校后，慢慢找到让自己安心的人和事。";
    await submitWorld("w3", "warm_card", w3Card || defaultCard, w3SelfCheck);
    setScreen("home");
  }
  async function completeWorld4() {
    await saveStep("w4", "w4_step1", { useAiChoice: w4UseAiChoice });
    await saveStep("w4", "w4_step2", { aiTasks: w4AiTasks, humanTasks: w4HumanTasks });
    await saveStep("w4", "w4_step3", { aiRole: w4Role });
    await saveStep("w4", "w4_step4", { adjustedWorkflow: w4Adjusted });
    const defaultCard = locale === "en" ? "AI can help with counting and organising, but final decisions should still be made by people." : locale === "zh-Hant" ? "AI 可以幫忙統計和整理，但最後的建議仍應由人來決定。" : "AI 可以帮忙统计和整理，但最终建议仍应由人来决定。";
    await submitWorld("w4", "workflow_card", w4Card || defaultCard);
    setScreen("home");
  }
  async function completeWorld5() {
    await saveStep("w5", "w5_step1", { choice: w5Problem });
    await saveStep("w5", "w5_step2", { choice: w5BiasSource });
    await saveStep("w5", "w5_step3", { selectedTrainingImages: w5TrainingImages });
    await saveStep("w5", "w5_step4", { selectedReminders: w5Reminders });
    const defaultCard = locale === "en" ? "This system can help with waste sorting, but it can still make mistakes in complex situations, so users should double-check." : locale === "zh-Hant" ? "這個系統可以幫助垃圾分類，但在複雜情境中仍可能出錯，使用時需要再次確認。" : "这个系统可以帮助垃圾分类，但在复杂情境中仍可能出错，使用时需要再次确认。";
    await submitWorld("w5", "model_card_lite", w5Card || defaultCard);
    if (sessionId) {
      await fetch("/api/session/end", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, currentWorld: "w5", currentStep: "w5_done", status: "completed" }) });
    }
    setScreen("home");
  }

  const completedCount = completedWorlds.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">{t.mapTitle}</div>
            <h1 className="mt-1 text-4xl font-semibold text-slate-900">{t.mapTitle}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t.mapSubtitle}</p>
            {sessionCode ? <p className="mt-2 text-xs text-slate-500">{t.sessionPrefix}：{sessionCode}</p> : null}
          </div>
          <div className="flex gap-2">
            {(["zh-Hans", "zh-Hant", "en"] as Locale[]).map((lang) => (
              <button key={lang} onClick={() => setLocale(lang)} className={cn("rounded-full border px-3 py-2 text-sm", locale === lang ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700")}>
                {localeShortLabel[lang]}
              </button>
            ))}
          </div>
        </div>

        {screen === "home" ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <Card className="p-5"><div className="text-sm text-slate-500">{t.howTo}</div><div className="mt-2 text-sm leading-7 text-slate-700">{t.howToText}</div></Card>
              <Card className="p-5"><div className="text-sm text-slate-500">{t.rules}</div><div className="mt-2 text-sm leading-7 text-slate-700">{t.rulesText}</div></Card>
              <Card className="p-5"><div className="text-sm text-slate-500">{t.progress}</div><div className="mt-2 text-sm leading-7 text-slate-700">{t.progressText(completedCount)}</div></Card>
            </section>

            <Card className="mt-6 p-6">
              <div className="text-sm text-slate-500">{t.taskMap}</div>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">{t.taskMap}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{t.taskMapText}</p>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {worldOrder.map((worldId, index) => {
                  const item = worldMeta[worldId];
                  const unlocked = unlockedWorlds.includes(worldId);
                  const completed = completedWorlds.includes(worldId);
                  return (
                    <Card key={worldId} className={cn("p-5 transition", !unlocked && "opacity-60", completed && "ring-2 ring-emerald-300")}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm text-slate-500">{index === 0 ? item.emoji : item.emoji}</div>
                          <div className="mt-1 text-xs text-slate-500">{index === 0 ? t.currentTask : worldId.toUpperCase()}</div>
                        </div>
                        <div className="text-2xl">{completed ? "✅" : unlocked ? "🟢" : "🔒"}</div>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.subtitle}</p>
                      <div className="mt-4 flex flex-wrap gap-2">{item.domains.map((domain) => <DomainBadge key={domain} domain={domain} />)}</div>
                      <div className="mt-6">
                        {unlocked ? <button onClick={() => handleEnterWorld(worldId)} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">{completed ? t.continueTask : t.startTask}</button> : <div className="space-y-2"><div className="text-sm text-slate-500">{t.unlockHint}</div><div className="text-sm font-medium text-slate-400">{t.locked}</div></div>}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </>
        ) : screen === "w1" ? (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{t.world1Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.world1Sub}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div><div className="mb-2 text-sm font-medium text-slate-700">{t.w1Mode}</div><select value={w1Mode} onChange={(e) => setW1Mode(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="personal">最适合我</option><option value="popular">大家都在学</option><option value="explore">试试新方向</option></select></div>
              <div><div className="mb-2 text-sm font-medium text-slate-700">{t.w1Logic}</div><select value={w1Logic} onChange={(e) => setW1Logic(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="rules">规则式</option><option value="learning">学习式</option></select></div>
            </div>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w1RuleTitle}</div><div className="space-y-3">{Object.entries(w1Rules).map(([key, value]) => <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"><input type="checkbox" checked={value} onChange={(e) => setW1Rules((prev) => ({ ...prev, [key]: e.target.checked }))} /><span className="text-sm text-slate-700">{key}</span></label>)}</div></div>
            <div className="mt-6 flex gap-3"><button onClick={completeWorld1} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">{t.finishWorld}</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">{t.returnMap}</button></div>
          </Card>
        ) : screen === "w2" ? (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{t.world2Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.world2Sub}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div><div className="mb-2 text-sm font-medium text-slate-700">{t.w2Role}</div><select value={w2Role} onChange={(e) => setW2Role(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">请选择</option><option value="organize_and_draft">整理资料并生成草稿</option><option value="final_judgement">直接做最后判断</option></select></div>
              <div><div className="mb-2 text-sm font-medium text-slate-700">{t.w2Draft}</div><select value={w2Draft} onChange={(e) => setW2Draft(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="">请选择</option><option value="A">版本 A</option><option value="B">版本 B</option></select></div>
            </div>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w2Check}</div><div className="space-y-3">{[{ id: "claim1", label: "某些绝对化表述需要再查一下" }, { id: "claim2", label: "这句可以保留" }, { id: "claim3", label: "这句不能直接发" }].map((item) => <label key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"><input type="checkbox" checked={w2Flags.includes(item.id)} onChange={(e) => setW2Flags((prev) => (e.target.checked ? [...prev, item.id] : prev.filter((x) => x !== item.id)))} /><span className="text-sm text-slate-700">{item.label}</span></label>)}</div></div>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w2Card}</div><textarea value={w2Card} onChange={(e) => setW2Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div>
            <div className="mt-6 flex gap-3"><button onClick={completeWorld2} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">{t.finishWorld}</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">{t.returnMap}</button></div>
          </Card>
        ) : screen === "w3" ? (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{t.world3Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.world3Sub}</p>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w3Card}</div><textarea value={w3Card} onChange={(e) => setW3Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w3Chat}</div><button onClick={sendWorld3AiMessage} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700">{t.w3ChatButton}</button><div className="mt-4 space-y-3">{w3Chat.map((msg, i) => <div key={i} className={cn("rounded-2xl p-4 text-sm", msg.role === "user" ? "bg-sky-50" : "bg-fuchsia-50")}><div className="mb-1 text-xs text-slate-500">{msg.role === "user" ? "Student" : "AI"}</div><div>{msg.text}</div></div>)}</div></div>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w3Check}</div><div className="space-y-3">{[{ key: "kept_own_ideas", label: locale === "en" ? "I kept my own ideas or examples" : locale === "zh-Hant" ? "我保留了自己的想法或例子" : "我保留了自己的想法或例子" }, { key: "did_not_copy", label: locale === "en" ? "I did not copy everything directly" : locale === "zh-Hant" ? "我沒有整段直接照搬" : "我没有整段直接照搬" }, { key: "understands_ai_generates_from_prompts", label: locale === "en" ? "I know AI generates content from prompts" : locale === "zh-Hant" ? "我知道 AI 會根據提示生成內容" : "我知道 AI 会根据提示生成内容" }].map((item) => <label key={item.key} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3"><input type="checkbox" checked={!!w3SelfCheck[item.key]} onChange={(e) => setW3SelfCheck((prev) => ({ ...prev, [item.key]: e.target.checked }))} /><span className="text-sm text-slate-700">{item.label}</span></label>)}</div></div>
            <div className="mt-6 flex gap-3"><button onClick={completeWorld3} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">{t.finishWorld}</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">{t.returnMap}</button></div>
          </Card>
        ) : screen === "w4" ? (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{t.world4Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.world4Sub}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2"><div><div className="mb-2 text-sm font-medium text-slate-700">{t.w4Use}</div><select value={w4UseAiChoice} onChange={(e) => setW4UseAiChoice(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="partial">部分使用 AI</option><option value="all">几乎都交给 AI</option><option value="none">尽量不用 AI</option></select></div><div><div className="mb-2 text-sm font-medium text-slate-700">{t.w4Role}</div><select value={w4Role} onChange={(e) => setW4Role(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="summary_assistant">摘要助手</option><option value="data_assistant">数据整理助手</option><option value="draft_assistant">建议草稿助手</option></select></div></div>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w4Card}</div><textarea value={w4Card} onChange={(e) => setW4Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div>
            <div className="mt-6 flex gap-3"><button onClick={completeWorld4} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">{t.finishWorld}</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">{t.returnMap}</button></div>
          </Card>
        ) : (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{t.world5Title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.world5Sub}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2"><div><div className="mb-2 text-sm font-medium text-slate-700">{t.w5Problem}</div><select value={w5Problem} onChange={(e) => setW5Problem(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="real_world_errors">真实环境里判断不稳定</option><option value="ui_problem">界面不好看</option></select></div><div><div className="mb-2 text-sm font-medium text-slate-700">{t.w5Reason}</div><select value={w5BiasSource} onChange={(e) => setW5BiasSource(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option value="training_data">训练图片太单一</option><option value="rules">规则不清楚</option></select></div></div>
            <div className="mt-6"><div className="mb-2 text-sm font-medium text-slate-700">{t.w5Card}</div><textarea value={w5Card} onChange={(e) => setW5Card(e.target.value)} className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" /></div>
            <div className="mt-6 flex gap-3"><button onClick={completeWorld5} className="rounded-full bg-slate-900 px-5 py-3 text-sm text-white">{t.finishWorld}</button><button onClick={() => setScreen("home")} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700">{t.returnMap}</button></div>
          </Card>
        )}

        {showIdentityModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-500">学生端</div>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900">{t.studentInfoTitle}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{t.studentInfoNote}</p>
                </div>
                <div className="flex gap-2">
                  {(["zh-Hans", "zh-Hant", "en"] as Locale[]).map((lang) => (
                    <button key={lang} onClick={() => setLocale(lang)} className={cn("rounded-full border px-3 py-2 text-sm", locale === lang ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700")}>
                      {localeShortLabel[lang]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block"><div className="mb-2 text-sm font-medium text-slate-700">{t.name}</div><input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" /></label>
                <label className="block"><div className="mb-2 text-sm font-medium text-slate-700">{t.code}</div><input value={studentCode} onChange={(e) => setStudentCode(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" /></label>
                <label className="block"><div className="mb-2 text-sm font-medium text-slate-700">{t.className}</div><input value={className} onChange={(e) => setClassName(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" /></label>
                <label className="block"><div className="mb-2 text-sm font-medium text-slate-700">{t.school}</div><input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" /></label>
                <label className="block md:col-span-2"><div className="mb-2 text-sm font-medium text-slate-700">{t.grade}</div><input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" /></label>
              </div>
              <div className="mt-8 flex items-center gap-3"><button onClick={startStudentSession} disabled={loadingSession} className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-50">{loadingSession ? t.starting : t.start}</button><button onClick={() => { setShowIdentityModal(false); setPendingWorld(null); }} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm text-slate-700">{t.cancel}</button><div className="text-xs text-slate-500">{t.required}</div></div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
