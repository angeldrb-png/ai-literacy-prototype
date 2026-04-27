"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Feather,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Lock,
  MessageCircleHeart,
  PencilLine,
  Recycle,
  School,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  Trees,
  User,
  Wand2,
  Map,
  ChartColumnIncreasing,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";

type Screen = "home" | "w1" | "w2" | "w3" | "w4" | "w5";
type WorldId = "w1" | "w2" | "w3" | "w4" | "w5";
type ChatMessage = { role: "user" | "ai"; text: string };
type W3Recipient = "junior" | "stress" | "new" | "elder";


type Locale = "zh-Hans" | "zh-Hant" | "en";

type IdentityForm = {
  studentName: string;
  studentCode: string;
  className: string;
  schoolName: string;
  gradeLevel: string;
};


const LOCALE_LABELS: Record<Locale, string> = {
  "zh-Hans": "简",
  "zh-Hant": "繁",
  en: "EN",
};

const TRANSLATIONS: Record<string, { "zh-Hant": string; en: string }> = {
  "AI任务地图": { "zh-Hant": "AI任務地圖", en: "AI Mission Map" },
  "从第一个任务开始，完成后就能解锁下一个世界。": {
    "zh-Hant": "由第一個任務開始，完成後便會解鎖下一個世界。",
    en: "Start with the first mission. Finish it to unlock the next world.",
  },
  "怎么玩": { "zh-Hant": "怎樣開始", en: "How it works" },
  "先完成前面的任务，再解锁后面的世界。": {
    "zh-Hant": "先完成前面的任務，再解鎖後面的世界。",
    en: "Complete earlier missions first to unlock the next world.",
  },
  "规则": { "zh-Hant": "規則", en: "Rules" },
  "每个世界都会让你和 AI 一起做不同的事。": {
    "zh-Hant": "每個世界都會讓你和 AI 一起完成不同任務。",
    en: "Each world gives you a different task to complete with AI.",
  },
  "进度": { "zh-Hant": "進度", en: "Progress" },
  "已点亮": { "zh-Hant": "已點亮", en: "Cleared" },
  "任务地图": { "zh-Hant": "任務地圖", en: "Mission Map" },
  "沿着路线完成任务。已完成的世界会被点亮，没解锁的世界会暂时灰暗。": {
    "zh-Hant": "沿着路線完成任務。已完成的世界會被點亮，未解鎖的世界會暫時變暗。",
    en: "Follow the route. Finished worlds light up. Locked worlds stay dim until you unlock them.",
  },
  "回地图": { "zh-Hant": "返回地圖", en: "Back to map" },
  "任务进度": { "zh-Hant": "任務進度", en: "Mission progress" },
  "上一步": { "zh-Hant": "上一步", en: "Back" },
  "下一步": { "zh-Hant": "下一步", en: "Next" },
  "下一步：提交页": { "zh-Hant": "下一步：提交頁", en: "Next: submit" },
  "已点亮 0 / 5 个世界。": { "zh-Hant": "已點亮 0 / 5 個世界。", en: "0 / 5 worlds cleared." },
  "当前任务": { "zh-Hant": "目前任務", en: "Current mission" },
  "未解锁": { "zh-Hant": "未解鎖", en: "Locked" },
  "开始任务": { "zh-Hant": "開始任務", en: "Start mission" },
  "已完成": { "zh-Hant": "已完成", en: "Completed" },
  "完成前一个任务后解锁": { "zh-Hant": "完成前一個任務後解鎖", en: "Unlock after the previous mission" },

  "学习推荐站": { "zh-Hant": "學習推薦站", en: "Learning Recommender" },
  "看AI推荐怎么帮你学习，也看它会不会越推越窄。": {
    "zh-Hant": "看看 AI 推薦如何幫助你學習，也看看它會否愈推愈窄。",
    en: "See how AI recommendations can support learning—and how they might narrow what you see.",
  },
  "信息核查工作台": { "zh-Hant": "資訊核查工作台", en: "Info Check Desk" },
  "判断AI给的信息能不能直接用。": {
    "zh-Hant": "判斷 AI 提供的資訊能否直接使用。",
    en: "Decide whether AI-generated information can be used as it is.",
  },
  "创作表达工坊": { "zh-Hant": "創作表達工坊", en: "Creative Expression Studio" },
  "和AI一起修改作品，但保留自己的声音。": {
    "zh-Hant": "和 AI 一起修改作品，但保留自己的表達。",
    en: "Revise a piece with AI while keeping your own voice.",
  },
  "任务决策站": { "zh-Hant": "任務決策站", en: "Task Decision Hub" },
  "决定哪些事该交给AI，哪些要自己做。": {
    "zh-Hant": "決定哪些工作適合交給 AI，哪些仍要自己完成。",
    en: "Decide what to delegate to AI and what people should still do themselves.",
  },
  "公平设计所": { "zh-Hant": "公平設計所", en: "Fair Design Lab" },
  "让一个AI系统变得更公平、更合理。": {
    "zh-Hant": "讓一個 AI 系統變得更公平、更合理。",
    en: "Improve an AI system so it becomes fairer and more sensible.",
  },
  "世界1": {"zh-Hant":"世界1","en":"World 1"},
  "世界2": {"zh-Hant":"世界2","en":"World 2"},
  "世界3": {"zh-Hant":"世界3","en":"World 3"},
  "世界4": {"zh-Hant":"世界4","en":"World 4"},
  "世界5": {"zh-Hant":"世界5","en":"World 5"},
  "我的输入": {"zh-Hant":"我的輸入","en":"My prompt"},
  "AI 输出": {"zh-Hant":"AI 輸出","en":"AI output"},
  "我的初稿": {"zh-Hant":"我的初稿","en":"My first draft"},
};

function tr(locale: Locale, text: string) {
  if (locale === "zh-Hans") return text;
  return TRANSLATIONS[text]?.[locale] || text;
}

function readSavedLocale(): Locale {
  if (typeof window === "undefined") return "zh-Hans";
  const saved = window.localStorage.getItem("site_lang");
  if (saved === "zh-Hans" || saved === "zh-Hant" || saved === "en") return saved;
  return "zh-Hans";
}


// 保留这个组件，供后续复用。
function LanguageSwitcher({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (next: Locale) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur">
      {(["zh-Hans", "zh-Hant", "en"] as Locale[]).map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            locale === item ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          {LOCALE_LABELS[item]}
        </button>
      ))}
    </div>
  );
}


function toggleValue(
  value: string,
  list: string[],
  setList: React.Dispatch<React.SetStateAction<string[]>>
) {
  setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
}

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
        "rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/60",
        className
      )}
    >
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : variant === "secondary"
      ? "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45",
        styles,
        className
      )}
    >
      {children}
    </button>
  );
}

function Pill({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light" | "outline";
}) {
  const styles =
    tone === "dark"
      ? "bg-slate-900 text-white"
      : tone === "light"
      ? "bg-white text-slate-900"
      : "border border-slate-200 bg-white text-slate-700";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        styles
      )}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-slate-900 transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function StepPill({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-3 py-2 text-sm font-medium transition",
        active && "border-slate-900 bg-slate-900 text-white",
        !active && done && "border-emerald-200 bg-emerald-50 text-emerald-700",
        !active && !done && "border-slate-200 bg-white text-slate-600"
      )}
    >
      {label}
    </div>
  );
}

function OptionCard({
  title,
  note,
  emoji,
  selected,
  onClick,
  icon: Icon,
}: {
  title: string;
  note: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-3xl border p-4 text-left transition",
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-24 items-center justify-center rounded-2xl text-4xl",
          selected ? "bg-white/10" : "bg-gradient-to-br from-slate-50 to-slate-100"
        )}
      >
        {emoji ? emoji : Icon ? <Icon className={cn("h-9 w-9", selected ? "text-white" : "text-slate-700")} /> : null}
      </div>
      <p className="text-base font-semibold">{title}</p>
      <p className={cn("mt-1 text-sm leading-6", selected ? "text-white/80" : "text-slate-500")}>
        {note}
      </p>
    </button>
  );
}

function TagButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-2 text-xs transition",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  );
}

function Header({
  title,
  subtitle,
  badge,
  color,
  icon,
  progress,
  steps,
  activeStep,
  onBack,
  locale,
}: {
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  icon: React.ReactNode;
  progress: number;
  steps: string[];
  activeStep: number;
  onBack: () => void;
  locale: Locale;
}) {
  return (
    <Card className="overflow-hidden">
      <div className={cn("p-7 text-white md:p-8", `bg-gradient-to-br ${color}`)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-white/15 p-3">{icon}</div>
            <Pill tone="light">{badge}</Pill>
          </div>
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {tr(locale, "回地图")}
          </Button>
        </div>
        <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90 md:text-base">
          {subtitle}
        </p>
      </div>
      <div className="space-y-4 p-5 md:p-6">
        <div className={cn("grid gap-3", steps.length === 5 ? "md:grid-cols-5" : "md:grid-cols-4")}>
          {steps.map((s, i) => (
            <StepPill key={s} label={s} active={activeStep === i} done={activeStep > i} />
          ))}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>{tr(locale, "任务进度")}</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>
    </Card>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="border-b border-slate-100 px-5 pb-4 pt-5">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

function Nav({
  step,
  setStep,
  maxStep,
  canNext,
  locale,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  maxStep: number;
  canNext: boolean;
  locale: Locale;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="secondary"
        disabled={step === 0}
        onClick={() => setStep((s) => Math.max(0, s - 1))}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> {tr(locale, "上一步")}
      </Button>
      <Button disabled={!canNext} onClick={() => setStep((s) => Math.min(maxStep, s + 1))}>
        {step === maxStep ? tr(locale, "下一步：提交页") : tr(locale, "下一步")}{" "}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function WorldMapNode({
  title,
  subtitle,
  domains,
  status,
  icon,
  illustration,
  onClick,
  locale,
}: {
  title: string;
  subtitle: string;
  domains: string[];
  status: "done" | "current" | "locked";
  icon: React.ReactNode;
  illustration: string;
  onClick?: () => void;
  locale: Locale;
}) {
  const isLocked = status === "locked";
  return (
    <div className="relative">
      <button
        disabled={isLocked}
        onClick={onClick}
        className={cn(
          "w-full rounded-[28px] border p-4 text-left transition",
          status === "done" &&
            "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-lg shadow-emerald-100/60",
          status === "current" &&
            "border-slate-900 bg-white shadow-xl shadow-slate-200/70 hover:-translate-y-0.5",
          status === "locked" &&
            "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl text-xl",
                status === "done" && "bg-emerald-100 text-emerald-700",
                status === "current" && "bg-slate-900 text-white",
                status === "locked" && "bg-slate-200 text-slate-500"
              )}
            >
              {status === "locked" ? <Lock className="h-5 w-5" /> : icon}
            </div>
            <div className="text-3xl">{illustration}</div>
          </div>
          <div className="flex items-center gap-2">
            {status === "done" && <Pill tone="outline">{tr(locale, "已点亮")}</Pill>}
            {status === "current" && <Pill tone="dark">{tr(locale, "当前任务")}</Pill>}
            {status === "locked" && <Pill tone="outline">{tr(locale, "未解锁")}</Pill>}
          </div>
        </div>
        <h3 className={cn("text-xl font-semibold", status === "locked" ? "text-slate-500" : "text-slate-900")}>
          {title}
        </h3>
        <p className={cn("mt-2 text-sm leading-7", status === "locked" ? "text-slate-400" : "text-slate-600")}>
          {subtitle}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {domains.map((domain) => (
            <Pill key={domain} tone="outline">
              {domain}
            </Pill>
          ))}
        </div>
        <div className="mt-4">
          {status === "current" && (
            <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
              {tr(locale, "开始任务")} <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </div>
          )}
          {status === "done" && (
            <div className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">
              {tr(locale, "已完成")} <CheckCircle2 className="ml-1 h-3.5 w-3.5" />
            </div>
          )}
          {status === "locked" && (
            <div className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500">
              {tr(locale, "完成前一个任务后解锁")}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

const WORLD_ORDER: WorldId[] = ["w1", "w2", "w3", "w4", "w5"];

const WORLD_META: Record<
  WorldId,
  {
    title: string;
    subtitle: string;
    illustration: string;
    color: string;
    domains: string[];
    icon: React.ReactNode;
  }
> = {
  w1: {
    title: "学习推荐站",
    subtitle: "看AI推荐怎么帮你学习，也看它会不会越推越窄。",
    illustration: "📚",
    color: "from-indigo-600 via-blue-600 to-sky-500",
    domains: ["Engaging with AI", "Managing AI", "Designing AI"],
    icon: <BookOpen className="h-5 w-5" />,
  },
  w2: {
    title: "信息核查工作台",
    subtitle: "判断AI给的信息能不能直接用。",
    illustration: "🔎",
    color: "from-cyan-600 via-sky-600 to-blue-600",
    domains: ["Engaging with AI"],
    icon: <SearchCheck className="h-5 w-5" />,
  },
  w3: {
    title: "创作表达工坊",
    subtitle: "和AI一起修改作品，但保留自己的声音。",
    illustration: "💌",
    color: "from-fuchsia-600 via-violet-600 to-indigo-600",
    domains: ["Creating with AI", "Managing AI", "Engaging with AI"],
    icon: <HeartHandshake className="h-5 w-5" />,
  },
  w4: {
    title: "任务决策站",
    subtitle: "决定哪些事该交给AI，哪些要自己做。",
    illustration: "🧭",
    color: "from-amber-500 via-orange-500 to-rose-500",
    domains: ["Managing AI", "Creating with AI"],
    icon: <School className="h-5 w-5" />,
  },
  w5: {
    title: "公平设计所",
    subtitle: "让一个AI系统变得更公平、更合理。",
    illustration: "♻️",
    color: "from-emerald-600 via-teal-600 to-cyan-600",
    domains: ["Designing AI", "Engaging with AI"],
    icon: <Leaf className="h-5 w-5" />,
  },
};

// World 1 data
const learningCardsByMode = {
  personal: [
    {
      id: "math",
      title: "分数应用题练习",
      label: "数学",
      reason: "因为你最近常做应用题。",
      detail: "系统觉得你在‘分数应用题’这类题上练习最多，所以继续推相近题型给你。",
    },
    {
      id: "read",
      title: "阅读理解训练",
      label: "语文",
      reason: "因为你上周完成了阅读单元。",
      detail: "系统根据你最近完成的单元，推了更多阅读理解内容给你。",
    },
    {
      id: "eng",
      title: "英语词汇复习",
      label: "英语",
      reason: "因为你最近刚学到这个词汇包。",
      detail: "系统把刚学过的词汇包放进推荐，帮助你及时复习。",
    },
    {
      id: "science",
      title: "科学图文短读",
      label: "科学",
      reason: "因为你最近在学环境主题。",
      detail: "系统发现你最近学过环境主题，就推送了相关科学短读。",
    },
  ],
  popular: [
    {
      id: "hot1",
      title: "全校都在做的期中冲刺卷",
      label: "综合",
      reason: "因为很多同学最近都在学这个。",
      detail: "这是最近最热门的学习资源，所以系统优先展示。",
    },
    {
      id: "hot2",
      title: "高频错题小测",
      label: "数学",
      reason: "因为它在全校很热门。",
      detail: "系统根据全校使用量推送，而不是只看你的个人记录。",
    },
    {
      id: "hot3",
      title: "英语热门口语跟读",
      label: "英语",
      reason: "因为很多同学本周都打开过。",
      detail: "热门模式更容易推热门资源，不一定最贴合你个人需要。",
    },
    {
      id: "hot4",
      title: "阅读高分技巧卡",
      label: "语文",
      reason: "因为这是最近点赞很多的内容。",
      detail: "热门内容会被优先展示，但也可能让大家看到差不多的东西。",
    },
  ],
  explore: [
    {
      id: "new1",
      title: "科学实验观察记录",
      label: "科学",
      reason: "因为系统想让你试试新方向。",
      detail: "探索模式会加入你平常较少点开的内容，帮助你拓展学习视角。",
    },
    {
      id: "new2",
      title: "非虚构阅读入门",
      label: "语文",
      reason: "因为你很少打开这类内容。",
      detail: "系统故意推送你较少接触的阅读类型，让你看到新的学习方向。",
    },
    {
      id: "new3",
      title: "数据图表基础课",
      label: "综合",
      reason: "因为这和你当前课程有关，但你平时很少点。",
      detail: "探索模式不只看过去，也会帮你试试新的学习路径。",
    },
    {
      id: "new4",
      title: "英语短视频听力挑战",
      label: "英语",
      reason: "因为系统想看看你会不会对新形式有兴趣。",
      detail: "探索模式会加入一些新形式内容，帮助你跳出固定推荐。",
    },
  ],
};

// World 2 data
const infoTaskDrafts = {
  A: {
    title: "版本 A",
    text: "塑料污染会影响海洋环境，所以大家应该尽量少用塑料。",
    claims: [
      "塑料污染会影响海洋环境。",
      "大家应该尽量少用塑料。",
      "只要少用塑料，这个问题就能很快解决。",
    ],
  },
  B: {
    title: "版本 B",
    text: "塑料进入海洋后可能变成更小的塑料微粒，影响海洋生物和食物链。减少一次性塑料、分类回收和长期行动都很重要。",
    claims: [
      "塑料进入海洋后可能变成更小的塑料微粒。",
      "塑料微粒可能影响海洋生物和食物链。",
      "减少一次性塑料、分类回收和长期行动都很重要。",
    ],
  },
} as const;

type ClaimStatus = "keep" | "check" | "remove";

// World 3 data
const recipients: Array<{ id: W3Recipient; emoji: string; title: string; note: string }> = [
  { id: "junior", emoji: "🌱", title: "刚升上中学的学弟妹", note: "想让他安心一点" },
  { id: "stress", emoji: "🌙", title: "最近压力很大的同学", note: "想让他感觉被理解" },
  { id: "new", emoji: "🎈", title: "新加入学校的同学", note: "想让他不那么紧张" },
  { id: "elder", emoji: "☀️", title: "社区长者", note: "想让他感到被关心" },
];

const draftSamples: Record<W3Recipient, string> = {
  junior:
    "我刚上中学的时候，也很怕自己跟不上，连午饭时间都不知道该跟谁坐。后来我发现，只要先找到一两个愿意一起聊天、一起做功课的人，心里就会安稳很多。你不用一下子什么都做得很好，慢慢来就可以。",
  stress:
    "如果你最近真的很累，也不用一直假装自己没事。很多时候，先让自己休息一下，比逼自己继续撑着更重要。你不是不够好，你只是已经很辛苦了。",
  new:
    "刚来到一个新地方的时候，真的会有点不安。我以前也会担心自己说错话、找不到人一起走。后来我发现，只要先认识一两个愿意打招呼的人，很多事情都会慢慢变容易。",
  elder:
    "谢谢您每次见到我们都会笑着打招呼。有时候，光是听到您温柔地问一句“今天过得怎么样”，就会让人心里暖暖的。也希望您每天都能感受到别人对您的关心。",
};

const promptTags = [
  "保留我的语气",
  "不要删掉我的例子",
  "写得更温暖一点",
  "更像写给这个人",
  "不要太正式",
];

type W3HelpTag =
  | "keep_voice"
  | "keep_example"
  | "warmer_tone"
  | "fit_recipient"
  | "less_formal";

type W3TextState =
  | "too_short"
  | "too_direct"
  | "too_formal"
  | "good_but_generic";

function detectW3TextState(text: string): W3TextState {
  const clean = text.trim();
  const length = clean.length;

  const directPattern =
    /你应该|你要|不要想太多|赶快|快点|必须|應該|要快啲|必須|should|must|you need to/i;

  const formalPattern =
    /衷心|祝愿|希望您|愿你|愿您|誠摯|謹此|sincerely|wish you|I would like to/i;

  if (length < 28) return "too_short";
  if (directPattern.test(clean)) return "too_direct";
  if (formalPattern.test(clean)) return "too_formal";
  return "good_but_generic";
}

function detectW3HelpTag(prompt: string, selectedTags: string[]): W3HelpTag {
  const merged = `${prompt} ${selectedTags.join(" ")}`;

  if (/保留我的语气|保留我的語氣|keep my voice|自己的语气|自己的語氣/i.test(merged)) {
    return "keep_voice";
  }
  if (/不要删掉我的例子|不要刪掉我的例子|keep my example|例子|經歷|经历/i.test(merged)) {
    return "keep_example";
  }
  if (/写得更温暖一点|寫得更溫暖一點|warmer|温暖|溫暖/i.test(merged)) {
    return "warmer_tone";
  }
  if (/更像写给这个人|更像寫給這個人|fit this person|写给这个人|寫給這個人/i.test(merged)) {
    return "fit_recipient";
  }
  if (/不要太正式|less formal|太正式|太工整/i.test(merged)) {
    return "less_formal";
  }

  return "warmer_tone";
}

const W3_RECIPIENT_WRAPPER: Record<
  W3Recipient,
  Record<Locale, { opener: string; closer: string }>
> = {
  junior: {
    "zh-Hans": {
      opener: "刚升上中学时，紧张和不适应都很正常。",
      closer: "你不用一下子把所有事情都做好，先慢慢找到自己的节奏就可以。",
    },
    "zh-Hant": {
      opener: "剛升上中學時，緊張和不適應都很正常。",
      closer: "你不用一下子把所有事情都做好，先慢慢找到自己的節奏就可以。",
    },
    en: {
      opener: "Feeling nervous when starting secondary school is completely normal.",
      closer: "You do not need to handle everything at once. It is okay to settle in step by step.",
    },
  },
  stress: {
    "zh-Hans": {
      opener: "如果你最近真的很累，先承认自己辛苦了，也是很重要的一步。",
      closer: "你不是不够好，只是已经承担了很多，慢一点也没有关系。",
    },
    "zh-Hant": {
      opener: "如果你最近真的很累，先承認自己辛苦了，也是很重要的一步。",
      closer: "你不是不夠好，只是已經承擔了很多，慢一點也沒有關係。",
    },
    en: {
      opener: "If you have been under a lot of pressure lately, it matters to first admit that this has been hard.",
      closer: "It does not mean you are not good enough. It may simply mean you have been carrying a lot.",
    },
  },
  new: {
    "zh-Hans": {
      opener: "来到一个新地方，会不安、会紧张，其实真的很正常。",
      closer: "你不用马上变得很会适应，先让自己安心下来就已经很好了。",
    },
    "zh-Hant": {
      opener: "來到一個新地方，會不安、會緊張，其實真的很正常。",
      closer: "你不用馬上變得很會適應，先讓自己安心下來就已經很好了。",
    },
    en: {
      opener: "Feeling unsure in a new place is very normal.",
      closer: "You do not have to adapt immediately. Feeling a bit more settled is already a good start.",
    },
  },
  elder: {
    "zh-Hans": {
      opener: "谢谢您一直愿意听别人说话，这份温柔本身就很珍贵。",
      closer: "也希望您每天都能有一点轻松和被关心的感觉。",
    },
    "zh-Hant": {
      opener: "謝謝您一直願意聽別人說話，這份溫柔本身就很珍貴。",
      closer: "也希望您每天都能有一點輕鬆和被關心的感覺。",
    },
    en: {
      opener: "Thank you for always being willing to listen. That kindness matters.",
      closer: "I also hope you can feel cared for and a little more at ease each day.",
    },
  },
};

const W3_CORE_REPLY: Record<
  W3HelpTag,
  Record<W3TextState, Record<Locale, string>>
> = {
  keep_voice: {
    too_short: {
      "zh-Hans": "你这段已经有自己的意思了，但现在还太短，别人不太容易感受到你的关心。你可以先保留你最想说的一句，再补一句更具体的话。",
      "zh-Hant": "你這段已經有自己的意思了，但現在還太短，別人不太容易感受到你的關心。你可以先保留你最想說的一句，再補一句更具體的話。",
      en: "Your message already has your own intention, but it is still quite short. Keep the sentence you most want to say, then add one more specific line.",
    },
    too_direct: {
      "zh-Hans": "你现在的语气是有个人感觉的，只是有一点太像在告诉对方该怎么做。可以先保留你的原话，再把最硬的一句稍微放软一点。",
      "zh-Hant": "你現在的語氣是有個人感覺的，只是有一點太像在告訴對方該怎麼做。可以先保留你的原話，再把最硬的一句稍微放軟一點。",
      en: "Your voice is there, but one part sounds a bit too much like telling the person what to do. Keep your wording, but soften the strongest sentence a little.",
    },
    too_formal: {
      "zh-Hans": "现在这段有点太工整了，容易把你原本的感觉盖掉。你不用整段重写，只要把其中一两句改成更像你平时会说的话就够了。",
      "zh-Hant": "現在這段有點太工整了，容易把你原本的感覺蓋掉。你不用整段重寫，只要把其中一兩句改成更像你平時會說的話就夠了。",
      en: "This sounds a bit too polished, so your own voice is getting covered up. You do not need to rewrite everything. Just change one or two lines into something more natural for you.",
    },
    good_but_generic: {
      "zh-Hans": "这段已经有你的声音了。接下来重点不是大改，而是看看有没有一句能更明显地让人听出这是你在对他说。",
      "zh-Hant": "這段已經有你的聲音了。接下來重點不是大改，而是看看有沒有一句能更明顯地讓人聽出這是你在對他說。",
      en: "Your voice is already there. The next step is not a big rewrite. Just make one line sound even more clearly like something you would personally say.",
    },
  },

  keep_example: {
    too_short: {
      "zh-Hans": "你这段现在最大的问题不是例子被删掉，而是还没有真正放进自己的具体内容。你可以先加一个你自己经历过的小细节。",
      "zh-Hant": "你這段現在最大的問題不是例子被刪掉，而是還沒有真正放進自己的具體內容。你可以先加一個你自己經歷過的小細節。",
      en: "The main issue is not losing your example yet — it is that there is not much personal detail in the message. Add one small detail from your own experience first.",
    },
    too_direct: {
      "zh-Hans": "你有自己的意思，但现在更像建议，不太像经验分享。你可以把你应该这类句子缩短一点，换成一小段你自己经历过的感受。",
      "zh-Hant": "你有自己的意思，但現在更像建議，不太像經驗分享。你可以把你應該這類句子縮短一點，換成一小段你自己經歷過的感受。",
      en: "You have your own message, but it sounds more like advice than experience. Try shortening the directive part and replacing it with a small feeling or example from your own experience.",
    },
    too_formal: {
      "zh-Hans": "这段看起来比较完整，但你原本的个人感觉有点被磨平了。你可以保留整体结构，再把一处具体经历或感受补回来。",
      "zh-Hant": "這段看起來比較完整，但你原本的個人感覺有點被磨平了。你可以保留整體結構，再把一處具體經歷或感受補回來。",
      en: "This looks complete, but some of your personal feeling has been smoothed out. Keep the structure, and add back one concrete experience or feeling.",
    },
    good_but_generic: {
      "zh-Hans": "这段已经有一些自己的内容了。现在最值得做的是检查：哪一句是你最想保留的个人经验，不要让它被改成太通用的话。",
      "zh-Hant": "這段已經有一些自己的內容了。現在最值得做的是檢查：哪一句是你最想保留的個人經驗，不要讓它被改成太通用的話。",
      en: "This already has some personal content. Now check which line contains the experience you most want to keep, and make sure it does not get turned into something too general.",
    },
  },

  warmer_tone: {
    too_short: {
      "zh-Hans": "这段方向是好的，但现在还比较短，温度不太够。你可以加一句更像陪伴的话，而不只是简单鼓励一下。",
      "zh-Hant": "這段方向是好的，但現在還比較短，溫度不太夠。你可以加一句更像陪伴的話，而不只是簡單鼓勵一下。",
      en: "The direction is good, but it is still a bit short, so the warmth does not come through yet. Add one line that sounds more like staying with the person, not just cheering them on.",
    },
    too_direct: {
      "zh-Hans": "这段意思很清楚，不过语气有点像在要求对方改变。你可以把最直接的一句改成更像理解对方、陪着对方的说法。",
      "zh-Hant": "這段意思很清楚，不過語氣有點像在要求對方改變。你可以把最直接的一句改成更像理解對方、陪着對方的說法。",
      en: "The meaning is clear, but the tone sounds a bit like asking the person to change. Try rewriting the strongest line so it sounds more understanding and supportive.",
    },
    too_formal: {
      "zh-Hans": "这段不算冷，但有点太正式，所以温度会被削弱。你可以保留意思，把其中一句改成更像平时会说的话，通常就会温暖很多。",
      "zh-Hant": "這段不算冷，但有點太正式，所以溫度會被削弱。你可以保留意思，把其中一句改成更像平時會說的話，通常就會溫暖很多。",
      en: "This is not cold, but it sounds too formal, which weakens the warmth. Keep the meaning, but make one sentence sound more natural and everyday.",
    },
    good_but_generic: {
      "zh-Hans": "这段已经有一定温度了。现在可以再想一想：有没有一句能更明确地让对方感到你是真的理解他。",
      "zh-Hant": "這段已經有一定溫度了。現在可以再想一想：有沒有一句能更明確地讓對方感到你是真的理解他。",
      en: "This already has some warmth. Now think about whether one line could make the person feel even more clearly that you really understand them.",
    },
  },

  fit_recipient: {
    too_short: {
      "zh-Hans": "现在这段还看不太出来你是在写给这个人。你可以加一句只有这个对象才会用到的话，让对象感更清楚。",
      "zh-Hant": "現在這段還看不太出來你是在寫給這個人。你可以加一句只有這個對象才會用到的話，讓對象感更清楚。",
      en: "Right now it is still hard to tell who this message is for. Add one line that would only fit this specific person.",
    },
    too_direct: {
      "zh-Hans": "你有在表达关心，但现在更像一般性的建议。可以先少讲一点道理，多写一句和这个人的处境更贴近的话。",
      "zh-Hant": "你有在表達關心，但現在更像一般性的建議。可以先少講一點道理，多寫一句和這個人的處境更貼近的話。",
      en: "You are showing care, but it still sounds like general advice. Try giving less instruction and adding one line that fits this person’s situation more closely.",
    },
    too_formal: {
      "zh-Hans": "这段结构很整齐，但对象感有点弱，所以谁看都差不多。你可以补一句更像只会对这个人说的话。",
      "zh-Hant": "這段結構很整齊，但對象感有點弱，所以誰看都差不多。你可以補一句更像只會對這個人說的話。",
      en: "The structure is neat, but it does not feel specific enough to this person. Add one line that sounds like something you would only say to them.",
    },
    good_but_generic: {
      "zh-Hans": "这段方向是对的，只是还可以再更贴近一点。你可以问自己：如果换成另一个对象，这段是不是也一样能用？如果答案是可以，就说明还可以再更针对一点。",
      "zh-Hant": "這段方向是對的，只是還可以再更貼近一點。你可以問自己：如果換成另一個對象，這段是不是也一樣能用？如果答案是可以，就說明還可以再更針對一點。",
      en: "The direction is right, but it can still be more specific. Ask yourself: would this still work for a different person? If yes, then it can be made more targeted.",
    },
  },

  less_formal: {
    too_short: {
      "zh-Hans": "你这段现在还不算正式，反而是内容有点少。与其担心太正式，不如先补一句更具体的话。",
      "zh-Hant": "你這段現在還不算正式，反而是內容有點少。與其擔心太正式，不如先補一句更具體的話。",
      en: "This is not too formal yet. The bigger issue is that it is still a bit thin. Add one more specific line first.",
    },
    too_direct: {
      "zh-Hans": "这段主要问题不是正式，而是太直接。你可以先把最硬的一句变得更自然一点，读起来就不会那么像命令。",
      "zh-Hant": "這段主要問題不是正式，而是太直接。你可以先把最硬的一句變得更自然一點，讀起來就不會那麼像命令。",
      en: "The main issue is not formality. It is that the tone is too direct. Make the strongest sentence sound more natural, and it will feel less like an order.",
    },
    too_formal: {
      "zh-Hans": "这段确实有点太正式了，像整理过头的标准答案。你不用整段改，只要把一两句换成更像你平常会说的话，效果就会明显不同。",
      "zh-Hant": "這段確實有點太正式了，像整理過頭的標準答案。你不用整段改，只要把一兩句換成更像你平常會說的話，效果就會明顯不同。",
      en: "This really is a bit too formal, almost like an over-polished model answer. You do not need to rewrite it all. Just change one or two sentences into something more natural for you.",
    },
    good_but_generic: {
      "zh-Hans": "这段整体已经不错，但有一两句还是偏工整。你可以挑一句最长、最书面的句子，先把它改得更自然一点。",
      "zh-Hant": "這段整體已經不錯，但有一兩句還是偏工整。你可以挑一句最長、最書面的句子，先把它改得更自然一點。",
      en: "This is already quite good, but one or two lines still sound too polished. Pick the longest or most written-sounding sentence and make it more natural.",
    },
  },
};

const W3_SECOND_TURN_SUFFIX: Record<Locale, string> = {
  "zh-Hans": "这次你可以只改最关键的一两句，不用整段重写。",
  "zh-Hant": "這次你可以只改最關鍵的一兩句，不用整段重寫。",
  en: "This time, try changing just one or two key lines instead of rewriting the whole message.",
};

// World 4 data
const commuteSurvey = [
  { type: "步行", count: 18, note: "离学校近的同学较多" },
  { type: "家长接送", count: 12, note: "早高峰比较集中" },
  { type: "校车/公交", count: 9, note: "主要来自较远社区" },
  { type: "骑车", count: 6, note: "需要考虑安全路线" },
];

const roleOutputs = {
  data: {
    title: "数据整理助手",
    body: [
      "步行 40.0%",
      "家长接送 26.7%",
      "校车/公交 20.0%",
      "骑车 13.3%",
    ],
  },
  summary: {
    title: "摘要助手",
    body: [
      "步行是最常见的上学方式。",
      "家长接送集中在早高峰，容易堵车。",
      "较远社区的同学更依赖校车或公交。",
    ],
  },
  draft: {
    title: "建议草稿助手",
    body: [
      "建议学校优化校门口高峰时段通行安排。",
      "建议为步行和骑车同学设计更安全的路线提示。",
      "建议在简报中提醒大家不同上学方式的需要不一样。",
    ],
  },
} as const;

// World 5 data
const recycleCases = {
  lighting: {
    title: "昏暗光线下的塑料瓶",
    emoji: "🌃",
    system: "系统把它判成了‘其他垃圾’。",
    actual: "更合理的判断是‘可回收物’。",
  },
  crushed: {
    title: "被压扁后的纸盒",
    emoji: "📦",
    system: "系统把它判成了‘其他垃圾’。",
    actual: "更合理的判断是‘可回收物’。",
  },
  similar: {
    title: "外形很像的塑料杯和纸杯",
    emoji: "🥤",
    system: "系统把它们判成了同一类。",
    actual: "它们其实不应该被完全一样地处理。",
  },
} as const;

const trainingImagesByCase = {
  lighting: [
    { id: "l1", title: "不同光线下的塑料瓶", note: "更贴近真实环境", good: true },
    { id: "l2", title: "只在明亮白底下拍的塑料瓶", note: "场景太单一", good: false },
    { id: "l3", title: "教室、走廊、户外不同背景", note: "更有代表性", good: true },
    { id: "l4", title: "和垃圾分类无关的猫咪照片", note: "不相关", good: false },
  ],
  crushed: [
    { id: "c1", title: "压扁、折叠后的纸盒", note: "能让系统看见真实变化", good: true },
    { id: "c2", title: "只有完整平整的纸盒", note: "形态太单一", good: false },
    { id: "c3", title: "不同破损程度的纸盒", note: "更贴近真实投放前状态", good: true },
    { id: "c4", title: "教室桌面照片", note: "和任务没关系", good: false },
  ],
  similar: [
    { id: "s1", title: "外形相近但材质不同的杯子", note: "帮助系统学会区分", good: true },
    { id: "s2", title: "只有一种塑料杯", note: "没有比较关系", good: false },
    { id: "s3", title: "带盖、带吸管、带标签的杯子", note: "更贴近真实情况", good: true },
    { id: "s4", title: "风景照片", note: "和分类任务无关", good: false },
  ],
} as const;


function getLocalizedWorldMeta(locale: Locale) {
  return {
    w1: {
      ...WORLD_META.w1,
      title: tr(locale, WORLD_META.w1.title),
      subtitle: tr(locale, WORLD_META.w1.subtitle),
    },
    w2: {
      ...WORLD_META.w2,
      title: tr(locale, WORLD_META.w2.title),
      subtitle: tr(locale, WORLD_META.w2.subtitle),
    },
    w3: {
      ...WORLD_META.w3,
      title: tr(locale, WORLD_META.w3.title),
      subtitle: tr(locale, WORLD_META.w3.subtitle),
    },
    w4: {
      ...WORLD_META.w4,
      title: tr(locale, WORLD_META.w4.title),
      subtitle: tr(locale, WORLD_META.w4.subtitle),
    },
    w5: {
      ...WORLD_META.w5,
      title: tr(locale, WORLD_META.w5.title),
      subtitle: tr(locale, WORLD_META.w5.subtitle),
    },
  } as const;
}

const studentEntryText = {
  "zh-Hans": {
    title: "开始前先填一下资料",
    note: "填好就可以开始任务。老师会用这些资料对应你的测试结果。",
    name: "姓名 *",
    code: "学号 *",
    className: "班级 *",
    school: "学校",
    grade: "年级",
    start: "开始测试",
    starting: "正在进入…",
    back: "返回入口页",
    required: "带 * 的项目需要填写",
  },
  "zh-Hant": {
    title: "開始前先填一下資料",
    note: "填好後就可以開始任務。老師會用這些資料對應你的測試結果。",
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
    note: "After that, you can start the missions. Your teacher will use these details to match your results.",
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

type W3AiRewriteResult = {
  mode: "rewrite" | "scaffold";
  rewritten: string;
  note: string;
};

function normalizeW3Text(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function isW3LowQualityDraft(text: string) {
  const clean = normalizeW3Text(text);
  const stripped = clean.replace(/[\s，。！？,.!?、"'“”‘’（）()]/g, "");

  if (stripped.length < 12) return true;

  // 连续重复，例如：水水水水水水、哈哈哈哈哈哈
  if (/([\u4e00-\u9fa5A-Za-z])\1{4,}/.test(stripped)) return true;

  // 字符种类太少，说明大概率是无意义重复输入
  const uniqueChars = new Set(stripped.split(""));
  if (stripped.length >= 10 && uniqueChars.size <= 4) return true;

  // 缺少明显句子结构，也没有表达对象或感受
  const hasFeelingWord =
    /谢谢|希望|担心|紧张|开心|温暖|安心|理解|关心|辛苦|不安|害怕|累|thank|hope|feel|care|warm|nervous|tired/i.test(clean);

  if (stripped.length < 24 && !hasFeelingWord) return true;

  return false;
}

function buildW3StarterLine(locale: Locale, recipient: W3Recipient) {
  const lines = {
    "zh-Hans": {
      junior: "希望你刚升上中学时，可以慢慢找到让自己安心的节奏。",
      stress: "希望你这几天能感觉轻松一点，也知道有人在关心你。",
      new: "希望你来到新学校后，可以慢慢找到让自己安心的人和事。",
      elder: "谢谢您每次温柔地和我们打招呼，也希望您每天都能感受到别人的关心。",
    },
    "zh-Hant": {
      junior: "希望你剛升上中學時，可以慢慢找到讓自己安心的節奏。",
      stress: "希望你這幾天能感覺輕鬆一點，也知道有人在關心你。",
      new: "希望你來到新學校後，可以慢慢找到讓自己安心的人和事。",
      elder: "謝謝您每次溫柔地和我們打招呼，也希望您每天都能感受到別人的關心。",
    },
    en: {
      junior: "I hope you can slowly find your own rhythm as you start secondary school.",
      stress: "I hope these days can feel a little lighter, and that you know someone cares about you.",
      new: "I hope you can slowly find people and moments that help you feel safe in your new school.",
      elder: "Thank you for greeting us so kindly. I hope you can also feel cared for each day.",
    },
  } as const;

  return lines[locale][recipient];
}

function buildW3LowQualityScaffold(locale: Locale, recipient: W3Recipient): W3AiRewriteResult {
  const starter = buildW3StarterLine(locale, recipient);

  if (locale === "en") {
    return {
      mode: "scaffold",
      rewritten: "",
      note:
        `I still cannot clearly tell what you most want to say, so I will not rewrite the whole message yet.\n\n` +
        `Try adding two things first:\n` +
        `1. How do you want this person to feel after reading your card?\n` +
        `2. Is there one sentence, feeling, or small detail you want to keep?\n\n` +
        `You could start with this line:\n${starter}`,
    };
  }

  if (locale === "zh-Hant") {
    return {
      mode: "scaffold",
      rewritten: "",
      note:
        `我現在還不太看得出你最想對對方說什麼，所以先不直接幫你改寫整段。\n\n` +
        `你可以先補這兩點：\n` +
        `1. 你希望對方看完後有什麼感覺？\n` +
        `2. 有沒有一句你特別想保留的話，或者一個小細節？\n\n` +
        `你也可以先從這一句開始：\n${starter}`,
    };
  }

  return {
    mode: "scaffold",
    rewritten: "",
    note:
      `我现在还看不太出你最想对对方说什么，所以先不直接帮你改写整段。\n\n` +
      `你可以先补这两点：\n` +
      `1. 你希望对方看完后有什么感觉？\n` +
      `2. 有没有一句你特别想保留的话，或者一个小细节？\n\n` +
      `你也可以先从这一句开始：\n${starter}`,
  };
}

function applyW3Softening(text: string) {
  return text
    .replace(/你应该/g, "你可以先试试")
    .replace(/你要/g, "你可以")
    .replace(/不要想太多/g, "先不用一下子把所有事都想清楚")
    .replace(/赶快/g, "慢慢")
    .replace(/快点/g, "慢慢")
    .replace(/必须/g, "可以先")
    .replace(/你應該/g, "你可以先試試")
    .replace(/你要/g, "你可以")
    .replace(/不要想太多/g, "先不用一下子把所有事都想清楚")
    .replace(/必須/g, "可以先");
}

function applyW3LessFormal(text: string) {
  return text
    .replace(/衷心希望您/g, "希望您")
    .replace(/祝愿/g, "希望")
    .replace(/誠摯/g, "")
    .replace(/謹此/g, "")
    .replace(/希望您能够/g, "希望您可以")
    .replace(/希望您能夠/g, "希望您可以");
}

function buildW3RecipientEnding(locale: Locale, recipient: W3Recipient) {
  const endings = {
    "zh-Hans": {
      junior: "你不用一下子把所有事情都做好，慢慢来也可以。",
      stress: "你不是不够好，只是已经承担了很多。",
      new: "你不用马上变得很会适应，先慢慢安心下来就很好。",
      elder: "也希望您每天都能感受到别人对您的关心。",
    },
    "zh-Hant": {
      junior: "你不用一下子把所有事情都做好，慢慢來也可以。",
      stress: "你不是不夠好，只是已經承擔了很多。",
      new: "你不用馬上變得很會適應，先慢慢安心下來就很好。",
      elder: "也希望您每天都能感受到別人對您的關心。",
    },
    en: {
      junior: "You do not need to get everything right at once. It is okay to take things step by step.",
      stress: "You are not failing. You have simply been carrying a lot.",
      new: "You do not have to adapt immediately. It is enough to settle in little by little.",
      elder: "I also hope you can feel care and kindness from others each day.",
    },
  } as const;

  return endings[locale][recipient];
}

function buildW3AiRewriteLocalized(
  locale: Locale,
  recipient: W3Recipient,
  sourceText: string,
  selectedTags: string[]
): W3AiRewriteResult {
  if (isW3LowQualityDraft(sourceText)) {
    return buildW3LowQualityScaffold(locale, recipient);
  }

  const tagsText = selectedTags.join(" ");
  const wantsKeepVoice = /保留我的语气|保留我的語氣|keep/i.test(tagsText);
  const wantsKeepExample = /例子|example/i.test(tagsText);
  const wantsWarmer = /温暖|溫暖|warmer/i.test(tagsText);
  const wantsFitRecipient = /写给这个人|寫給這個人|fit/i.test(tagsText);
  const wantsLessFormal = /不要太正式|less formal|太正式/i.test(tagsText);

  let rewritten = normalizeW3Text(sourceText);

  if (wantsLessFormal) {
    rewritten = applyW3LessFormal(rewritten);
  }

  if (wantsWarmer || wantsFitRecipient) {
    rewritten = applyW3Softening(rewritten);
  }

  const sentences = rewritten
    .split(/[。！？.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);

  let mainBody = rewritten;

  if (sentences.length > 0) {
    if (wantsKeepExample && sentences.length >= 2) {
      mainBody = `${sentences[0]}。${sentences[1]}。`;
    } else if (wantsKeepVoice && sentences.length >= 1) {
      mainBody = `${sentences.join("。")}。`;
    }
  }

  if (wantsFitRecipient || wantsWarmer) {
    const ending = buildW3RecipientEnding(locale, recipient);
    if (locale === "en") {
      mainBody = mainBody.replace(/[。！？]$/g, "");
      if (!/[.!?]$/.test(mainBody)) mainBody += ".";
      mainBody = `${mainBody} ${ending}`;
    } else {
      if (!/[。！？]$/.test(mainBody)) mainBody += "。";
      mainBody = `${mainBody}${ending}`;
    }
  }

  const noteParts =
    locale === "en"
      ? [
          wantsKeepVoice ? "I tried to keep your original voice" : "",
          wantsKeepExample ? "I kept your example or personal feeling" : "",
          wantsWarmer ? "I made the tone warmer" : "",
          wantsFitRecipient ? "I made it sound more like it is written for this person" : "",
          wantsLessFormal ? "I made the wording less formal" : "",
        ].filter(Boolean)
      : locale === "zh-Hant"
      ? [
          wantsKeepVoice ? "我盡量保留了你原來的語氣" : "",
          wantsKeepExample ? "沒有刪掉你原來的例子或個人感受" : "",
          wantsWarmer ? "把語氣調得更溫暖一點" : "",
          wantsFitRecipient ? "讓內容更像是寫給這個對象的" : "",
          wantsLessFormal ? "把太工整的地方改得更自然一點" : "",
        ].filter(Boolean)
      : [
          wantsKeepVoice ? "我尽量保留了你原来的语气" : "",
          wantsKeepExample ? "没有删掉你原来的例子或个人感受" : "",
          wantsWarmer ? "把语气调得更温暖一点" : "",
          wantsFitRecipient ? "让内容更像是写给这个对象的" : "",
          wantsLessFormal ? "把太工整的地方改得更自然一点" : "",
        ].filter(Boolean);

  return {
    mode: "rewrite",
    rewritten: mainBody,
    note:
      noteParts.length > 0
        ? noteParts.join(locale === "en" ? "; " : "；")
        : locale === "en"
        ? "I made the wording clearer while keeping the main meaning."
        : locale === "zh-Hant"
        ? "我在保留主要意思的基礎上，讓表達更清楚。"
        : "我在保留主要意思的基础上，让表达更清楚。",
  };
}

function buildW3VisibleUserMessage(locale: Locale, prompt: string, selectedTags: string[]) {
  const finalPrompt =
    prompt.trim() ||
    (locale === "en"
      ? "Please help me make this card clearer."
      : locale === "zh-Hant"
      ? "請幫我把這張卡片改得更清楚一點。"
      : "请帮我把这张卡片改得更清楚一点。");

  if (selectedTags.length === 0) return finalPrompt;

  return locale === "en"
    ? `${finalPrompt}\nRevision goals: ${selectedTags.join(", ")}`
    : `${finalPrompt}\n修改要求：${selectedTags.join("、")}`;
}

export default function Page() {
  const [locale, setLocale] = useState<Locale>("zh-Hans");
  const [screen, setScreen] = useState<Screen>("home");
  const [completed, setCompleted] = useState<Record<WorldId, boolean>>({
    w1: false,
    w2: false,
    w3: false,
    w4: false,
    w5: false,
  });
  const [sessionId, setSessionId] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [identity, setIdentity] = useState<IdentityForm>({
    studentName: "",
    studentCode: "",
    className: "",
    schoolName: "",
    gradeLevel: "",
  });
  const [identityError, setIdentityError] = useState("");
  const [startingSession, setStartingSession] = useState(false);

  // World 1
  const [w1Step, setW1Step] = useState(0);
  const [w1OpenedCards, setW1OpenedCards] = useState<string[]>([]);
  const [w1Mode, setW1Mode] = useState<"personal" | "popular" | "explore">("personal");
  const [w1VisitedModes, setW1VisitedModes] = useState<string[]>(["personal"]);
  const [w1BestMode, setW1BestMode] = useState("");
  const [w1NarrowMode, setW1NarrowMode] = useState("");
  const [w1Rules, setW1Rules] = useState({
    explainReason: true,
    teacherReview: true,
    tryNewThings: true,
    onlyPopular: false,
    sayWhatDataUsed: true,
  });
  const [w1Good, setW1Good] = useState("");
  const [w1Warn, setW1Warn] = useState("");

  // World 2
  const [w2Step, setW2Step] = useState(0);
  const [w2RoleChoice, setW2RoleChoice] = useState("");
  const [w2DraftChoice, setW2DraftChoice] = useState<"A" | "B" | "">("");
  const [w2ClaimStatus, setW2ClaimStatus] = useState<Record<string, ClaimStatus | "">>({});
  const [w2FinalReason, setW2FinalReason] = useState("");

  // World 3
// World 3
const [w3Step, setW3Step] = useState(0);
const [w3Recipient, setW3Recipient] = useState<W3Recipient | "">("");
const [w3Draft, setW3Draft] = useState("");
const [w3Prompt, setW3Prompt] = useState("");
const [w3PromptTags, setW3PromptTags] = useState<string[]>([]);
const [w3Chat, setW3Chat] = useState<ChatMessage[]>([]);
const [w3FinalText, setW3FinalText] = useState("");
const [w3Checklist, setW3Checklist] = useState<string[]>([]);

// World 3 Step 5: AI collaboration review
const [w3HelpfulTags, setW3HelpfulTags] = useState<string[]>([]);
const [w3LimitationTags, setW3LimitationTags] = useState<string[]>([]);
const [w3UsabilityFeedback, setW3UsabilityFeedback] = useState("");
  // World 4
  const [w4Step, setW4Step] = useState(0);
  const [w4AiTasks, setW4AiTasks] = useState<string[]>([]);
  const [w4Role, setW4Role] = useState<"data" | "summary" | "draft" | "">("");
  const [w4UseChoice, setW4UseChoice] = useState("");
  const [w4HumanStillDo, setW4HumanStillDo] = useState<string[]>([]);
  const [w4Rules, setW4Rules] = useState<string[]>([]);
  const [w4Reminder, setW4Reminder] = useState("");

  // World 5
  const [w5Step, setW5Step] = useState(0);
  const [w5Problem, setW5Problem] = useState<"lighting" | "crushed" | "similar" | "">("");
  const [w5Cause, setW5Cause] = useState("");
  const [w5Training, setW5Training] = useState<string[]>([]);
  const [w5Reminders, setW5Reminders] = useState<string[]>([]);
  const [w5Card, setW5Card] = useState({
    purpose: "",
    limits: "",
    reminder: "",
    improve: "",
  });

  
  const worldMeta = useMemo(() => getLocalizedWorldMeta(locale), [locale]);

  useEffect(() => {
  const saved = readSavedLocale();
  setLocale(saved);
}, []);

  const learningCardsByModeData = useMemo(() => ({
    personal: [
      { id: "math", title: locale === "en" ? "Fraction word-problem practice" : locale === "zh-Hant" ? "分數應用題練習" : "分数应用题练习", label: locale === "en" ? "Math" : locale === "zh-Hant" ? "數學" : "数学", reason: locale === "en" ? "Because you have practised word problems recently." : locale === "zh-Hant" ? "因為你最近常做應用題。" : "因为你最近常做应用题。", detail: locale === "en" ? "The system noticed that you spend the most time on fraction word problems, so it kept recommending similar practice." : locale === "zh-Hant" ? "系統發現你最近花較多時間在分數應用題，所以繼續推送相近題型。" : "系统觉得你在‘分数应用题’这类题上练习最多，所以继续推相近题型给你。" },
      { id: "read", title: locale === "en" ? "Reading comprehension drill" : locale === "zh-Hant" ? "閱讀理解訓練" : "阅读理解训练", label: locale === "en" ? "Chinese" : locale === "zh-Hant" ? "中文" : "语文", reason: locale === "en" ? "Because you finished the reading unit last week." : locale === "zh-Hant" ? "因為你上星期完成了閱讀單元。" : "因为你上周完成了阅读单元。", detail: locale === "en" ? "The system recommended more reading tasks based on your recent unit." : locale === "zh-Hant" ? "系統根據你最近完成的單元，推薦更多閱讀內容。" : "系统根据你最近完成的单元，推了更多阅读理解内容给你。" },
      { id: "eng", title: locale === "en" ? "English vocabulary review" : locale === "zh-Hant" ? "英語詞彙複習" : "英语词汇复习", label: "English", reason: locale === "en" ? "Because you just learned this vocabulary pack." : locale === "zh-Hant" ? "因為你剛學過這組詞彙。" : "因为你最近刚学到这个词汇包。", detail: locale === "en" ? "The system pushed the vocabulary pack back to you so you could review it in time." : locale === "zh-Hant" ? "系統把剛學過的詞彙包重新推送給你，方便及時複習。" : "系统把刚学过的词汇包放进推荐，帮助你及时复习。" },
      { id: "science", title: locale === "en" ? "Short science reading" : locale === "zh-Hant" ? "科學圖文短讀" : "科学图文短读", label: locale === "en" ? "Science" : locale === "zh-Hant" ? "科學" : "科学", reason: locale === "en" ? "Because you have been studying environmental topics." : locale === "zh-Hant" ? "因為你最近在學環境主題。" : "因为你最近在学环境主题。", detail: locale === "en" ? "The system noticed your recent topic and recommended a related science text." : locale === "zh-Hant" ? "系統看到你最近在學環境主題，所以推送了相關科學短讀。" : "系统发现你最近学过环境主题，就推送了相关科学短读。" },
    ],
    popular: [
      { id: "hot1", title: locale === "en" ? "Midterm practice paper everyone is using" : locale === "zh-Hant" ? "全校都在用的測驗衝刺卷" : "全校都在做的期中冲刺卷", label: locale === "en" ? "General" : locale === "zh-Hant" ? "綜合" : "综合", reason: locale === "en" ? "Because many students are using it this week." : locale === "zh-Hant" ? "因為很多同學這星期都在用。" : "因为很多同学最近都在学这个。", detail: locale === "en" ? "This is currently very popular across the school, so the system placed it near the top." : locale === "zh-Hant" ? "這是全校近期很熱門的資源，所以系統把它放在前面。" : "这是最近最热门的学习资源，所以系统优先展示。" },
      { id: "hot2", title: locale === "en" ? "High-frequency mistake quiz" : locale === "zh-Hant" ? "高頻錯題小測" : "高频错题小测", label: locale === "en" ? "Math" : locale === "zh-Hant" ? "數學" : "数学", reason: locale === "en" ? "Because it is popular across the school." : locale === "zh-Hant" ? "因為它在全校很熱門。" : "因为它在全校很热门。", detail: locale === "en" ? "The system recommended it based on school-wide activity, not only on your personal history." : locale === "zh-Hant" ? "系統是按全校使用情況推薦，不只是看你的個人紀錄。" : "系统根据全校使用量推送，而不是只看你的个人记录。" },
      { id: "hot3", title: locale === "en" ? "Popular speaking practice" : locale === "zh-Hant" ? "熱門口語跟讀" : "英语热门口语跟读", label: "English", reason: locale === "en" ? "Because many students opened it this week." : locale === "zh-Hant" ? "因為很多同學這星期都打開過。" : "因为很多同学本周都打开过。", detail: locale === "en" ? "The system is prioritising what other students are using most." : locale === "zh-Hant" ? "系統優先展示其他同學近期使用較多的內容。" : "系统正在优先展示大家最近最常用的内容。" },
      { id: "hot4", title: locale === "en" ? "Campus hot-topic science article" : locale === "zh-Hant" ? "校園熱門科學文章" : "校园热门科学文章", label: locale === "en" ? "Science" : locale === "zh-Hant" ? "科學" : "科学", reason: locale === "en" ? "Because it is currently trending on the platform." : locale === "zh-Hant" ? "因為它目前在平台上很熱門。" : "因为它目前在平台上很热门。", detail: locale === "en" ? "The recommendation comes from popularity, not from your individual learning needs." : locale === "zh-Hant" ? "這類推薦主要來自熱門程度，而不是你的個別學習需要。" : "这类推荐主要来自热度，而不是你的个人学习需要。" },
    ],
    explore: [
      { id: "exp1", title: locale === "en" ? "New science topic: climate stories" : locale === "zh-Hant" ? "新主題：氣候故事短讀" : "新主题：气候故事短读", label: locale === "en" ? "Explore" : locale === "zh-Hant" ? "探索" : "探索", reason: locale === "en" ? "Because the system is trying to broaden your reading range." : locale === "zh-Hant" ? "因為系統正在幫你擴闊閱讀範圍。" : "因为系统想帮你看到新的内容。", detail: locale === "en" ? "This recommendation is not only based on what you have already done." : locale === "zh-Hant" ? "這類推薦不是只按照你做過的內容來推。" : "这种推荐不是只看你已经学过什么。" },
      { id: "exp2", title: locale === "en" ? "Creative writing mini task" : locale === "zh-Hant" ? "創意寫作小任務" : "创意写作小任务", label: locale === "en" ? "Explore" : locale === "zh-Hant" ? "探索" : "探索", reason: locale === "en" ? "Because the system wants to offer a new direction." : locale === "zh-Hant" ? "因為系統想讓你試試新的方向。" : "因为系统想让你试试新的方向。", detail: locale === "en" ? "The system is trying to add something you do not usually choose." : locale === "zh-Hant" ? "系統嘗試加入你平時較少接觸的內容。" : "系统尝试加入你平时比较少碰的内容。" },
      { id: "exp3", title: locale === "en" ? "Cross-topic project idea" : locale === "zh-Hant" ? "跨主題小專題" : "跨主题小专题", label: locale === "en" ? "Explore" : locale === "zh-Hant" ? "探索" : "探索", reason: locale === "en" ? "Because the system is encouraging broader learning." : locale === "zh-Hant" ? "因為系統想鼓勵你接觸更廣的學習內容。" : "因为系统想鼓励你接触更广一点的学习内容。", detail: locale === "en" ? "This type of recommendation may feel less familiar but can widen your perspective." : locale === "zh-Hant" ? "這類推薦可能沒有那麼熟悉，但能幫助你擴闊視野。" : "这类推荐可能没那么熟悉，但能帮助你看到更多方向。" },
      { id: "exp4", title: locale === "en" ? "Visual learning card set" : locale === "zh-Hant" ? "圖像學習卡組" : "图像学习卡组", label: locale === "en" ? "Explore" : locale === "zh-Hant" ? "探索" : "探索", reason: locale === "en" ? "Because the system is testing a different study style." : locale === "zh-Hant" ? "因為系統想讓你試試不同的學習方式。" : "因为系统想让你试试不一样的学习方式。", detail: locale === "en" ? "It is offering a different format, not simply more of the same kind of work." : locale === "zh-Hant" ? "它提供的是不同形式的內容，而不是同一類練習的重複。" : "它推荐的是不同形式的内容，而不是同一类练习的重复。" },
    ],
  }), [locale]);

  const infoTaskDraftsData = useMemo(() => ({
    A: {
      title: locale === "en" ? "Draft A" : locale === "zh-Hant" ? "版本 A" : "版本 A",
      text: locale === "en" ? "Plastic pollution affects the ocean, so everyone should use less plastic." : locale === "zh-Hant" ? "塑膠污染會影響海洋環境，所以大家應該盡量少用塑膠。" : "塑料污染会影响海洋环境，所以大家应该尽量少用塑料。",
      claims: locale === "en" ? [
        "Plastic pollution affects the ocean.",
        "Everyone should use less plastic.",
        "If we use less plastic, the problem will be solved quickly.",
      ] : locale === "zh-Hant" ? [
        "塑膠污染會影響海洋環境。",
        "大家應該盡量少用塑膠。",
        "只要少用塑膠，這個問題就能很快解決。",
      ] : [
        "塑料污染会影响海洋环境。",
        "大家应该尽量少用塑料。",
        "只要少用塑料，这个问题就能很快解决。",
      ],
    },
    B: {
      title: locale === "en" ? "Draft B" : locale === "zh-Hant" ? "版本 B" : "版本 B",
      text: locale === "en" ? "When plastic enters the ocean, it can break into smaller particles that affect marine life and food chains. Reducing single-use plastic, sorting waste properly, and taking long-term action all matter." : locale === "zh-Hant" ? "塑膠進入海洋後，可能會變成更小的塑膠微粒，影響海洋生物和食物鏈。減少一次性塑膠、做好分類回收和長期行動都很重要。" : "塑料进入海洋后可能变成更小的塑料微粒，影响海洋生物和食物链。减少一次性塑料、分类回收和长期行动都很重要。",
      claims: locale === "en" ? [
        "Plastic can break into smaller particles in the ocean.",
        "Microplastics may affect marine life and food chains.",
        "Reducing single-use plastic, sorting waste properly, and long-term action all matter.",
      ] : locale === "zh-Hant" ? [
        "塑膠進入海洋後可能會變成更小的塑膠微粒。",
        "塑膠微粒可能影響海洋生物和食物鏈。",
        "減少一次性塑膠、分類回收和長期行動都很重要。",
      ] : [
        "塑料进入海洋后可能变成更小的塑料微粒。",
        "塑料微粒可能影响海洋生物和食物链。",
        "减少一次性塑料、分类回收和长期行动都很重要。",
      ],
    },
  }) as const, [locale]);

  const recipientOptions = useMemo<Array<{ id: W3Recipient; emoji: string; title: string; note: string }>>(() => (locale === "en" ? [
    { id: "junior", emoji: "🌱", title: "A younger student who just started secondary school", note: "Help them feel more at ease" },
    { id: "stress", emoji: "🌙", title: "A classmate under a lot of pressure lately", note: "Help them feel understood" },
    { id: "new", emoji: "🎈", title: "A new student who just joined the school", note: "Help them feel less nervous" },
    { id: "elder", emoji: "☀️", title: "An older person in the community", note: "Help them feel cared for" },
  ] : locale === "zh-Hant" ? [
    { id: "junior", emoji: "🌱", title: "剛升上中學的學弟妹", note: "想讓他安心一點" },
    { id: "stress", emoji: "🌙", title: "最近壓力很大的同學", note: "想讓他感到被理解" },
    { id: "new", emoji: "🎈", title: "新加入學校的同學", note: "想讓他沒有那麼緊張" },
    { id: "elder", emoji: "☀️", title: "社區長者", note: "想讓他感到被關心" },
  ] : recipients), [locale]);

  const draftSamplesData = useMemo<Record<W3Recipient, string>>(() => (locale === "en" ? {
    junior: "When I first started secondary school, I was worried that I would not fit in. Even lunchtime felt awkward because I did not know who to sit with. Later I realised that finding one or two people to talk to and study with made things feel much easier. You do not need to do everything perfectly straight away.",
    stress: "If you have been feeling really tired lately, you do not have to pretend that everything is fine. Sometimes stopping to rest is more important than forcing yourself to keep going. You are not failing. You have just been carrying a lot.",
    new: "Starting somewhere new can feel unsettling. I used to worry about saying the wrong thing or not knowing who to walk with. Later I realised that meeting one or two people first made many things feel easier.",
    elder: "Thank you for always greeting us so kindly when we see you. Sometimes, just hearing you ask how our day has been already makes people feel warm and cared for. I hope you can also feel that same kindness from others every day.",
  } : locale === "zh-Hant" ? {
    junior: "我剛升上中學的時候，也很怕自己跟不上，連午飯時間都不知道該跟誰坐。後來我發現，只要先找到一兩個願意一起聊天、一起做功課的人，心裡就會安穩很多。你不用一下子把所有事情都做好，慢慢來就可以。",
    stress: "如果你最近真的很累，也不用一直假裝自己沒事。很多時候，先讓自己休息一下，比逼自己繼續撐下去更重要。你不是不夠好，只是已經很辛苦了。",
    new: "剛來到一個新地方的時候，真的會有點不安。我以前也會擔心自己說錯話、找不到人一起走。後來我發現，只要先認識一兩個願意打招呼的人，很多事情都會慢慢變得容易。",
    elder: "謝謝您每次見到我們都會笑著打招呼。有時候，光是聽到您溫柔地問一句「今天過得怎麼樣」，就會讓人心裡暖暖的。也希望您每天都能感受到別人對您的關心。",
  } : {
    junior: "我刚上中学的时候，也很怕自己跟不上，连午饭时间都不知道该跟谁坐。后来我发现，只要先找到一两个愿意一起聊天、一起做功课的人，心里就会安稳很多。你不用一下子把所有事情都做得很好，慢慢来就可以。",
    stress: "如果你最近真的很累，也不用一直假装自己没事。很多时候，先让自己休息一下，比逼自己继续撑着更重要。你不是不够好，你只是已经很辛苦了。",
    new: "刚来到一个新地方的时候，真的会有点不安。我以前也会担心自己说错话、找不到人一起走。后来我发现，只要先认识一两个愿意打招呼的人，很多事情都会慢慢变容易。",
    elder: "谢谢您每次见到我们都会笑着打招呼。有时候，光是听到您温柔地问一句“今天过得怎么样”，就会让人心里暖暖的。也希望您每天都能感受到别人对您的关心。",
  }), [locale]);

  const promptTagsList = useMemo(() => locale === "en" ? [
    "Keep my tone",
    "Do not remove my example",
    "Make it warmer",
    "Write more for this person",
    "Do not make it too formal",
  ] : locale === "zh-Hant" ? [
    "保留我的語氣",
    "不要刪掉我的例子",
    "寫得更溫暖一點",
    "更像寫給這個人",
    "不要太正式",
  ] : [
    "保留我的语气",
    "不要删掉我的例子",
    "写得更温暖一点",
    "更像写给这个人",
    "不要太正式",
  ], [locale]);


  const w3HelpfulReviewTags = useMemo(
  () =>
    locale === "en"
      ? [
          "Made my message clearer",
          "Made the tone warmer",
          "Helped me write more for the recipient",
          "Helped me notice what could be improved",
          "Did not help much",
        ]
      : locale === "zh-Hant"
      ? [
          "讓表達更清楚",
          "讓語氣更溫暖",
          "幫我想到更適合對象的說法",
          "幫我發現原稿可以改進的地方",
          "沒有太大幫助",
        ]
      : [
          "让表达更清楚",
          "让语气更温暖",
          "帮我想到更适合对象的说法",
          "帮我发现原稿可以改进的地方",
          "没有太大帮助",
        ],
  [locale]
);

const w3LimitationReviewTags = useMemo(
  () =>
    locale === "en"
      ? [
          "A bit too generic",
          "A bit too formal",
          "Did not sound like my voice",
          "Did not fit my chosen recipient enough",
          "Did not keep my example or feeling well",
          "No obvious problem",
        ]
      : locale === "zh-Hant"
      ? [
          "有點太普通",
          "有點太正式",
          "不太像我的語氣",
          "不夠適合我選擇的對象",
          "沒有保留好我的例子或感受",
          "沒有明顯問題",
        ]
      : [
          "有点太普通",
          "有点太正式",
          "不太像我的语气",
          "不够适合我选择的对象",
          "没有保留好我的例子或感受",
          "没有明显问题",
        ],
  [locale]
);

  const commuteSurveyData = useMemo(() => locale === "en" ? [
    { type: "Walk", count: 18, note: "Many students live near the school" },
    { type: "Car ride from family", count: 12, note: "Mostly concentrated during morning rush hour" },
    { type: "School bus / public transport", count: 9, note: "Mainly students from farther communities" },
    { type: "Bike", count: 6, note: "Safe routes need to be considered" },
  ] : locale === "zh-Hant" ? [
    { type: "步行", count: 18, note: "住得較近的同學較多" },
    { type: "家長接送", count: 12, note: "主要集中在早上繁忙時段" },
    { type: "校車／公共交通", count: 9, note: "主要來自較遠的社區" },
    { type: "騎單車", count: 6, note: "需要考慮安全路線" },
  ] : [
    { type: "步行", count: 18, note: "离学校近的同学较多" },
    { type: "家长接送", count: 12, note: "早高峰比较集中" },
    { type: "校车/公交", count: 9, note: "主要来自较远社区" },
    { type: "骑车", count: 6, note: "需要考虑安全路线" },
  ], [locale]);

  const roleOutputsData = useMemo(() => locale === "en" ? {
    data: { title: "Data organiser", body: ["Walk 40.0%", "Family car ride 26.7%", "School bus / public transport 20.0%", "Bike 13.3%"] },
    summary: { title: "Summary helper", body: ["Walking is the most common way to get to school.", "Family drop-offs cluster during rush hour and may cause traffic.", "Students from farther communities rely more on buses or public transport."] },
    draft: { title: "Drafting helper", body: ["Suggest smoother traffic arrangements at the school gate during peak periods.", "Suggest safer route guidance for students who walk or cycle.", "Suggest that the report notes different travel needs for different groups of students."] },
  } : locale === "zh-Hant" ? {
    data: { title: "數據整理助手", body: ["步行 40.0%", "家長接送 26.7%", "校車／公共交通 20.0%", "騎單車 13.3%"] },
    summary: { title: "摘要助手", body: ["步行是最常見的上學方式。", "家長接送集中在早上繁忙時段，容易造成擠塞。", "較遠社區的同學更依賴校車或公共交通。"] },
    draft: { title: "建議草稿助手", body: ["建議學校優化校門口繁忙時段的通行安排。", "建議為步行和騎單車的同學設計更安全的路線提示。", "建議在簡報中提醒大家，不同上學方式有不同需要。"] },
  } : {
    data: { title: "数据整理助手", body: ["步行 40.0%", "家长接送 26.7%", "校车/公交 20.0%", "骑车 13.3%"] },
    summary: { title: "摘要助手", body: ["步行是最常见的上学方式。", "家长接送集中在早高峰，容易堵车。", "较远社区的同学更依赖校车或公交。"] },
    draft: { title: "建议草稿助手", body: ["建议学校优化校门口高峰时段通行安排。", "建议为步行和骑车同学设计更安全的路线提示。", "建议在简报里提醒大家不同上学方式的需要不一样。"] },
  }, [locale]);

  const recycleCasesData = useMemo(() => locale === "en" ? {
    lighting: { title: "A plastic bottle in dim lighting", emoji: "🌃", system: "The system classified it as general waste.", actual: "A better answer would be recyclable." },
    crushed: { title: "A crushed paper box", emoji: "📦", system: "The system classified it as general waste.", actual: "A better answer would be recyclable." },
    similar: { title: "A plastic cup and a paper cup that look similar", emoji: "🥤", system: "The system put them in the same category.", actual: "They should not be treated exactly the same way." },
  } : locale === "zh-Hant" ? {
    lighting: { title: "昏暗光線下的塑膠瓶", emoji: "🌃", system: "系統把它判成了「其他垃圾」。", actual: "更合理的判斷應是「可回收物」。" },
    crushed: { title: "被壓扁後的紙盒", emoji: "📦", system: "系統把它判成了「其他垃圾」。", actual: "更合理的判斷應是「可回收物」。" },
    similar: { title: "外形很像的塑膠杯和紙杯", emoji: "🥤", system: "系統把它們判成同一類。", actual: "它們其實不應該被完全一樣地處理。" },
  } : {
    lighting: { title: "昏暗光线下的塑料瓶", emoji: "🌃", system: "系统把它判成了‘其他垃圾’。", actual: "更合理的判断是‘可回收物’。" },
    crushed: { title: "被压扁后的纸盒", emoji: "📦", system: "系统把它判成了‘其他垃圾’。", actual: "更合理的判断是‘可回收物’。" },
    similar: { title: "外形很像的塑料杯和纸杯", emoji: "🥤", system: "系统把它们判成了同一类。", actual: "它们其实不应该被完全一样地处理。" },
  }, [locale]);

  const trainingImagesByCaseData = useMemo(() => locale === "en" ? {
    lighting: [
      { id: "l1", title: "Plastic bottles in different lighting", note: "Closer to real conditions", good: true },
      { id: "l2", title: "Only bright, white-background bottle photos", note: "The scene is too narrow", good: false },
      { id: "l3", title: "Classroom, hallway, and outdoor backgrounds", note: "More representative", good: true },
      { id: "l4", title: "Cat photos unrelated to sorting", note: "Not relevant", good: false },
    ],
    crushed: [
      { id: "c1", title: "Flattened and folded paper boxes", note: "Lets the system see real-world changes", good: true },
      { id: "c2", title: "Only neat, uncrushed paper boxes", note: "The shapes are too limited", good: false },
      { id: "c3", title: "Boxes with different levels of damage", note: "Closer to how items look before being thrown away", good: true },
      { id: "c4", title: "Photos of classroom desks", note: "Not related to the task", good: false },
    ],
    similar: [
      { id: "s1", title: "Similar-looking cups with different materials", note: "Helps the system learn to tell them apart", good: true },
      { id: "s2", title: "Only one kind of plastic cup", note: "No comparison is available", good: false },
      { id: "s3", title: "Cups with lids, straws, and labels", note: "Closer to real use", good: true },
      { id: "s4", title: "Landscape photos", note: "Unrelated to the sorting task", good: false },
    ],
  } : locale === "zh-Hant" ? {
    lighting: [
      { id: "l1", title: "不同光線下的塑膠瓶", note: "更貼近真實環境", good: true },
      { id: "l2", title: "只在明亮白底下拍的塑膠瓶", note: "場景太單一", good: false },
      { id: "l3", title: "教室、走廊、戶外等不同背景", note: "更有代表性", good: true },
      { id: "l4", title: "和垃圾分類無關的貓咪照片", note: "不相關", good: false },
    ],
    crushed: [
      { id: "c1", title: "壓扁、摺疊後的紙盒", note: "讓系統看見真實變化", good: true },
      { id: "c2", title: "只有完整平整的紙盒", note: "形態太單一", good: false },
      { id: "c3", title: "不同破損程度的紙盒", note: "更貼近投放前狀態", good: true },
      { id: "c4", title: "教室桌面照片", note: "和任務無關", good: false },
    ],
    similar: [
      { id: "s1", title: "外形相近但材質不同的杯子", note: "幫助系統學會區分", good: true },
      { id: "s2", title: "只有一種塑膠杯", note: "沒有比較關係", good: false },
      { id: "s3", title: "帶蓋、吸管、標籤的杯子", note: "更貼近真實情況", good: true },
      { id: "s4", title: "風景照片", note: "和分類任務無關", good: false },
    ],
  } : {
    lighting: [
      { id: "l1", title: "不同光线下的塑料瓶", note: "更贴近真实环境", good: true },
      { id: "l2", title: "只在明亮白底下拍的塑料瓶", note: "场景太单一", good: false },
      { id: "l3", title: "教室、走廊、户外不同背景", note: "更有代表性", good: true },
      { id: "l4", title: "和垃圾分类无关的猫咪照片", note: "不相关", good: false },
    ],
    crushed: [
      { id: "c1", title: "压扁、折叠后的纸盒", note: "能让系统看见真实变化", good: true },
      { id: "c2", title: "只有完整平整的纸盒", note: "形态太单一", good: false },
      { id: "c3", title: "不同破损程度的纸盒", note: "更贴近真实投放前状态", good: true },
      { id: "c4", title: "教室桌面照片", note: "和任务没关系", good: false },
    ],
    similar: [
      { id: "s1", title: "外形相近但材质不同的杯子", note: "帮助系统学会区分", good: true },
      { id: "s2", title: "只有一种塑料杯", note: "没有比较关系", good: false },
      { id: "s3", title: "带盖、带吸管、带标签的杯子", note: "更贴近真实情况", good: true },
      { id: "s4", title: "风景照片", note: "和分类任务无关", good: false },
    ],
  }, [locale]);

  function changeLocale(next: Locale) {
  if (next === locale) return;

  setLocale(next);

  if (typeof window !== "undefined") {
    window.localStorage.setItem("site_lang", next);
  }

  void trackEvent({
    worldId: screen === "home" ? "home" : screen,
    stepId:
      screen === "home"
        ? "home"
        : screen === "w1"
        ? `w1_step${w1Step + 1}`
        : screen === "w2"
        ? `w2_step${w2Step + 1}`
        : screen === "w3"
        ? `w3_step${w3Step + 1}`
        : screen === "w4"
        ? `w4_step${w4Step + 1}`
        : `w5_step${w5Step + 1}`,
    eventType: "interaction",
    eventName: "switch_language",
    eventValueJson: {
      from: locale,
      to: next,
      screen,
    },
  });
}

  async function postJson(path: string, payload: Record<string, any>) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || (json && json.ok === false)) {
      throw new Error(json?.error || `Request failed: ${path}`);
    }
    return json;
  }

  async function startStudentSession() {
    if (!identity.studentName.trim() || !identity.studentCode.trim() || !identity.className.trim()) {
      setIdentityError(locale === "en" ? "Please fill in name, student code, and class." : locale === "zh-Hant" ? "請先填寫姓名、學號和班級。" : "请先填写姓名、学号和班级。");
      return;
    }
    try {
      setStartingSession(true);
      setIdentityError("");
      const json = await postJson("/api/session/start", {
        language: locale,
        deviceType: "web",
        regionNote: "prototype",
        studentName: identity.studentName,
        studentCode: identity.studentCode,
        className: identity.className,
        schoolName: identity.schoolName,
        gradeLevel: identity.gradeLevel,
      });
      setSessionId(json.session.id);
      setSessionCode(json.session.sessionCode);
    } catch (error) {
      setIdentityError(error instanceof Error ? error.message : "Failed to start session");
    } finally {
      setStartingSession(false);
    }
  }

  async function trackEvent(payload: Record<string, any>) {
    if (!sessionId) return;
    try {
      await postJson("/api/event", {
        sessionId,
        ...payload,
      });
    } catch (error) {
      console.warn("trackEvent failed", error);
    }
  }

  function toggleW3HelpfulReviewTag(tag: string) {
  const next = w3HelpfulTags.includes(tag)
    ? w3HelpfulTags.filter((item) => item !== tag)
    : w3HelpfulTags.length >= 2
    ? w3HelpfulTags
    : [...w3HelpfulTags, tag];

  if (next === w3HelpfulTags) return;

  setW3HelpfulTags(next);

  void trackEvent({
    worldId: "w3",
    stepId: "w3_step5",
    eventType: "selection",
    eventName: "w3_select_ai_helpful_tags",
    eventValueJson: { selectedValues: next },
  });
}

function toggleW3LimitationReviewTag(tag: string) {
  const next = w3LimitationTags.includes(tag)
    ? w3LimitationTags.filter((item) => item !== tag)
    : w3LimitationTags.length >= 2
    ? w3LimitationTags
    : [...w3LimitationTags, tag];

  if (next === w3LimitationTags) return;

  setW3LimitationTags(next);

  void trackEvent({
    worldId: "w3",
    stepId: "w3_step5",
    eventType: "selection",
    eventName: "w3_select_ai_limitation_tags",
    eventValueJson: { selectedValues: next },
  });
}

  async function saveStep(worldId: WorldId, stepId: string, responseJson: Record<string, any>) {
    if (!sessionId) return;
    try {
      await postJson("/api/response/save", {
        sessionId,
        worldId,
        stepId,
        responseJson,
      });
    } catch (error) {
      console.error("saveStep failed", error);
    }
  }

  async function saveSubmission(worldId: WorldId, submissionType: "info_card" | "warm_card" | "workflow_card" | "model_card_lite", content: string, selfCheckJson?: Record<string, any>) {
    if (!sessionId) return;
    try {
      await postJson("/api/submission", {
        sessionId,
        worldId,
        submissionType,
        content,
        selfCheckJson,
      });
    } catch (error) {
      console.error("saveSubmission failed", error);
    }
  }

  async function runScore() {
    if (!sessionId) return;
    try {
      await postJson("/api/score/run", { sessionId });
    } catch (error) {
      console.error("runScore failed", error);
    }
  }

  useEffect(() => {
    if (!sessionId) return;
    const worldId = screen === "home" ? "home" : screen;
    const stepId =
      screen === "home"
        ? "home"
        : screen === "w1"
        ? `w1_step_${w1Step + 1}`
        : screen === "w2"
        ? `w2_step_${w2Step + 1}`
        : screen === "w3"
        ? `w3_step_${w3Step + 1}`
        : screen === "w4"
        ? `w4_step_${w4Step + 1}`
        : `w5_step_${w5Step + 1}`;

    void trackEvent({
      worldId,
      stepId,
      eventType: "navigation",
      eventName: screen === "home" ? "home_view" : `${screen}_view`,
      eventValueJson: { locale },
    });
  }, [sessionId, screen, w1Step, w2Step, w3Step, w4Step, w5Step, locale]);

const currentAvailableWorld = useMemo(() => {
    for (const id of WORLD_ORDER) {
      const idx = WORLD_ORDER.indexOf(id);
      const unlocked = idx === 0 || completed[WORLD_ORDER[idx - 1]];
      if (unlocked && !completed[id]) return id;
    }
    return null;
  }, [completed]);

  const doneCount = useMemo(() => WORLD_ORDER.filter((id) => completed[id]).length, [completed]);

  function openWorld(id: WorldId) {
    if (!sessionId) return;
    const idx = WORLD_ORDER.indexOf(id);
    const unlocked = idx === 0 || completed[WORLD_ORDER[idx - 1]];
    if (!unlocked) return;
    setScreen(id);
  }

  async function finishWorld(id: WorldId) {
    if (id === "w1") {
      await saveStep("w1", "w1_step2", {
        mode: w1Mode,
        logic: "learning",
        visitedModes: w1VisitedModes,
        bestMode: w1BestMode,
        narrowMode: w1NarrowMode,
      });
      await saveStep("w1", "w1_step3", { rules: w1Rules });
      await saveSubmission("w1", "workflow_card", `${w1Good}\n\n${w1Warn}`);
    } else if (id === "w2") {
      await saveStep("w2", "w2_step1", { choice: w2RoleChoice });
      await saveStep("w2", "w2_step2", { choice: w2DraftChoice });
      await saveStep("w2", "w2_step3", { flaggedClaims: w2ClaimStatus });
      await saveSubmission("w2", "info_card", w2FinalReason);
    } else if (id === "w3") {
  await saveStep("w3", "w3_step1", { recipient: w3Recipient });
  await saveStep("w3", "w3_step2", { draft: w3Draft });
  await saveStep("w3", "w3_step3", { promptTags: w3PromptTags });

  await saveStep("w3", "w3_step5", {
    aiHelpfulTags: w3HelpfulTags,
    aiLimitationTags: w3LimitationTags,
    aiUsabilityFeedback: w3UsabilityFeedback,
    usabilityFeedbackScored: false,
  });

  await saveSubmission("w3", "warm_card", w3FinalText, {
    kept_own_ideas: w3Checklist.some(
      (item) =>
        item.includes("自己的例子") ||
      item.includes("自己的例子或想法") ||
            item.includes("自己的例子或想法")
  ),
  revised_ai_sentence: w3Checklist.some(
    (item) => item.includes("改过 AI") || item.includes("改過 AI")
  ),
  did_not_copy: w3Checklist.some(
    (item) =>
      item.includes("没有直接整段照搬") ||
      item.includes("沒有直接整段照搬") ||
      item.includes("没有直接照搬")
  ),
  understands_ai_generates_from_prompts: w3Checklist.some(
    (item) =>
      item.includes("根据提示生成内容") ||
      item.includes("根據提示生成內容")
  ),
  checklist: w3Checklist,

  ai_collaboration_review: {
    helpful_tags: w3HelpfulTags,
    limitation_tags: w3LimitationTags,
    usability_feedback: w3UsabilityFeedback,
    usability_feedback_scored: false,
  },
});

  await trackEvent({
    worldId: "w3",
    stepId: "w3_step5",
    eventType: "submit",
    eventName: "w3_submit_ai_collaboration_review",
    eventValueJson: {
      helpfulTags: w3HelpfulTags,
      limitationTags: w3LimitationTags,
      hasUsabilityFeedback: w3UsabilityFeedback.trim().length > 0,
      usabilityFeedbackScored: false,
    },
  });
} else if (id === "w4") {
      await saveStep("w4", "w4_step1", { useAiChoice: w4UseChoice });
      await saveStep("w4", "w4_step2", { aiTasks: w4AiTasks, humanTasks: w4HumanStillDo });
      await saveStep("w4", "w4_step3", { aiRole: w4Role });
      await saveStep("w4", "w4_step4", { adjustedWorkflow: true, rules: w4Rules, reminder: w4Reminder });
      await saveSubmission("w4", "workflow_card", `${w4Rules.join("；")}\n\n${w4Reminder}`);
    } else if (id === "w5") {
      await saveStep("w5", "w5_step1", { choice: w5Problem });
      await saveStep("w5", "w5_step2", { choice: w5Cause });
      await saveStep("w5", "w5_step3", { selectedTrainingImages: w5Training });
      await saveStep("w5", "w5_step4", { selectedReminders: w5Reminders });
      await saveSubmission(
        "w5",
        "model_card_lite",
        `用途：${w5Card.purpose}\n限制：${w5Card.limits}\n提醒：${w5Card.reminder}\n改进：${w5Card.improve}`
      );
      if (sessionId) {
        try {
          await postJson("/api/session/end", {
            sessionId,
            currentWorld: "w5",
            currentStep: "w5_done",
            status: "completed",
          });
        } catch (error) {
          console.error("session end failed", error);
        }
      }
    }
    await runScore();
    setCompleted((prev) => ({ ...prev, [id]: true }));
    setScreen("home");
  }

  // Progress
  const p1 = useMemo(() => {
    let s = 0;
    if (w1OpenedCards.length >= 2) s += 25;
    if (w1VisitedModes.length >= 2 && w1BestMode && w1NarrowMode) s += 25;
    if (
      w1Rules.explainReason ||
      w1Rules.teacherReview ||
      w1Rules.tryNewThings ||
      w1Rules.sayWhatDataUsed ||
      w1Rules.onlyPopular
    )
      s += 25;
    if (w1Good.trim().length > 8 && w1Warn.trim().length > 8) s += 25;
    return s;
  }, [w1OpenedCards.length, w1VisitedModes.length, w1BestMode, w1NarrowMode, w1Rules, w1Good, w1Warn]);

  const selectedDraft = w2DraftChoice ? infoTaskDraftsData[w2DraftChoice] : null;
  const selectedClaims = selectedDraft?.claims || [];
  const w2ClaimsDone =
    selectedClaims.length > 0 &&
    selectedClaims.every((claim) => !!w2ClaimStatus[claim]);

  const p2 = useMemo(() => {
    let s = 0;
    if (w2RoleChoice) s += 25;
    if (w2DraftChoice) s += 25;
    if (w2ClaimsDone) s += 25;
    if (w2FinalReason.trim().length > 10) s += 25;
    return s;
  }, [w2RoleChoice, w2DraftChoice, w2ClaimsDone, w2FinalReason]);

  const p3 = useMemo(() => {
  let s = 0;
  if (w3Recipient) s += 20;
  if (w3Draft.trim().length > 20) s += 20;
  if (w3Chat.length > 0) s += 20;
  if (w3FinalText.trim().length > 20 && w3Checklist.length >= 3) s += 20;
  if (w3HelpfulTags.length > 0 && w3LimitationTags.length > 0) s += 20;
  return s;
}, [
  w3Recipient,
  w3Draft,
  w3Chat.length,
  w3FinalText,
  w3Checklist.length,
  w3HelpfulTags.length,
  w3LimitationTags.length,
]);

  const p4 = useMemo(() => {
    let s = 0;
    if (w4AiTasks.length > 0) s += 20;
    if (w4Role) s += 20;
    if (w4UseChoice && w4HumanStillDo.length > 0) s += 20;
    if (w4Rules.length > 0) s += 20;
    if (w4Reminder.trim().length > 8) s += 20;
    return s;
  }, [w4AiTasks.length, w4Role, w4UseChoice, w4HumanStillDo.length, w4Rules.length, w4Reminder]);

  const p5 = useMemo(() => {
    let s = 0;
    if (w5Problem) s += 20;
    if (w5Cause) s += 20;
    if (w5Training.length > 0) s += 20;
    if (w5Reminders.length > 0) s += 20;
    if (
      w5Card.purpose.trim().length > 5 &&
      w5Card.limits.trim().length > 5 &&
      w5Card.reminder.trim().length > 5 &&
      w5Card.improve.trim().length > 5
    )
      s += 20;
    return s;
  }, [w5Problem, w5Cause, w5Training.length, w5Reminders.length, w5Card]);

  function toggleListValue(
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function onChangeWorld1Mode(mode: "personal" | "popular" | "explore") {
    setW1Mode(mode);
    setW1VisitedModes((prev) => (prev.includes(mode) ? prev : [...prev, mode]));
  }

  async function submitCreativePrompt() {
  if (!w3Recipient) return;

  const finalPrompt =
    w3Prompt.trim() ||
    (locale === "en"
      ? "Please help me make this card clearer."
      : locale === "zh-Hant"
      ? "請幫我把這張卡片改得更清楚一點。"
      : "请帮我把这张卡片改得更清楚一点。");

  const turn = w3Chat.filter((m) => m.role === "ai").length + 1;

  const userText = buildW3VisibleUserMessage(locale, finalPrompt, w3PromptTags);
  const result = buildW3AiRewriteLocalized(locale, w3Recipient, w3Draft, w3PromptTags);

  const aiText =
    result.mode === "scaffold"
      ? result.note
      : locale === "en"
      ? `Revised version:\n${result.rewritten}\n\nWhat I changed:\n${result.note}`
      : `改写后的版本：\n${result.rewritten}\n\n我做了什么调整：\n${result.note}`;

  setW3Chat((prev) => [...prev, { role: "user", text: userText }, { role: "ai", text: aiText }]);

  if (result.mode === "rewrite") {
    setW3FinalText(result.rewritten);
  }

  setW3Prompt("");

  if (sessionId) {
    try {
      await postJson("/api/chat/log", {
        sessionId,
        worldId: "w3",
        turnNo: turn,
        role: "user",
        content: userText,
      });
      await postJson("/api/chat/log", {
        sessionId,
        worldId: "w3",
        turnNo: turn,
        role: "ai",
        content: aiText,
      });
    } catch (error) {
      console.error("chat log failed", error);
    }
  }
}

  const world1Cards = learningCardsByModeData[w1Mode];
  const world5Images = w5Problem ? trainingImagesByCaseData[w5Problem] : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_24%),linear-gradient(to_bottom_right,_#f8fafc,_#ffffff,_#eef2ff)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/teacher" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              教师端
            </Link>
            {sessionId ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <span className="font-medium">{identity.studentName || "学生"}</span>
                <span>{identity.studentCode}</span>
                <span>{sessionCode}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                先填写身份信息再开始任务
              </div>
            )}
          </div>
          <LanguageSwitcher locale={locale} onChange={changeLocale} />
        </div>
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-7 text-white md:p-9">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-3xl bg-white/15 p-3 backdrop-blur">
                      <Map className="h-7 w-7" />
                    </div>
                    <Pill tone="light">{tr(locale, "AI任务地图")}</Pill>
                  </div>
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{tr(locale, "AI任务地图")}</h1>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-white/90 md:text-lg">
                    {tr(locale, "从第一个任务开始，完成后就能解锁下一个世界。")}
                  </p>
                </div>
                <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="mb-2 text-sm font-medium text-slate-700">{tr(locale, "怎么玩")}</div>
                    <p className="text-sm leading-7 text-slate-500">
                      {tr(locale, "先完成前面的任务，再解锁后面的世界。")}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="mb-2 text-sm font-medium text-slate-700">{tr(locale, "规则")}</div>
                    <p className="text-sm leading-7 text-slate-500">
                      {tr(locale, "每个世界都会让你和 AI 一起做不同的事。")}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <div className="mb-2 text-sm font-medium text-slate-700">{tr(locale, "进度")}</div>
                    <p className="text-sm leading-7 text-slate-500">
                      {locale === "en" ? `${doneCount} / 5 worlds cleared.` : locale === "zh-Hant" ? `已點亮 ${doneCount} / 5 個世界。` : `已点亮 ${doneCount} / 5 个世界。`}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <div className="border-b border-slate-100 px-5 pb-4 pt-5">
                  <h2 className="text-2xl font-semibold">{tr(locale, "任务地图")}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {tr(locale, "沿着路线完成任务。已完成的世界会被点亮，没解锁的世界会暂时灰暗。")}
                  </p>
                </div>
                <div className="relative p-5 md:p-6">
                  <div className="absolute left-9 top-8 hidden h-[calc(100%-4rem)] w-1 rounded-full bg-slate-200 md:block" />
                  <div className="space-y-5">
                    {WORLD_ORDER.map((id, index) => {
                      const meta = worldMeta[id];
                      const unlocked = index === 0 || completed[WORLD_ORDER[index - 1]];
                      const status: "done" | "current" | "locked" = completed[id]
                        ? "done"
                        : unlocked && currentAvailableWorld === id
                        ? "current"
                        : unlocked
                        ? "current"
                        : "locked";
                      return (
                        <div
                          key={id}
                          className="grid gap-4 md:grid-cols-[64px_1fr]"
                        >
                          <div className="hidden md:flex justify-center">
                            <div
                              className={cn(
                                "flex h-16 w-16 items-center justify-center rounded-full border-4 text-lg font-semibold",
                                status === "done" && "border-emerald-500 bg-emerald-100 text-emerald-700",
                                status === "current" && "border-slate-900 bg-slate-900 text-white",
                                status === "locked" && "border-slate-300 bg-slate-200 text-slate-500"
                              )}
                            >
                              {status === "done" ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : status === "locked" ? (
                                <Lock className="h-5 w-5" />
                              ) : (
                                index + 1
                              )}
                            </div>
                          </div>
                          <WorldMapNode
                            title={meta.title}
                            subtitle={meta.subtitle}
                            domains={meta.domains}
                            status={status}
                            icon={meta.icon}
                            illustration={meta.illustration}
                            onClick={unlocked ? () => openWorld(id) : undefined}
                            locale={locale}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {screen === "w1" && (
            <motion.div
              key="w1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <Header
                title={worldMeta.w1.title}
                subtitle={locale === "en" ? "You are a student tester on the school learning platform. Your job is to try an AI recommender and decide whether it is helpful and sensible. At the end, you will submit a short feedback card to your teacher." : locale === "zh-Hant" ? "你是學校學習平台的學生測試員。你的任務是試用一個 AI 推薦系統，看看它是否既有幫助，也夠合理。最後你要向老師提交一張測試回饋卡。" : "你是学校学习平台的学生测试员。你的任务是试用一个 AI 推荐系统，看看它是不是既有帮助，又够合理。最后你要给老师提交一张测试反馈卡。"}
                badge={tr(locale, "世界1")}
                color={worldMeta.w1.color}
                icon={worldMeta.w1.icon}
                progress={p1}
                steps={locale === "en" ? ["1. Enter the system", "2. Compare recommendation modes", "3. Set system rules", "4. Submit feedback"] : locale === "zh-Hant" ? ["1. 進入系統", "2. 看推薦變化", "3. 定系統守則", "4. 提交回饋"] : ["1. 进入系统", "2. 看推荐变化", "3. 定系统守则", "4. 提交反馈"]}
                activeStep={w1Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w1Step === 0 && (
                <Section
                  title={locale === "en" ? "First, see what the system is recommending to you" : locale === "zh-Hant" ? "先看看這個系統正在向你推薦什麼" : "先试试看，这个系统正在给你推荐什么"}
                  description={locale === "en" ? "This is the home page of the school learning platform. Open two recommendation cards first and see why the system suggested them to you." : locale === "zh-Hant" ? "這是學校學習平台首頁。先打開兩張推薦卡，看看系統為甚麼會把它們推薦給你。" : "这是学校学习平台首页。先点开两张推荐卡，看看系统为什么会把它们推荐给你。"}
                >
                  <div className="mb-4 rounded-3xl bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-700">{locale === "en" ? "School Learning Platform" : locale === "zh-Hant" ? "學校學習平台" : "学校学习平台"}</div>
                        <div className="text-xs text-slate-500">{locale === "en" ? "Today's recommendations · arranged by AI from your learning profile" : locale === "zh-Hant" ? "今日推薦 · AI 根據你的學習情況整理" : "今日推荐 · AI 根据你的学习情况整理"}</div>
                      </div>
                      <Pill tone="outline">{locale === "en" ? "Open two cards to continue" : locale === "zh-Hant" ? "先打開兩張推薦卡，再繼續" : "点开两张推荐卡再继续"}</Pill>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {learningCardsByMode.personal.map((card) => {
                        const opened = w1OpenedCards.includes(card.id);
                        return (
                          <button
                            key={card.id}
                            onClick={() => toggleListValue(card.id, w1OpenedCards, setW1OpenedCards)}
                            className={cn(
                              "rounded-3xl border p-4 text-left transition",
                              opened
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            )}
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <Pill tone={opened ? "light" : "outline"}>{card.label}</Pill>
                              {opened && <Pill tone="light">已查看</Pill>}
                            </div>
                            <div className="text-base font-semibold">{card.title}</div>
                            <div className={cn("mt-1 text-sm leading-6", opened ? "text-white/80" : "text-slate-500")}>
                              {card.reason}
                            </div>
                            {opened && (
                              <div className="mt-3 rounded-2xl bg-white/10 p-3 text-sm leading-7 text-white">
                                {card.detail}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Section>
              )}

              {w1Step === 1 && (
                <Section
                  title="换一种推荐方式，看看结果会不会变"
                  description="点上面的标签切换模式。先至少看过两种模式，再回答下面两个问题。"
                >
                  <div className="mb-4 flex flex-wrap gap-2">
                    {[
                      ["personal", "最适合我"],
                      ["popular", "大家都在学"],
                      ["explore", "试试新方向"],
                    ].map(([id, label]) => (
                      <TagButton
                        key={id}
                        active={w1Mode === id}
                        onClick={() => onChangeWorld1Mode(id as "personal" | "popular" | "explore")}
                      >
                        {label}
                      </TagButton>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {world1Cards.map((card) => (
                      <div key={card.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Pill tone="outline">{card.label}</Pill>
                          <span className="text-xs text-slate-500">{card.reason}</span>
                        </div>
                        <div className="font-semibold">{card.title}</div>
                        <div className="mt-2 text-sm leading-7 text-slate-500">{card.detail}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <div className="mb-3 text-sm font-medium text-slate-700">你觉得哪一种最能帮你学习？</div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          ["personal", "最适合我"],
                          ["popular", "大家都在学"],
                          ["explore", "试试新方向"],
                        ].map(([id, label]) => (
                          <TagButton key={id} active={w1BestMode === id} onClick={() => setW1BestMode(id)}>
                            {label}
                          </TagButton>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <div className="mb-3 text-sm font-medium text-slate-700">你觉得哪一种最可能越推越窄？</div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          ["personal", "最适合我"],
                          ["popular", "大家都在学"],
                          ["explore", "试试新方向"],
                        ].map(([id, label]) => (
                          <TagButton key={id} active={w1NarrowMode === id} onClick={() => setW1NarrowMode(id)}>
                            {label}
                          </TagButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {w1Step === 2 && (
                <Section
                  title="如果这个系统要给全校学生用，你会给它加哪些守则？"
                  description="点一下你觉得应该保留的系统守则。页面右边会实时更新系统状态。"
                >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <div className="space-y-3">
                      {[
                        ["explainReason", "解释推荐原因"],
                        ["teacherReview", "允许老师查看和调整"],
                        ["tryNewThings", "给学生一个“试试新方向”按钮"],
                        ["sayWhatDataUsed", "清楚说明用了哪些学习记录"],
                        ["onlyPopular", "只推热门内容，不管每个人的需要"],
                      ].map(([key, label]) => (
                        <label
                          key={key}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <span className="text-sm leading-7 text-slate-700">{label}</span>
                          <input
                            type="checkbox"
                            checked={w1Rules[key as keyof typeof w1Rules]}
                            onChange={() =>
                              setW1Rules((prev) => ({
                                ...prev,
                                [key]: !prev[key as keyof typeof prev],
                              }))
                            }
                            className="h-5 w-5"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">当前系统状态</div>
                      <div className="space-y-3 text-sm leading-7 text-slate-600">
                        <div>推荐原因：{w1Rules.explainReason ? "会显示" : "不显示"}</div>
                        <div>老师审核：{w1Rules.teacherReview ? "可以查看和调整" : "没有人工审核"}</div>
                        <div>探索内容：{w1Rules.tryNewThings ? "会给“试试新方向”入口" : "没有探索入口"}</div>
                        <div>学习记录说明：{w1Rules.sayWhatDataUsed ? "会说明用了哪些记录" : "不说明"}</div>
                        <div>热门优先：{w1Rules.onlyPopular ? "会偏向热门内容" : "不会只推热门"}</div>
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {w1Step === 3 && (
                <Section
                  title="提交测试反馈卡"
                  description="请写两小段：这个系统最有帮助的地方是什么？你最想提醒老师注意什么？"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <textarea
                      value={w1Good}
                      onChange={(e) => setW1Good(e.target.value)}
                      className="min-h-[220px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                      placeholder="这个系统最有帮助的地方是……"
                    />
                    <textarea
                      value={w1Warn}
                      onChange={(e) => setW1Warn(e.target.value)}
                      className="min-h-[220px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                      placeholder="我最想提醒老师注意……"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      disabled={!(w1Good.trim().length > 8 && w1Warn.trim().length > 8)}
                      onClick={() => finishWorld("w1")}
                    >
                      提交测试反馈
                    </Button>
                  </div>
                </Section>
              )}

              <Nav
                locale={locale}
                step={w1Step}
                setStep={setW1Step}
                maxStep={3}
                canNext={
                  (w1Step === 0 && w1OpenedCards.length >= 2) ||
                  (w1Step === 1 && w1VisitedModes.length >= 2 && !!w1BestMode && !!w1NarrowMode) ||
                  w1Step === 2 ||
                  (w1Step === 3 && w1Good.trim().length > 8 && w1Warn.trim().length > 8)
                }
              />
            </motion.div>
          )}

          {screen === "w2" && (
            <motion.div
              key="w2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <Header
                title={worldMeta.w2.title}
                subtitle={locale === "en" ? "You are part of the school eco action team. This week you need to make a campus information card about reducing plastic pollution. You may use AI to organise information and draft text, but anything you publish must be accurate, clear, and not misleading." : locale === "zh-Hant" ? "你是學校環保行動小組成員。這星期你要製作一張關於減少塑膠污染的校園資訊卡。你可以用 AI 幫你整理資料和生成草稿，但最後發出去的資訊必須準確、清楚，而且不能誤導別人。" : "你是学校环保行动小组成员。这周你要做一张“减少塑料污染”的校园信息卡。你可以用 AI 帮你整理资料和生成草稿，但最后发出去的信息必须准确、清楚，而且不能误导别人。"}
                badge={tr(locale, "世界2")}
                color={worldMeta.w2.color}
                icon={worldMeta.w2.icon}
                progress={p2}
                steps={locale === "en" ? ["1. See what the AI is doing", "2. Choose a draft", "3. Check before publishing", "4. Submit the info card"] : locale === "zh-Hant" ? ["1. 看 AI 在做甚麼", "2. 選草稿", "3. 發布前核查", "4. 交資訊卡"] : ["1. 看AI在做什么", "2. 选草稿", "3. 发布前核查", "4. 交信息卡"]}
                activeStep={w2Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w2Step === 0 && (
                <Section
                  title={locale === "en" ? "First, see what the AI is doing for you now" : locale === "zh-Hant" ? "先看看 AI 現在正在幫你做什麼" : "先看看 AI 现在在帮你做什么"}
                  description={locale === "en" ? "Below is the interface between you and the AI assistant. Look at what it is doing first, then answer the question." : locale === "zh-Hant" ? "下面是你和 AI 助手的介面。先看它現在正在做甚麼，再回答問題。" : "下面是你和 AI 助手的界面。先看它现在在做什么，再回答问题。"}
                >
                  <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <User className="h-4 w-4" /> 我的输入
                      </div>
                      <div className="rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
                        请帮我整理关于塑料污染的重点，写成适合中学生看的短说明。
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Bot className="h-4 w-4" /> AI 输出
                      </div>
                      <div className="space-y-3">
                        {[
                          "塑料污染会影响海洋环境。",
                          "塑料微粒可能影响海洋生物。",
                          "减少一次性塑料很重要。",
                          "学校少用一次性塑料可以帮助改善问题。",
                        ].map((item) => (
                          <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                    <div className="mb-3 text-sm font-medium text-slate-700">
                      这个 AI 现在主要在帮你完成哪一步？
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <OptionCard
                        icon={Feather}
                        title="整理资料并生成说明草稿"
                        note="它正在把资料变成适合继续修改的草稿。"
                        selected={w2RoleChoice === "draft"}
                        onClick={() => setW2RoleChoice("draft")}
                      />
                      <OptionCard
                        icon={Brain}
                        title="直接替老师做最后判断"
                        note="它已经替你决定最后能不能发布。"
                        selected={w2RoleChoice === "final"}
                        onClick={() => setW2RoleChoice("final")}
                      />
                      <OptionCard
                        icon={Sparkles}
                        title="只是把页面变好看"
                        note="它没有真的在处理内容。"
                        selected={w2RoleChoice === "beauty"}
                        onClick={() => setW2RoleChoice("beauty")}
                      />
                      <OptionCard
                        icon={ClipboardList}
                        title="帮你安排活动日期"
                        note="它主要在做行政排程。"
                        selected={w2RoleChoice === "admin"}
                        onClick={() => setW2RoleChoice("admin")}
                      />
                    </div>
                  </div>
                </Section>
              )}

              {w2Step === 1 && (
                <Section
                  title="AI 给了你两版草稿，先选一个更适合继续修改的版本"
                  description="这里不是选‘绝对正确答案’，而是选一个更适合继续加工的信息草稿。"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {(Object.keys(infoTaskDraftsData) as Array<"A" | "B">).map((key) => {
                      const draft = infoTaskDraftsData[key];
                      const selected = w2DraftChoice === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setW2DraftChoice(key)}
                          className={cn(
                            "rounded-3xl border p-5 text-left transition",
                            selected
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <Pill tone={selected ? "light" : "outline"}>{draft.title}</Pill>
                            {selected && <Pill tone="light">继续修改这个</Pill>}
                          </div>
                          <div className="text-base leading-8">{draft.text}</div>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {w2Step === 2 && selectedDraft && (
                <Section
                  title="发布前检查：哪句可以保留，哪句要再查一下？"
                  description="这张信息卡是要发给全校同学看的，所以不能把不确定的话直接发出去。每一句都选一种状态。"
                >
                  <div className="mb-3 text-sm text-slate-500">你刚才选中的草稿：{selectedDraft.title}</div>
                  <div className="space-y-4">
                    {selectedDraft.claims.map((claim) => (
                      <div key={claim} className="rounded-3xl border border-slate-200 p-4">
                        <div className="mb-3 text-sm leading-7 text-slate-700">{claim}</div>
                        <div className="flex flex-wrap gap-2">
                          <TagButton
                            active={w2ClaimStatus[claim] === "keep"}
                            onClick={() => setW2ClaimStatus((prev) => ({ ...prev, [claim]: "keep" }))}
                          >
                            可以保留
                          </TagButton>
                          <TagButton
                            active={w2ClaimStatus[claim] === "check"}
                            onClick={() => setW2ClaimStatus((prev) => ({ ...prev, [claim]: "check" }))}
                          >
                            要再查一下
                          </TagButton>
                          <TagButton
                            active={w2ClaimStatus[claim] === "remove"}
                            onClick={() => setW2ClaimStatus((prev) => ({ ...prev, [claim]: "remove" }))}
                          >
                            不能直接发
                          </TagButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {w2Step === 3 && selectedDraft && (
                <Section
                  title="交出最终可发布的信息卡"
                  description="看看你决定保留什么、要处理什么，再写一句说明。"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-emerald-50 p-5">
                      <div className="mb-3 text-sm font-medium text-emerald-700">我决定先保留的内容</div>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        {selectedDraft.claims
                          .filter((claim) => w2ClaimStatus[claim] === "keep")
                          .map((claim) => (
                            <div key={claim}>• {claim}</div>
                          ))}
                        {selectedDraft.claims.filter((claim) => w2ClaimStatus[claim] === "keep").length === 0 && (
                          <div>暂时还没有。</div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-3xl bg-amber-50 p-5">
                      <div className="mb-3 text-sm font-medium text-amber-700">我决定删掉或再查一下的内容</div>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        {selectedDraft.claims
                          .filter((claim) => w2ClaimStatus[claim] !== "keep")
                          .map((claim) => (
                            <div key={claim}>• {claim}</div>
                          ))}
                        {selectedDraft.claims.filter((claim) => w2ClaimStatus[claim] !== "keep").length === 0 && (
                          <div>暂时还没有。</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <textarea
                    value={w2FinalReason}
                    onChange={(e) => setW2FinalReason(e.target.value)}
                    className="mt-4 min-h-[180px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                    placeholder="请用自己的话写一下：你为什么这样改？"
                  />
                  <div className="mt-4 flex justify-end">
                    <Button
                      disabled={!(w2FinalReason.trim().length > 10)}
                      onClick={() => finishWorld("w2")}
                    >
                      提交这张信息卡
                    </Button>
                  </div>
                </Section>
              )}

              <Nav
                locale={locale}
                step={w2Step}
                setStep={setW2Step}
                maxStep={3}
                canNext={
                  (w2Step === 0 && !!w2RoleChoice) ||
                  (w2Step === 1 && !!w2DraftChoice) ||
                  (w2Step === 2 && w2ClaimsDone) ||
                  (w2Step === 3 && w2FinalReason.trim().length > 10)
                }
              />
            </motion.div>
          )}

          {screen === "w3" && (
            <motion.div
              key="w3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <Header
                title={worldMeta.w3.title}
                subtitle={locale === "en" ? "You are part of the school care team. Your task is to write a warm card for someone. You may ask AI to help make your message clearer, but the final card should still sound like you." : locale === "zh-Hant" ? "你是校園關懷小組的一員，要寫一張溫暖卡片送給某個人。你可以請 AI 幫你把內容寫得更清楚，但最後這張卡片仍然要像你自己寫的。" : "你是校园关怀小组的一员，要写一张温暖卡片送给一个人。你可以请 AI 帮你把话写得更清楚，但最后这张卡片还是要像你自己写的。"}
                badge={tr(locale, "世界3")}
                color={worldMeta.w3.color}
                icon={worldMeta.w3.icon}
                progress={p3}
                steps={
                  locale === "en"
                    ? [
                      "1. Choose a recipient",
                      "2. Write a first draft",
                      "3. Revise with AI",
                      "4. Submit your card",
                      "5. AI collaboration review",
                      ]
                    : locale === "zh-Hant"
                    ? [
                      "1. 選對象",
                      "2. 寫初稿",
                      "3. 和 AI 修改",
                      "4. 提交卡片",
                      "5. AI 合作復盤",
                      ]
                    : [
                      "1. 选对象",
                      "2. 写初稿",
                      "3. 和 AI 修改",
                      "4. 提交卡片",
                      "5. AI 合作复盘",
                      ]
                }
                activeStep={w3Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w3Step === 0 && (
                <Section
                  title={locale === "en" ? "First, choose who you are writing to" : locale === "zh-Hant" ? "先選你想寫給誰" : "先选你想写给谁"}
                  description={locale === "en" ? "This is not just any card. Pick the recipient first so the AI can stay closer to what you really want to say." : locale === "zh-Hant" ? "這張卡片不是隨便寫的。先選對象，後面的 AI 修改才會更貼近你真正想說的話。" : "这张卡片不是随便写的。先选对象，后面 AI 才能更贴近你真正想说的话。"}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {recipientOptions.map((item) => (
                      <OptionCard
                        key={item.id}
                        emoji={item.emoji}
                        title={item.title}
                        note={item.note}
                        selected={w3Recipient === item.id}
                        onClick={() => {
  const existingIsSample =
    w3Draft === draftSamplesData.junior ||
    w3Draft === draftSamplesData.stress ||
    w3Draft === draftSamplesData.new ||
    w3Draft === draftSamplesData.elder;

  setW3Recipient(item.id);

  // 不再自动放入示例初稿。
  // 只有当当前草稿本来就是某个示例时，切换对象后才清空，避免旧对象样例残留。
  if (existingIsSample) {
    setW3Draft("");
  }

  setW3Prompt("");
  setW3PromptTags([]);
  setW3Chat([]);
  setW3FinalText("");
}}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {w3Step === 1 && (
                <Section
                  title="先把你最想说的话写下来"
                  description="不用一开始就写得很完美。先写出你的想法，再请 AI 帮你改。"
                >
                  <div className="mb-4 rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    你可以想一想：<br />
                    ① 你希望对方看完后有什么感觉？<br />
                    ② 有没有一句话是你特别想保留的？
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => w3Recipient && setW3Draft(draftSamplesData[w3Recipient])}
                  >
                    <PencilLine className="mr-2 h-4 w-4" /> 放入示例初稿
                  </Button>
                  <textarea
                    value={w3Draft}
                    onChange={(e) => setW3Draft(e.target.value)}
                    className="mt-4 min-h-[240px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                    placeholder="先把你最想说的话写下来……"
                  />
                </Section>
              )}

              {w3Step === 2 && (
                <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                  <Section
                    title="现在请 AI 帮你改一改"
                    description="你可以告诉它：哪些地方要保留、哪些地方不要改、希望它帮你改成什么感觉。"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {promptTagsList.map((tag) => (
                          <TagButton
                            key={tag}
                            active={w3PromptTags.includes(tag)}
                            onClick={() => toggleValue(tag, w3PromptTags, setW3PromptTags)}
                          >
                            {tag}
                          </TagButton>
                        ))}
                      </div>
                      <textarea
                        value={w3Prompt}
                        onChange={(e) => setW3Prompt(e.target.value)}
                        className="min-h-[140px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                        placeholder="例如：请帮我把句子写得更清楚一点，但保留我的语气，不要删掉我的例子。"
                      />
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={submitCreativePrompt}>
                          <Wand2 className="mr-2 h-4 w-4" /> 让AI回我
                        </Button>
                        {w3Chat.length > 0 && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setW3Prompt("请再帮我改一下，让它更像写给这个人，也不要太正式。")
                            }
                          >
                            <MessageCircleHeart className="mr-2 h-4 w-4" /> 再改一次
                          </Button>
                        )}
                      </div>
                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
  <div className="mb-2 font-medium">
    {locale === "en" ? "This time I want AI to focus on:" : "这次我希望 AI 重点做到："}
  </div>
  {w3PromptTags.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {w3PromptTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
        >
          {tag}
        </span>
      ))}
    </div>
  ) : (
    <div className="text-slate-500">
      {locale === "en" ? "You can click one or more tags above." : "你可以先点选上面的一个或多个修改要求。"}
    </div>
  )}
</div>
                    </div>
                  </Section>

                  <Section title="对话区" description="你发送内容后，这里会出现你和 AI 的来回对话。">
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 text-sm font-medium text-slate-700">{locale === "en" ? "My first draft" : locale === "zh-Hant" ? "我的初稿" : "我的初稿"}</div>
                        <p className="text-sm leading-8 text-slate-600">{w3Draft || "请先完成上一步初稿。"}</p>
                      </div>
                      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        {w3Chat.length === 0 && (
                          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                            你发送内容后，这里会出现“我 / AI”的对话气泡。
                          </div>
                        )}
                        {w3Chat.map((msg, idx) => (
                          <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                            <div
                              className={cn(
                                "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7",
                                msg.role === "user"
                                  ? "bg-slate-900 text-white"
                                  : "border border-slate-200 bg-slate-50 text-slate-700"
                              )}
                            >
                              <div className="mb-1 flex items-center gap-2 text-xs opacity-70">
                                {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                                {msg.role === "user" ? "我" : "AI"}
                              </div>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Section>
                </div>
              )}

              {w3Step === 3 && (
                <Section
                  title="交出你的卡片"
                  description="把最后版本写好。提交前，再检查一下你是不是合理地用了 AI。"
                >
                  <textarea
                    value={w3FinalText}
                    onChange={(e) => setW3FinalText(e.target.value)}
                    className="min-h-[240px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                    placeholder="把最后版本写在这里……"
                  />
                  <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                    <div className="mb-3 text-sm font-medium text-slate-700">提交前，先检查一下</div>
                    <div className="space-y-3">
                      {[
                        "我保留了自己的例子或想法",
                        "我改过 AI 给我的句子",
                        "我没有直接整段照搬",
                        "我知道 AI 是根据提示生成内容，不是自己“会写”",
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <input
                            type="checkbox"
                            checked={w3Checklist.includes(item)}
                            onChange={() => toggleValue(item, w3Checklist, setW3Checklist)}
                            className="h-5 w-5"
                          />
                          <span className="text-sm leading-7 text-slate-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                       disabled={!(w3FinalText.trim().length > 20 && w3Checklist.length >= 3)}
                       onClick={() => setW3Step(4)}
                    >
                      {locale === "en"
                      ? "Next: AI collaboration review"
                      : locale === "zh-Hant"
                      ? "下一步：AI 合作復盤"
                      : "下一步：AI 合作复盘"}
                    </Button>
                  </div>
                </Section>
              )}

              {w3Step === 4 && (
  <Section
    title={
      locale === "en"
        ? "AI collaboration review"
        : locale === "zh-Hant"
        ? "AI 合作復盤"
        : "AI 合作复盘"
    }
    description={
      locale === "en"
        ? "AI gave suggestions, but you decided how to use them. Choose a few tags to review this collaboration."
        : locale === "zh-Hant"
        ? "AI 給了建議，但最後怎樣使用，仍然由你決定。請用幾個標籤簡單回顧這次合作。"
        : "AI 给了建议，但最后怎么使用，仍然由你决定。请用几个标签简单回顾这次合作。"
    }
  >
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-50 p-4">
        <div className="mb-2 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "What did the AI help you with? Choose 1–2."
            : locale === "zh-Hant"
            ? "這次 AI 哪些地方幫到了你？可以選 1–2 個。"
            : "这次 AI 哪些地方帮到了你？可以选 1–2 个。"}
        </div>
        <div className="mb-3 text-xs text-slate-500">
          {locale === "en"
            ? "This part is used as AI literacy evidence."
            : locale === "zh-Hant"
            ? "這部分會作為 AI 素養證據。"
            : "这部分会作为 AI 素养证据。"}
        </div>
        <div className="flex flex-wrap gap-2">
          {w3HelpfulReviewTags.map((tag) => (
            <TagButton
              key={tag}
              active={w3HelpfulTags.includes(tag)}
              onClick={() => toggleW3HelpfulReviewTag(tag)}
            >
              {tag}
            </TagButton>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-slate-50 p-4">
        <div className="mb-2 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "What was not good enough about the AI suggestions? Choose 1–2."
            : locale === "zh-Hant"
            ? "你覺得 AI 的建議哪裡還不夠好？可以選 1–2 個。"
            : "你觉得 AI 的建议哪里还不够好？可以选 1–2 个。"}
        </div>
        <div className="mb-3 text-xs text-slate-500">
          {locale === "en"
            ? "This helps show whether you can notice the limits of AI output."
            : locale === "zh-Hant"
            ? "這可以幫助了解你是否能看出 AI 輸出的限制。"
            : "这可以帮助了解你是否能看出 AI 输出的限制。"}
        </div>
        <div className="flex flex-wrap gap-2">
          {w3LimitationReviewTags.map((tag) => (
            <TagButton
              key={tag}
              active={w3LimitationTags.includes(tag)}
              onClick={() => toggleW3LimitationReviewTag(tag)}
            >
              {tag}
            </TagButton>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-4">
        <div className="mb-2 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "Optional product feedback — not scored"
            : locale === "zh-Hant"
            ? "可選產品回饋——不計分"
            : "可选产品反馈——不计分"}
        </div>
        <p className="mb-3 text-xs leading-6 text-slate-500">
          {locale === "en"
            ? "You can write one sentence about how this AI helper could be improved."
            : locale === "zh-Hant"
            ? "你可以用一句話說說這個 AI 助手還可以怎樣改進。"
            : "你可以用一句话说说这个 AI 助手还可以怎样改进。"}
        </p>
        <textarea
          value={w3UsabilityFeedback}
          onChange={(e) => setW3UsabilityFeedback(e.target.value)}
          onBlur={() => {
            if (w3UsabilityFeedback.trim().length > 0) {
              void trackEvent({
                worldId: "w3",
                stepId: "w3_step5",
                eventType: "save",
                eventName: "w3_save_ai_usability_feedback",
                eventValueJson: {
                  textLength: w3UsabilityFeedback.trim().length,
                  scored: false,
                },
              });
            }
          }}
          className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
          placeholder={
            locale === "en"
              ? "For example: I hope it can understand my draft better, or ask me one more question before revising."
              : locale === "zh-Hant"
              ? "例如：希望它更理解我的初稿，或者修改前多問我一個問題。"
              : "例如：希望它更理解我的初稿，或者修改前多问我一个问题。"
          }
        />
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!(w3HelpfulTags.length > 0 && w3LimitationTags.length > 0)}
          onClick={() => finishWorld("w3")}
        >
          {locale === "en"
            ? "Complete World 3"
            : locale === "zh-Hant"
            ? "完成世界 3"
            : "完成世界 3"}
        </Button>
      </div>
    </div>
  </Section>
)}

              <Nav
                locale={locale}
                step={w3Step}
                setStep={setW3Step}
                maxStep={4}
                canNext={
                  (w3Step === 0 && !!w3Recipient) ||
                  (w3Step === 1 && w3Draft.trim().length > 20) ||
                  (w3Step === 2 && w3Chat.length > 0) ||
                  (w3Step === 3 && w3FinalText.trim().length > 20 && w3Checklist.length >= 3)
                }
              />
            </motion.div>
          )}

          {screen === "w4" && (
            <motion.div
              key="w4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <Header
                title={worldMeta.w4.title}
                subtitle={locale === "en" ? "You are in a student council project group. Your team has just completed a survey on how students travel to school. Now you need to organise the results and prepare a one-page brief with two recommendations for the school. You may use an AI assistant, but your team remains responsible for the final conclusions." : locale === "zh-Hant" ? "你是學生會項目小組成員。你們剛完成「同學上學方式調查」，現在要整理結果，並製作一頁簡報，向學校提出兩項建議。你們可以使用 AI 助手，但最後的結論仍要由你們負責。" : "你是学生会项目小组成员。你们刚完成“同学上学方式调查”，现在要整理结果，并做一页简报给学校两条建议。你可以用 AI 助手，但最后结论要由你们负责。"}
                badge={tr(locale, "世界4")}
                color={worldMeta.w4.color}
                icon={worldMeta.w4.icon}
                progress={p4}
                steps={locale === "en" ? ["1. See the project", "2. Break down the tasks", "3. Choose an AI helper", "4. Review the AI output", "5. Submit the workflow card"] : locale === "zh-Hant" ? ["1. 看項目", "2. 拆分任務", "3. 選 AI 助手", "4. 看 AI 結果", "5. 提交分工卡"] : ["1. 看项目", "2. 拆分任务", "3. 选AI助手", "4. 看AI结果", "5. 提交分工卡"]}
                activeStep={w4Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w4Step === 0 && (
                <Section
                  title={locale === "en" ? "First, look at the project your group needs to complete" : locale === "zh-Hant" ? "先看看你們這次要完成甚麼項目" : "先看你们这次要完成什么项目"}
                  description="看完项目简要后，你会开始决定：哪些工作可以让 AI 帮忙，哪些还是要你们自己做。"
                >
                  <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">项目任务</div>
                      <ul className="space-y-2 text-sm leading-7 text-slate-600">
                        <li>• 整理“同学上学方式调查”结果</li>
                        <li>• 做一页简报</li>
                        <li>• 给学校写两条建议</li>
                        <li>• 可以使用 AI 助手，但结论必须由小组负责</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">调查结果（示意）</div>
                      <div className="space-y-3">
                        {commuteSurveyData.map((item) => (
                          <div key={item.type} className="rounded-2xl bg-slate-50 p-3 text-sm leading-7 text-slate-600">
                            <div className="font-medium text-slate-700">
                              {item.type}：{item.count} 人
                            </div>
                            <div>{item.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {w4Step === 1 && (
                <Section
                  title="先把任务拆开：哪些工作适合让 AI 帮忙？"
                  description="可多选：把你觉得适合交给 AI 帮忙的都选出来。没选到的，默认更适合由你们自己做。"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      "统计每种上学方式的人数和比例",
                      "把调查结果整理成 3 条重点",
                      "解释为什么某种方式最常见",
                      "决定最后写给学校什么建议",
                      "检查建议是不是合理、公平、可执行",
                    ].map((task) => {
                      const active = w4AiTasks.includes(task);
                      return (
                        <button
                          key={task}
                          onClick={() => toggleValue(task, w4AiTasks, setW4AiTasks)}
                          className={cn(
                            "rounded-2xl border p-4 text-left text-sm leading-7 transition",
                            active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          {task}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {w4Step === 2 && (
                <Section
                  title="这次你想把 AI 当成哪一种助手？"
                  description="选一个角色。你下一步看到的 AI 结果会跟着变化。"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <OptionCard
                      icon={ChartColumnIncreasing}
                      title="数据整理助手"
                      note="帮你统计人数和比例。"
                      selected={w4Role === "data"}
                      onClick={() => setW4Role("data")}
                    />
                    <OptionCard
                      icon={ClipboardList}
                      title="摘要助手"
                      note="帮你把调查结果整理成 3 条重点。"
                      selected={w4Role === "summary"}
                      onClick={() => setW4Role("summary")}
                    />
                    <OptionCard
                      icon={FileText}
                      title="建议草稿助手"
                      note="帮你先写一版建议。"
                      selected={w4Role === "draft"}
                      onClick={() => setW4Role("draft")}
                    />
                  </div>
                </Section>
              )}

              {w4Step === 3 && w4Role && (
                <Section
                  title="看看这个 AI 助手给了你什么结果"
                  description="你的选择会影响这里看到的内容。看完以后，再判断这部分能不能直接用。"
                >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">{roleOutputsData[w4Role].title}</div>
                      <div className="space-y-3">
                        {roleOutputsData[w4Role].body.map((item) => (
                          <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm leading-7 text-slate-600">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <div className="mb-3 text-sm font-medium text-slate-700">这部分你会怎么用？</div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "可以直接参考",
                            "要自己修改后再用",
                            "不能直接用",
                          ].map((item) => (
                            <TagButton
                              key={item}
                              active={w4UseChoice === item}
                              onClick={() => setW4UseChoice(item)}
                            >
                              {item}
                            </TagButton>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <div className="mb-3 text-sm font-medium text-slate-700">
                          哪些工作还是要你们自己完成？（可多选）
                        </div>
                        <div className="space-y-2">
                          {[
                            "解释为什么会出现这样的结果",
                            "决定最后写给学校什么建议",
                            "检查建议是不是公平、合理、可执行",
                            "在简报里说明用了 AI 的哪一部分",
                          ].map((item) => (
                            <label key={item} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                              <input
                                type="checkbox"
                                checked={w4HumanStillDo.includes(item)}
                                onChange={() => toggleValue(item, w4HumanStillDo, setW4HumanStillDo)}
                                className="h-5 w-5"
                              />
                              <span className="text-sm leading-7 text-slate-700">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {w4Step === 4 && (
                <Section
                  title="提交分工与使用规则卡"
                  description="把你们这次项目里想怎么分工、怎么使用 AI，整理成一张卡片。"
                >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">这次项目里，AI 可以帮忙的工作</div>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        {w4AiTasks.length > 0 ? w4AiTasks.map((item) => <div key={item}>• {item}</div>) : <div>你还没有选。</div>}
                      </div>
                      <div className="mt-5 mb-3 text-sm font-medium text-slate-700">你们自己还要负责的工作</div>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        {w4HumanStillDo.length > 0 ? w4HumanStillDo.map((item) => <div key={item}>• {item}</div>) : <div>你还没有选。</div>}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <div className="mb-3 text-sm font-medium text-slate-700">
                          你们小组这次要保留哪些 AI 使用规则？（可多选）
                        </div>
                        <div className="space-y-2">
                          {[
                            "用了 AI 的地方要说明",
                            "AI 给的内容不能直接整段交上去",
                            "最后建议必须由人来决定",
                            "AI 整理的数据也要再检查一次",
                          ].map((item) => (
                            <label key={item} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                              <input
                                type="checkbox"
                                checked={w4Rules.includes(item)}
                                onChange={() => toggleValue(item, w4Rules, setW4Rules)}
                                className="h-5 w-5"
                              />
                              <span className="text-sm leading-7 text-slate-700">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={w4Reminder}
                        onChange={(e) => setW4Reminder(e.target.value)}
                        className="min-h-[160px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                        placeholder="你还想提醒小组注意什么？"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      disabled={!(w4Rules.length > 0 && w4Reminder.trim().length > 8)}
                      onClick={() => finishWorld("w4")}
                    >
                      提交分工与规则卡
                    </Button>
                  </div>
                </Section>
              )}

              <Nav
                locale={locale}
                step={w4Step}
                setStep={setW4Step}
                maxStep={4}
                canNext={
                  (w4Step === 0) ||
                  (w4Step === 1 && w4AiTasks.length > 0) ||
                  (w4Step === 2 && !!w4Role) ||
                  (w4Step === 3 && !!w4UseChoice && w4HumanStillDo.length > 0) ||
                  (w4Step === 4 && w4Rules.length > 0 && w4Reminder.trim().length > 8)
                }
              />
            </motion.div>
          )}

          {screen === "w5" && (
            <motion.div
              key="w5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <Header
                title={worldMeta.w5.title}
                subtitle={locale === "en" ? "You are part of the school eco-tech team. The school wants to launch a waste-sorting AI helper that lets students take a photo and see which bin an item belongs in. During testing, however, it often gets some cases wrong. Your job is to find the problem, improve the system, and submit a short improvement card." : locale === "zh-Hant" ? "你是學校環保科技小組成員。學校想推出一個「垃圾分類 AI 助手」，幫助同學拍照判斷物品應投進哪個回收桶。不過試用後發現，它在某些情況下經常判錯。你的任務是找出問題、幫它改進，並交一張系統改進說明卡。" : "你是学校环保科技小组成员。学校想上线一个“垃圾分类AI助手”，帮助同学拍照判断物品该投到哪个回收桶。可是试用后发现，它在一些情况下经常判断错。你的任务是找出问题、帮它改进，并交一张系统改进说明卡。"}
                badge={tr(locale, "世界5")}
                color={worldMeta.w5.color}
                icon={worldMeta.w5.icon}
                progress={p5}
                steps={locale === "en" ? ["1. See where it fails", "2. Find the cause", "3. Add better training images", "4. Review usage warnings", "5. Submit the system card"] : locale === "zh-Hant" ? ["1. 看系統出錯", "2. 找原因", "3. 補訓練圖片", "4. 看使用提醒", "5. 交說明卡"] : ["1. 看系统出错", "2. 找原因", "3. 补训练图片", "4. 看使用提醒", "5. 交说明卡"]}
                activeStep={w5Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w5Step === 0 && (
                <Section
                  title={locale === "en" ? "First, see when this system makes mistakes" : locale === "zh-Hant" ? "先看看這個系統會在甚麼情況下出錯" : "先看看这个系统在哪些情况下会出错"}
                  description="选一个你觉得最需要先修的问题。你的选择会影响后面的训练图片和说明卡。"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    {(Object.keys(recycleCasesData) as Array<"lighting" | "crushed" | "similar">).map((key) => {
                      const item = recycleCasesData[key];
                      return (
                        <OptionCard
                          key={key}
                          emoji={item.emoji}
                          title={item.title}
                          note={`${item.system} ${item.actual}`}
                          selected={w5Problem === key}
                          onClick={() => setW5Problem(key)}
                        />
                      );
                    })}
                  </div>
                </Section>
              )}

              {w5Step === 1 && w5Problem && (
                <Section
                  title="你觉得它为什么会这样错？"
                  description={`你刚才选的是：${recycleCasesData[w5Problem].title}。现在请找一个最可能的原因。`}
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <OptionCard
                      icon={ImageIcon}
                      title="训练图片太单一"
                      note="背景、光线、角度不够多。"
                      selected={w5Cause === "data"}
                      onClick={() => setW5Cause("data")}
                    />
                    <OptionCard
                      icon={AlertTriangle}
                      title="外形很像，系统还学得不够好"
                      note="它还不会区分一些容易混淆的情况。"
                      selected={w5Cause === "similar"}
                      onClick={() => setW5Cause("similar")}
                    />
                    <OptionCard
                      icon={ClipboardList}
                      title="规则本身不够清楚"
                      note="有些情况本来就需要更明确说明。"
                      selected={w5Cause === "rule"}
                      onClick={() => setW5Cause("rule")}
                    />
                    <OptionCard
                      icon={Sparkles}
                      title="只是系统跑得太慢"
                      note="这不一定能解释为什么会判断错。"
                      selected={w5Cause === "speed"}
                      onClick={() => setW5Cause("speed")}
                    />
                  </div>
                </Section>
              )}

              {w5Step === 2 && w5Problem && (
                <Section
                  title="帮它补更好的训练图片"
                  description="可多选：把你觉得应该补进去的训练图片都选出来。你刚才选的问题不同，这里看到的图片也会不同。"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {world5Images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => toggleValue(img.id, w5Training, setW5Training)}
                        className={cn(
                          "rounded-3xl border p-4 text-left transition",
                          w5Training.includes(img.id)
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        )}
                      >
                        <div className={cn("mb-4 flex h-24 items-center justify-center rounded-2xl", w5Training.includes(img.id) ? "bg-white/10" : img.good ? "bg-gradient-to-br from-emerald-50 to-lime-100" : "bg-gradient-to-br from-slate-50 to-slate-100")}>
                          <Recycle className={cn("h-10 w-10", w5Training.includes(img.id) ? "text-white" : "text-slate-700")} />
                        </div>
                        <p className="font-semibold">{img.title}</p>
                        <p className={cn("mt-1 text-sm leading-6", w5Training.includes(img.id) ? "text-white/80" : "text-slate-500")}>
                          {img.note}
                        </p>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {w5Step === 3 && (
                <Section
                  title="就算改进了，使用时还要提醒大家注意什么？"
                  description="可多选：想一想这个系统就算改得更好了，还可能在哪些地方需要提醒同学。"
                >
                  <div className="space-y-3">
                    {[
                      "它在某些特殊物品上还是可能判断错",
                      "使用时要再自己看一眼，不要完全照着做",
                      "如果系统不解释理由，大家可能不知道为什么这样判",
                      "训练和不断改进也会消耗资源",
                    ].map((item) => {
                      const active = w5Reminders.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleValue(item, w5Reminders, setW5Reminders)}
                          className={cn(
                            "w-full rounded-2xl border p-4 text-left text-sm leading-7 transition",
                            active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {w5Step === 4 && (
                <Section
                  title="交一张系统改进说明卡"
                  description="现在把你前面做的判断收成一张卡：这个系统能做什么、哪里还会错、该怎么提醒大家、还想怎么继续改。"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <textarea
                      value={w5Card.purpose}
                      onChange={(e) => setW5Card((prev) => ({ ...prev, purpose: e.target.value }))}
                      className="min-h-[140px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                      placeholder="这个系统能帮大家做什么？"
                    />
                    <textarea
                      value={w5Card.limits}
                      onChange={(e) => setW5Card((prev) => ({ ...prev, limits: e.target.value }))}
                      className="min-h-[140px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                      placeholder="它在哪些情况下还可能会错？"
                    />
                    <textarea
                      value={w5Card.reminder}
                      onChange={(e) => setW5Card((prev) => ({ ...prev, reminder: e.target.value }))}
                      className="min-h-[140px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                      placeholder="使用时要提醒同学注意什么？"
                    />
                    <textarea
                      value={w5Card.improve}
                      onChange={(e) => setW5Card((prev) => ({ ...prev, improve: e.target.value }))}
                      className="min-h-[140px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                      placeholder="我还建议怎么继续改？"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      disabled={
                        !(
                          w5Card.purpose.trim().length > 5 &&
                          w5Card.limits.trim().length > 5 &&
                          w5Card.reminder.trim().length > 5 &&
                          w5Card.improve.trim().length > 5
                        )
                      }
                      onClick={() => finishWorld("w5")}
                    >
                      提交系统改进说明卡
                    </Button>
                  </div>
                </Section>
              )}

              <Nav
                locale={locale}
                step={w5Step}
                setStep={setW5Step}
                maxStep={4}
                canNext={
                  (w5Step === 0 && !!w5Problem) ||
                  (w5Step === 1 && !!w5Cause) ||
                  (w5Step === 2 && w5Training.length > 0) ||
                  (w5Step === 3 && w5Reminders.length > 0) ||
                  (w5Step === 4 &&
                    w5Card.purpose.trim().length > 5 &&
                    w5Card.limits.trim().length > 5 &&
                    w5Card.reminder.trim().length > 5 &&
                    w5Card.improve.trim().length > 5)
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!sessionId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
            <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-500">开始测试前</div>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900">先填写学生信息</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    请根据实际情况，填写你的信息。
                  </p>
                </div>
                <Link href="/teacher" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                  进入教师端
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">姓名 *</div>
                  <input value={identity.studentName} onChange={(e) => setIdentity((prev) => ({ ...prev, studentName: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">学号 *</div>
                  <input value={identity.studentCode} onChange={(e) => setIdentity((prev) => ({ ...prev, studentCode: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">班级 *</div>
                  <input value={identity.className} onChange={(e) => setIdentity((prev) => ({ ...prev, className: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-slate-700">学校</div>
                  <input value={identity.schoolName} onChange={(e) => setIdentity((prev) => ({ ...prev, schoolName: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
                <label className="block md:col-span-2">
                  <div className="mb-2 text-sm font-medium text-slate-700">年级</div>
                  <input value={identity.gradeLevel} onChange={(e) => setIdentity((prev) => ({ ...prev, gradeLevel: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
                </label>
              </div>

              {identityError ? <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{identityError}</div> : null}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={startStudentSession}
                  disabled={startingSession}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {startingSession ? "正在开始…" : "开始测试"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
