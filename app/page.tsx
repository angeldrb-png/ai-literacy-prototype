"use client";
import ReScoreSessionButton from "@/components/teacher/ReScoreSessionButton";
import W3CardPreviewShared from "@/components/shared/W3CardPreviewShared";
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
  ShieldCheck,
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
type W5ProblemId = "recycling_station" | "lighting" | "crushed" | "similar";

const W5_DEFAULT_PROBLEM: W5ProblemId = "recycling_station";

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

type DragColumn<T extends string> = {
  id: T;
  title: string;
  note?: string;
};

type DragCardItem = {
  id: string;
  label: string;
  note?: string;
};

function DragBoard<T extends string>({
  title,
  description,
  cards,
  columns,
  allocation,
  onAssign,
  unassignedLabel = "待处理卡片",
  emptyLabel = "拖到这里，或先点选卡片再点目标栏",
  allAssignedLabel = "所有卡片都已放入栏目。",
  selectedHintLabel = "已选中一张卡片。你可以拖拽它，或直接点击目标栏目。",
}: {
  title: string;
  description?: string;
  cards: DragCardItem[];
  columns: DragColumn<T>[];
  allocation: Record<string, T | "">;
  onAssign: (cardId: string, columnId: T) => void;
  unassignedLabel?: string;
  emptyLabel?: string;
  allAssignedLabel?: string;
  selectedHintLabel?: string;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const unassignedCards = cards.filter((card) => !allocation[card.id]);

  function assignTo(columnId: T) {
    const id = draggingId || selectedId;
    if (!id) return;
    onAssign(id, columnId);
    setDraggingId(null);
    setSelectedId(null);
  }

  function renderCard(card: DragCardItem) {
    const selected = selectedId === card.id;
    return (
      <button
        key={card.id}
        type="button"
        draggable
        onClick={() => setSelectedId((prev) => (prev === card.id ? null : card.id))}
        onDragStart={() => {
          setDraggingId(card.id);
          setSelectedId(card.id);
        }}
        onDragEnd={() => setDraggingId(null)}
        className={cn(
          "w-full cursor-grab rounded-2xl border bg-white p-3 text-left text-sm shadow-sm transition active:cursor-grabbing",
          selected ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200 hover:bg-slate-50"
        )}
      >
        <div className="font-medium text-slate-900">{card.label}</div>
        {card.note ? <div className="mt-1 text-xs leading-5 text-slate-500">{card.note}</div> : null}
      </button>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}

      <div className="mt-4 rounded-2xl bg-slate-50 p-3">
        <div className="mb-2 text-xs font-medium text-slate-500">{unassignedLabel}</div>
        <div className="grid gap-2 md:grid-cols-2">
          {unassignedCards.length ? (
  unassignedCards.map(renderCard)
) : (
  <div className="text-sm text-slate-400">{allAssignedLabel}</div>
)}
        </div>
      </div>

      <div className={cn("mt-4 grid gap-3", columns.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
        {columns.map((column) => {
          const columnCards = cards.filter((card) => allocation[card.id] === column.id);
          return (
            <div
              key={column.id}
              role="button"
              tabIndex={0}
              onClick={() => assignTo(column.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") assignTo(column.id);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => assignTo(column.id)}
              className={cn(
                "min-h-[180px] rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-3 outline-none transition",
                selectedId && "hover:border-slate-900 hover:bg-slate-100"
              )}
            >
              <div className="mb-2 font-semibold text-slate-900">{column.title}</div>
              {column.note ? <div className="mb-3 text-xs leading-5 text-slate-500">{column.note}</div> : null}
              <div className="space-y-2">
                {columnCards.length ? columnCards.map(renderCard) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                    {emptyLabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedId ? (
  <p className="mt-3 text-xs text-slate-500">{selectedHintLabel}</p>
) : null}
    </div>
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
function CompactHint({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
      <summary className="cursor-pointer font-medium text-slate-700">{title}</summary>
      <div className="mt-2 leading-7">{children}</div>
    </details>
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
      {step >= maxStep ? (
  <Button variant="ghost" disabled>
    {locale === "en"
      ? "Last step"
      : locale === "zh-Hant"
      ? "已到最後一步"
      : "已到最后一步"}
  </Button>
) : (
  <Button
    disabled={!canNext}
    onClick={() => setStep((s) => Math.min(maxStep, s + 1))}
  >
    {tr(locale, "下一步")} <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
)}
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
  <Pill tone="outline">
    {locale === "en"
      ? "Mission task"
      : locale === "zh-Hant"
      ? "任務挑戰"
      : "任务挑战"}
  </Pill>
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
    domains: ["Engaging with AI", "Managing AI"],
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
    recycling_station: {
    title: "校园回收站连续误判事件",
    emoji: "♻️",
    system: "系统在几条现场记录中反复给出可疑判断。",
    actual: "需要先找出可能有问题的地方，再判断如何改进。",
  },
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
    recycling_station: [
    {
      id: "l1",
      title: "不同光线下的塑料瓶",
      note: "覆盖昏暗走廊与明亮环境，更贴近真实投放场景",
      good: true,
    },
    {
      id: "c1",
      title: "压扁、折叠后的纸盒",
      note: "让系统看到真实物品形状变化",
      good: true,
    },
    {
      id: "s1",
      title: "外形相近但材质不同的杯子",
      note: "帮助系统学习区分相似物品",
      good: true,
    },
    {
      id: "l2",
      title: "只在明亮白底下拍的塑料瓶",
      note: "场景太单一，不能覆盖真实走廊环境",
      good: false,
    },
    {
      id: "c4",
      title: "教室桌面照片",
      note: "和垃圾分类任务关系不大",
      good: false,
    },
    {
      id: "s2",
      title: "只有一种塑料杯",
      note: "缺少可比较的相似物品",
      good: false,
    },
  ],
  lighting: [
    { id: "l1", title: "不同光线下的塑料瓶", note: "更贴近真实环境", good: true },
    { id: "l2", title: "只在明亮白底下拍的塑料瓶", note: "场景太单一", good: false },
    { id: "l3", title: "教室、走廊、户外不同背景", note: "更有代表性", good: true },
    { id: "l4", title: "和垃圾分类无关的猫咪照片", note: "不相关", good: false },
  ],
  crushed: [
  { id: "c1", title: "压扁的纸盒", note: "useful", good: true },
  { id: "c3", title: "不同破损程度的纸盒", note: "useful", good: true },
  { id: "c5", title: "折起来的纸盒", note: "useful", good: true },
  { id: "c6", title: "潮湿变形的纸盒", note: "useful", good: true },
  { id: "c2", title: "完整平整的纸盒", note: "narrow", good: false },
  { id: "c4", title: "教室桌面照片", note: "irrelevant", good: false },
  { id: "c7", title: "塑料瓶照片", note: "irrelevant", good: false },
  { id: "c8", title: "普通风景照片", note: "irrelevant", good: false },
],
  similar: [
    { id: "s1", title: "外形相近但材质不同的杯子", note: "帮助系统学会区分", good: true },
    { id: "s2", title: "只有一种塑料杯", note: "没有比较关系", good: false },
    { id: "s3", title: "带盖、带吸管、带标签的杯子", note: "更贴近真实情况", good: true },
    { id: "s4", title: "风景照片", note: "和分类任务无关", good: false },
  ],
} as const;
const w5StakeholderOptions = [
  {
    id: "cleaning_staff",
    label: "清洁人员",
  },
  {
    id: "younger_students",
    label: "低年级学生",
  },
  {
    id: "students_in_dark_hallway",
    label: "在昏暗走廊投放垃圾的同学",
  },
  {
    id: "students_with_similar_items",
    label: "拿着相似杯子的同学",
  },
  {
    id: "canteen_users",
    label: "在食堂使用分类箱的人",
  },
  {
    id: "no_one",
    label: "没有人会受到影响",
  },
] as const;

const w5UnfairOutcomeOptions = [
  {
    id: "wrong_bin_guidance",
    label: "系统给出错误分类提示",
  },
  {
    id: "extra_work_for_cleaning_staff",
    label: "清洁人员需要重新检查",
  },
  {
    id: "students_lose_trust",
    label: "学生不再相信分类系统",
  },
  {
    id: "unfair_blame",
    label: "学生可能被错误责备",
  },
] as const;

const w5BiasCauseOptions = [
  {
    id: "training_data_lacks_lighting_variation",
    label: "训练图片缺少不同光线",
  },
  {
    id: "training_data_lacks_shape_variation",
    label: "训练图片缺少不同形状",
  },
  {
    id: "visual_features_too_similar",
    label: "物品外观太相似",
  },
  {
    id: "rule_boundary_unclear",
    label: "规则边界不够清楚",
  },
  {
    id: "human_check_needed",
    label: "需要人类复核不确定情况",
  },
  {
    id: "data_or_rule_limit",
    label: "数据或规则本身有限制",
  },
] as const;

const w5BiasMitigationOptions = [
  {
    id: "add_diverse_training_images",
    label: "加入更多不同情况的训练图片",
  },
  {
    id: "human_check_uncertain_cases",
    label: "不确定时交给人检查",
  },
  {
    id: "explain_system_limits",
    label: "向使用者说明系统限制",
  },
  {
    id: "allow_user_correction",
    label: "允许使用者纠正错误",
  },
] as const;

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
    title: "欢迎来到 AI 任务地图",
    note: "接下来你会完成 5 个和 AI 有关的小任务。请按自己的想法判断和选择，不用担心答得快不快。",
    introTitle: "你会做什么？",
    introPoints: [
      "你会试用 AI 推荐、检查 AI 写的信息，也会和 AI 一起完成一个小作品。",
      "有些任务需要你选择、拖动卡片，或写一点自己的想法。",
      "这不是背书题，也不是比谁答得最快。我们想了解你怎样理解和使用 AI。",
    ],
    name: "姓名 *",
    code: "学号 *",
    className: "班级 *",
    school: "学校",
    grade: "年级",
    start: "开始任务",
    starting: "正在进入…",
    back: "返回入口页",
    required: "带 * 的项目需要填写",
  },
  "zh-Hant": {
    title: "歡迎來到 AI 任務地圖",
    note: "接下來你會完成 5 個和 AI 有關的小任務。請按自己的想法判斷和選擇，不用擔心答得快不快。",
    introTitle: "你會做甚麼？",
    introPoints: [
      "你會試用 AI 推薦、檢查 AI 寫的資訊，也會和 AI 一起完成一個小作品。",
      "有些任務需要你選擇、拖動卡片，或寫一點自己的想法。",
      "這不是背書題，也不是比誰答得最快。我們想了解你怎樣理解和使用 AI。",
    ],
    name: "姓名 *",
    code: "學號 *",
    className: "班別 *",
    school: "學校",
    grade: "年級",
    start: "開始任務",
    starting: "正在進入…",
    back: "返回入口頁",
    required: "有 * 的項目需要填寫",
  },
  en: {
    title: "Welcome to the AI Mission Map",
    note: "You will complete five short missions about AI. Follow your own judgement and take your time.",
    introTitle: "What will you do?",
    introPoints: [
      "You will try AI recommendations, check AI-written information, and create a small piece with AI.",
      "Some missions ask you to choose, drag cards, or write a short answer.",
      "This is not a memory test or a speed test. We want to see how you understand and use AI.",
    ],
    name: "Name *",
    code: "Student ID *",
    className: "Class *",
    school: "School",
    grade: "Grade",
    start: "Start missions",
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

type W3RewriteIntent =
  | "clearer"
  | "warmer"
  | "fit_recipient"
  | "keep_example"
  | "keep_voice"
  | "less_formal";

type W3RewriteSignals = {
  clearer: boolean;
  warmer: boolean;
  fitRecipient: boolean;
  keepExample: boolean;
  keepVoice: boolean;
  lessFormal: boolean;
};

function getW3RewriteSignals(promptText: string, selectedTags: string[]): W3RewriteSignals {
  const merged = `${promptText} ${selectedTags.join(" ")}`.toLowerCase();

  return {
    clearer: /清楚|清晰|更明白|更清楚|clear|clearer|clarify/.test(merged),
    warmer:
      selectedTags.includes("warmer") ||
      selectedTags.includes("warmer_tone") ||
      /温暖|溫暖|柔和|鼓励|鼓勵|warm|warmer|soft|gentle/.test(merged),
    fitRecipient:
      selectedTags.includes("fit_recipient") ||
      /更像写给这个人|更像寫給這個人|对象|對象|这个人|這個人|recipient|fit|貼近|贴近/.test(merged),
    keepExample:
      selectedTags.includes("keep_example") ||
      /不要删掉我的例子|不要刪掉我的例子|保留例子|例子|经历|經歷|example|detail/.test(merged),
    keepVoice:
      selectedTags.includes("keep_voice") ||
      /保留我的语气|保留我的語氣|像我|自己的话|自己的話|keep.*voice|keep.*tone/.test(merged),
    lessFormal:
      selectedTags.includes("less_formal") ||
      /不要太正式|太正式|自然一点|自然一點|口语|口語|less formal|natural|casual/.test(merged),
  };
}

function pickW3RewriteIntent(promptText: string, selectedTags: string[]): W3RewriteIntent {
  const signals = getW3RewriteSignals(promptText, selectedTags);

  // 输入框里的明确要求优先，因为这更像真实 prompt。
  if (/清楚|清晰|更明白|更清楚|clear|clearer|clarify/i.test(promptText)) {
    return "clearer";
  }

  if (/温暖|溫暖|柔和|鼓励|鼓勵|warm|warmer|soft/i.test(promptText)) {
    return "warmer";
  }

  if (/对象|對象|这个人|這個人|recipient|fit|贴近|貼近/i.test(promptText)) {
    return "fit_recipient";
  }

  if (/例子|经历|經歷|example|detail/i.test(promptText)) {
    return "keep_example";
  }

  if (/语气|語氣|像我|自己的话|自己的話|voice|tone/i.test(promptText)) {
    return "keep_voice";
  }

  if (/不要太正式|太正式|自然|口语|口語|less formal|natural|casual/i.test(promptText)) {
    return "less_formal";
  }

  // 没有输入框要求时，再看标签。
  if (signals.fitRecipient) return "fit_recipient";
  if (signals.warmer) return "warmer";
  if (signals.keepExample) return "keep_example";
  if (signals.lessFormal) return "less_formal";
  if (signals.keepVoice) return "keep_voice";
  if (signals.clearer) return "clearer";

  return "clearer";
}

function appendW3Sentence(text: string, sentence: string, locale: Locale) {
  const trimmed = text.trim();
  if (!trimmed) return sentence;

  if (locale === "en") {
    const needsSpace = !trimmed.endsWith(" ");
    return `${trimmed}${needsSpace ? " " : ""}${sentence}`;
  }

  return `${trimmed}${sentence}`;
}

function getW3WarmAddOn(locale: Locale, recipient: W3Recipient) {
  const lines = {
    "zh-Hans": {
      junior: "你不用一下子把所有事情都做好，慢慢来，也是在往前走。",
      stress: "你不用一直撑着，先照顾好自己也很重要。",
      new: "你不用马上适应所有事情，先让自己安心一点就很好。",
      elder: "也希望这张卡片能把一点温暖送回给您。",
    },
    "zh-Hant": {
      junior: "你不用一下子把所有事情都做好，慢慢來，也是在往前走。",
      stress: "你不用一直撐着，先照顧好自己也很重要。",
      new: "你不用馬上適應所有事情，先讓自己安心一點就很好。",
      elder: "也希望這張卡片能把一點溫暖送回給您。",
    },
    en: {
      junior: "You do not have to get everything right at once; taking it slowly is also progress.",
      stress: "You do not have to keep holding everything together; taking care of yourself matters too.",
      new: "You do not have to adapt to everything immediately; feeling a little safer is already a good start.",
      elder: "I hope this small card can send a little warmth back to you.",
    },
  } as const;

  return lines[locale][recipient];
}

function getW3VoiceAddOn(locale: Locale) {
  return locale === "en"
    ? "I kept it close to your own way of speaking, rather than making it sound like a generic card."
    : locale === "zh-Hant"
    ? "我盡量保留你自己的說話方式，沒有把它改成很普通的卡片套話。"
    : "我尽量保留你自己的说话方式，没有把它改成很普通的卡片套话。";
}

function getW3ExampleAddOn(locale: Locale) {
  return locale === "en"
    ? "I kept the concrete example because it makes the message feel more real."
    : locale === "zh-Hant"
    ? "我保留了具體例子，因為它會讓心意更真實。"
    : "我保留了具体例子，因为它会让心意更真实。";
}

function getW3RecipientAddOn(locale: Locale, recipient: W3Recipient) {
  const lines = {
    "zh-Hans": {
      junior: "我也把内容调得更像写给刚升上中学的学弟妹。",
      stress: "我也把内容调得更像写给正在承受压力的同学。",
      new: "我也把内容调得更像写给刚来到新学校的同学。",
      elder: "我也把内容调得更像写给一位长者，而不是普通同学。",
    },
    "zh-Hant": {
      junior: "我也把內容調得更像寫給剛升上中學的學弟妹。",
      stress: "我也把內容調得更像寫給正在承受壓力的同學。",
      new: "我也把內容調得更像寫給剛來到新學校的同學。",
      elder: "我也把內容調得更像寫給一位長者，而不是普通同學。",
    },
    en: {
      junior: "I also made it sound more like it is written for a new secondary student.",
      stress: "I also made it sound more like it is written for a classmate under pressure.",
      new: "I also made it sound more like it is written for a new student at school.",
      elder: "I also made it sound more like it is written for an elder, not a classmate.",
    },
  } as const;

  return lines[locale][recipient];
}

function polishW3CompositeRewrite(
  rewritten: string,
  locale: Locale,
  recipient: W3Recipient,
  primaryIntent: W3RewriteIntent,
  signals: W3RewriteSignals
) {
  let next = rewritten;

  if (signals.lessFormal && primaryIntent !== "less_formal") {
    next = applyW3LessFormal(next);
  }

  // 多标签时，让文字本身也有一点变化，而不是只改 note。
  if (signals.warmer && primaryIntent !== "warmer") {
    next = appendW3Sentence(next, getW3WarmAddOn(locale, recipient), locale);
  }

  return next;
}

function buildW3CompositeNote(
  locale: Locale,
  primaryNote: string,
  primaryIntent: W3RewriteIntent,
  signals: W3RewriteSignals,
  recipient: W3Recipient
) {
  const parts: string[] = [primaryNote];

  if (signals.keepVoice && primaryIntent !== "keep_voice") {
    parts.push(getW3VoiceAddOn(locale));
  }

  if (signals.keepExample && primaryIntent !== "keep_example") {
    parts.push(getW3ExampleAddOn(locale));
  }

  if (signals.fitRecipient && primaryIntent !== "fit_recipient") {
    parts.push(getW3RecipientAddOn(locale, recipient));
  }

  if (signals.lessFormal && primaryIntent !== "less_formal") {
    parts.push(
      locale === "en"
        ? "I also made the wording less formal."
        : locale === "zh-Hant"
        ? "我也把語氣改得沒有那麼正式。"
        : "我也把语气改得没有那么正式。"
    );
  }

  if (signals.warmer && primaryIntent !== "warmer") {
    parts.push(
      locale === "en"
        ? "I also made the ending warmer."
        : locale === "zh-Hant"
        ? "我也把結尾調得更溫暖。"
        : "我也把结尾调得更温暖。"
    );
  }

  return parts.join(locale === "en" ? " " : "");
}
function buildW3AiRewriteLocalized(
  locale: Locale,
  recipient: W3Recipient,
  sourceText: string,
  selectedTags: string[],
  promptText = ""
): W3AiRewriteResult {
  if (isW3LowQualityDraft(sourceText)) {
    return buildW3LowQualityScaffold(locale, recipient);
  }

  const intent = pickW3RewriteIntent(promptText, selectedTags);

  const bank: Record<
    Locale,
    Record<W3Recipient, Record<string, { rewritten: string; note: string }>>
  > = {
    "zh-Hans": {
      junior: {
        clearer: {
          rewritten:
            "刚升上中学的时候，很多事情都会让人不安。你可能会担心功课跟不上，也可能不知道午饭时该和谁坐在一起。我以前也有过这种感觉。后来我发现，只要先找到一两个愿意一起聊天、一起做功课的人，心里就会安定很多。你不用一下子做到很好，慢慢来，也是在往前走。",
          note: "我把原来的意思分得更清楚：先写不安，再写具体例子，最后保留你“慢慢来”的鼓励。",
        },
        warmer: {
          rewritten:
            "刚上中学时，害怕自己跟不上、找不到朋友，真的很正常。你不是一个人在这样想。我以前也会连午饭时坐哪里都担心。后来慢慢发现，只要有一两个愿意一起聊天、一起努力的人，学校生活就会安心很多。你可以慢慢适应，不用急着把所有事情都做好。",
          note: "我保留了你的经历，但把语气放软了一点，让对方更容易感到被理解。",
        },
        fit_recipient: {
          rewritten:
            "刚升上中学的这段时间，可能最难的不是某一件大事，而是每天都有很多小变化。比如功课节奏、午饭时间、认识新同学，都会让人有点紧张。我以前也这样。后来我发现，先找到一两个可以一起聊天、一起做功课的人，会让心里踏实很多。你不用马上适应，慢慢找到自己的节奏就好。",
          note: "我让内容更贴近“刚升上中学的学弟妹”，加入了他们可能遇到的具体变化。",
        },
        keep_example: {
          rewritten:
            "我刚上中学的时候，也很怕自己跟不上，连午饭时间都不知道该跟谁坐。这个感觉我一直记得。后来我发现，先找到一两个愿意一起聊天、一起做功课的人，心里会安稳很多。你不用一下子把所有事情都做好，先让自己每天安心一点，就已经很好了。",
          note: "我保留了你最具体的午饭例子，没有把它改成空泛鼓励。",
        },
        keep_voice: {
          rewritten:
            "我刚上中学的时候，也很怕自己跟不上，连午饭时间都不知道该跟谁坐。后来我发现，只要先找到一两个愿意一起聊天、一起做功课的人，心里真的会安稳很多。你不用一下子把所有事情都做得很好，慢慢来就可以。",
          note: "我只把句子调顺了一点，尽量保留你原本自然、真诚的语气。",
        },
        less_formal: {
          rewritten:
            "刚上中学的时候，紧张很正常。我以前也会怕自己跟不上，甚至午饭时不知道该跟谁坐。后来我慢慢发现，有一两个可以一起聊天、一起做功课的人，心里就会稳很多。你不用急，先慢慢适应就好。",
          note: "我删掉了一些比较书面的表达，让它更像自然说给对方听的话。",
        },
      },
      stress: {
        clearer: {
          rewritten:
            "如果你最近真的很累，可以先不用假装自己没事。压力大的时候，休息不是偷懒，而是在让自己重新有力气。我想告诉你，你不是不够好，只是这段时间承担了太多。先照顾好自己，再慢慢处理事情，也可以。",
          note: "我把原来的安慰改得更清楚：先承认辛苦，再说明休息的意义，最后给出支持。",
        },
        warmer: {
          rewritten:
            "如果你最近真的很累，我希望你先知道：你不用一直撑着。很多时候，能停下来喘口气，已经是在照顾自己了。你不是不够好，也不是太脆弱，只是这段时间真的辛苦。希望你今天能轻松一点，也记得有人在关心你。",
          note: "我把语气改得更温柔，减少了说教感。",
        },
        fit_recipient: {
          rewritten:
            "给最近压力很大的你：如果这几天觉得很累，不代表你做得不好。可能只是功课、事情和情绪一起压过来了。你可以先让自己休息一下，再一点点处理。你不用马上变得很有精神，也不用一个人硬撑。",
          note: "我让内容更像写给正在承受压力的同学，而不是一般鼓励。",
        },
        keep_example: {
          rewritten:
            "如果你最近真的很累，也不用一直假装自己没事。我想保留这个意思，因为有时候承认自己辛苦了，已经很不容易。你不是不够好，只是已经撑了很久。可以先休息一下，再慢慢往前走。",
          note: "我保留了你原来“不用假装没事”的核心句子。",
        },
        keep_voice: {
          rewritten:
            "如果你最近真的很累，也不用一直假装自己没事。很多时候，先让自己休息一下，比逼自己继续撑着更重要。你不是不够好，你只是已经很辛苦了。慢一点也没有关系。",
          note: "我主要整理句子节奏，尽量保留你的原意和语气。",
        },
        less_formal: {
          rewritten:
            "最近很累的话，真的不用一直装作没事。人有时候就是需要停一停。你不是不够好，只是这段时间太辛苦了。先休息一下，再慢慢来，也可以。",
          note: "我把句子改得更口语、更直接，但保留关心。",
        },
      },
      new: {
        clearer: {
          rewritten:
            "刚来到一个新学校，会不安是很正常的。你可能会担心说错话，也可能不知道该和谁一起走。我以前也有过这种感觉。后来我发现，不用一下子认识很多人，先和一两个愿意打招呼的人慢慢熟起来，就会轻松很多。",
          note: "我让对象和情境更清楚，突出“新加入学校”的不安。",
        },
        warmer: {
          rewritten:
            "来到新学校的时候，心里有点不安，真的很正常。你不用急着马上适应，也不用逼自己一下子认识很多人。可以先从一个微笑、一次打招呼开始。慢慢地，你会找到让自己安心的人和地方。",
          note: "我把语气改得更温暖，让对方感到可以慢慢来。",
        },
        fit_recipient: {
          rewritten:
            "给刚来到学校的你：一开始觉得陌生、紧张，并不奇怪。新教室、新同学、新路线，都会让人有点不确定。你可以先记住几个熟悉的地方，再试着和一两个同学打招呼。你不用马上融入所有人，先让自己安心下来就好。",
          note: "我加入了新同学会遇到的具体校园情境。",
        },
        keep_example: {
          rewritten:
            "刚来到一个新地方的时候，真的会有点不安。我以前也会担心自己说错话、找不到人一起走。这个感觉我想保留下来。后来我发现，先认识一两个愿意打招呼的人，很多事情都会慢慢变容易。",
          note: "我保留了你原来的具体担心，没有改成泛泛欢迎。",
        },
        keep_voice: {
          rewritten:
            "刚来到一个新地方的时候，真的会有点不安。我以前也会担心自己说错话、找不到人一起走。后来我发现，只要先认识一两个愿意打招呼的人，很多事情都会慢慢变容易。你不用急着马上适应。",
          note: "我保留了你原本的表达，只让结尾更完整。",
        },
        less_formal: {
          rewritten:
            "刚来新学校，不安很正常。我以前也会怕说错话，或者找不到人一起走。后来慢慢发现，先认识一两个会打招呼的人，就会好很多。你不用急，慢慢来就好。",
          note: "我把表达改得更自然、更像同学之间说的话。",
        },
      },
      elder: {
        clearer: {
          rewritten:
            "谢谢您每次见到我们都会笑着打招呼。对我们来说，这不只是一个简单的问候。有时候，听到您温柔地问一句“今天过得怎么样”，就会让人觉得被关心。也希望您每天都能感受到别人给您的温暖。",
          note: "我把感谢对象和感谢原因写得更清楚，让心意更具体。",
        },
        warmer: {
          rewritten:
            "谢谢您总是愿意温柔地听我们说话。您的笑容和问候，看起来只是很小的事，但常常会让人心里亮一点。希望这张小卡片也能把一点温暖送给您，愿您每天都能轻松、安心，也感受到有人惦记着您。",
          note: "我增强了温暖感，但没有把它改成过度正式的祝福。",
        },
        fit_recipient: {
          rewritten:
            "写给一直关心我们的您：谢谢您每次见到我们都会笑着打招呼，也愿意听我们说学校里的小事。对长者来说，被记得、被问候，也是一种很重要的关心。希望您每天都能感受到这份温暖。",
          note: "我让内容更贴近社区长者，而不是普通同学。",
        },
        keep_example: {
          rewritten:
            "谢谢您每次见到我们都会笑着打招呼。有时候，光是听到您温柔地问一句“今天过得怎么样”，就会让人心里暖暖的。我想保留这个小细节，因为它最能说明您的关心。也希望您每天都能被温柔对待。",
          note: "我保留了你原来的问候例子，并让它成为卡片重点。",
        },
        keep_voice: {
          rewritten:
            "谢谢您每次见到我们都会笑着打招呼。有时候，光是听到您温柔地问一句“今天过得怎么样”，就会让人心里暖暖的。也希望您每天都能感受到别人对您的关心。",
          note: "我尽量保留你的原话，只让表达更顺一些。",
        },
        less_formal: {
          rewritten:
            "谢谢您每次看到我们都会笑着打招呼。您可能觉得这只是很平常的小事，但我们真的会觉得很温暖。希望这张卡片也能让您开心一点，也希望您每天都被好好关心。",
          note: "我让语气更自然，不像正式贺卡。",
        },
      },
    },
    "zh-Hant": {
      junior: {
        clearer: {
          rewritten:
            "剛升上中學的時候，很多事情都會讓人不安。你可能會擔心功課跟不上，也可能不知道午飯時該和誰坐在一起。我以前也有過這種感覺。後來我發現，只要先找到一兩個願意一起聊天、一起做功課的人，心裏就會安定很多。你不用一下子做到很好，慢慢來，也是在往前走。",
          note: "我把原來的意思分得更清楚：先寫不安，再寫具體例子，最後保留你「慢慢來」的鼓勵。",
        },
        warmer: {
          rewritten:
            "剛上中學時，害怕自己跟不上、找不到朋友，真的很正常。你不是一個人在這樣想。我以前也會連午飯時坐哪裏都擔心。後來慢慢發現，只要有一兩個願意一起聊天、一起努力的人，學校生活就會安心很多。你可以慢慢適應，不用急着把所有事情都做好。",
          note: "我保留了你的經歷，但把語氣放軟了一點，讓對方更容易感到被理解。",
        },
        fit_recipient: {
          rewritten:
            "剛升上中學的這段時間，可能最難的不是某一件大事，而是每天都有很多小變化。比如功課節奏、午飯時間、認識新同學，都會讓人有點緊張。我以前也這樣。後來我發現，先找到一兩個可以一起聊天、一起做功課的人，會讓心裏踏實很多。你不用馬上適應，慢慢找到自己的節奏就好。",
          note: "我讓內容更貼近「剛升上中學的學弟妹」，加入了他們可能遇到的具體變化。",
        },
        keep_example: {
          rewritten:
            "我剛上中學的時候，也很怕自己跟不上，連午飯時間都不知道該跟誰坐。這個感覺我一直記得。後來我發現，先找到一兩個願意一起聊天、一起做功課的人，心裏會安穩很多。你不用一下子把所有事情都做好，先讓自己每天安心一點，就已經很好了。",
          note: "我保留了你最具體的午飯例子，沒有把它改成空泛鼓勵。",
        },
        keep_voice: {
          rewritten:
            "我剛上中學的時候，也很怕自己跟不上，連午飯時間都不知道該跟誰坐。後來我發現，只要先找到一兩個願意一起聊天、一起做功課的人，心裏真的會安穩很多。你不用一下子把所有事情都做得很好，慢慢來就可以。",
          note: "我只把句子調順了一點，盡量保留你原本自然、真誠的語氣。",
        },
        less_formal: {
          rewritten:
            "剛上中學的時候，緊張很正常。我以前也會怕自己跟不上，甚至午飯時不知道該跟誰坐。後來我慢慢發現，有一兩個可以一起聊天、一起做功課的人，心裏就會穩很多。你不用急，先慢慢適應就好。",
          note: "我刪掉了一些比較書面的表達，讓它更像自然說給對方聽的話。",
        },
      },
      stress: {
        clearer: {
          rewritten:
            "如果你最近真的很累，可以先不用假裝自己沒事。壓力大的時候，休息不是偷懶，而是在讓自己重新有力氣。我想告訴你，你不是不夠好，只是這段時間承擔了太多。先照顧好自己，再慢慢處理事情，也可以。",
          note: "我把原來的安慰改得更清楚：先承認辛苦，再說明休息的意義，最後給出支持。",
        },
        warmer: {
          rewritten:
            "如果你最近真的很累，我希望你先知道：你不用一直撐着。很多時候，能停下來喘口氣，已經是在照顧自己了。你不是不夠好，也不是太脆弱，只是這段時間真的辛苦。希望你今天能輕鬆一點，也記得有人在關心你。",
          note: "我把語氣改得更溫柔，減少了說教感。",
        },
        fit_recipient: {
          rewritten:
            "給最近壓力很大的你：如果這幾天覺得很累，不代表你做得不好。可能只是功課、事情和情緒一起壓過來了。你可以先讓自己休息一下，再一點點處理。你不用馬上變得很有精神，也不用一個人硬撐。",
          note: "我讓內容更像寫給正在承受壓力的同學，而不是一般鼓勵。",
        },
        keep_example: {
          rewritten:
            "如果你最近真的很累，也不用一直假裝自己沒事。我想保留這個意思，因為有時候承認自己辛苦了，已經很不容易。你不是不夠好，只是已經撐了很久。可以先休息一下，再慢慢往前走。",
          note: "我保留了你原來「不用假裝沒事」的核心句子。",
        },
        keep_voice: {
          rewritten:
            "如果你最近真的很累，也不用一直假裝自己沒事。很多時候，先讓自己休息一下，比逼自己繼續撐着更重要。你不是不夠好，你只是已經很辛苦了。慢一點也沒有關係。",
          note: "我主要整理句子節奏，盡量保留你的原意和語氣。",
        },
        less_formal: {
          rewritten:
            "最近很累的話，真的不用一直裝作沒事。人有時候就是需要停一停。你不是不夠好，只是這段時間太辛苦了。先休息一下，再慢慢來，也可以。",
          note: "我把句子改得更口語、更直接，但保留關心。",
        },
      },
      new: {
        clearer: {
          rewritten:
            "剛來到一個新學校，會不安是很正常的。你可能會擔心說錯話，也可能不知道該和誰一起走。我以前也有過這種感覺。後來我發現，不用一下子認識很多人，先和一兩個願意打招呼的人慢慢熟起來，就會輕鬆很多。",
          note: "我讓對象和情境更清楚，突出「新加入學校」的不安。",
        },
        warmer: {
          rewritten:
            "來到新學校的時候，心裏有點不安，真的很正常。你不用急着馬上適應，也不用逼自己一下子認識很多人。可以先從一個微笑、一次打招呼開始。慢慢地，你會找到讓自己安心的人和地方。",
          note: "我把語氣改得更溫暖，讓對方感到可以慢慢來。",
        },
        fit_recipient: {
          rewritten:
            "給剛來到學校的你：一開始覺得陌生、緊張，並不奇怪。新課室、新同學、新路線，都會讓人有點不確定。你可以先記住幾個熟悉的地方，再試着和一兩個同學打招呼。你不用馬上融入所有人，先讓自己安心下來就好。",
          note: "我加入了新同學會遇到的具體校園情境。",
        },
        keep_example: {
          rewritten:
            "剛來到一個新地方的時候，真的會有點不安。我以前也會擔心自己說錯話、找不到人一起走。這個感覺我想保留下來。後來我發現，先認識一兩個願意打招呼的人，很多事情都會慢慢變容易。",
          note: "我保留了你原來的具體擔心，沒有改成泛泛歡迎。",
        },
        keep_voice: {
          rewritten:
            "剛來到一個新地方的時候，真的會有點不安。我以前也會擔心自己說錯話、找不到人一起走。後來我發現，只要先認識一兩個願意打招呼的人，很多事情都會慢慢變容易。你不用急着馬上適應。",
          note: "我保留了你原本的表達，只讓結尾更完整。",
        },
        less_formal: {
          rewritten:
            "剛來新學校，不安很正常。我以前也會怕說錯話，或者找不到人一起走。後來慢慢發現，先認識一兩個會打招呼的人，就會好很多。你不用急，慢慢來就好。",
          note: "我把表達改得更自然、更像同學之間說的話。",
        },
      },
      elder: {
        clearer: {
          rewritten:
            "謝謝您每次見到我們都會笑着打招呼。對我們來說，這不只是一個簡單的問候。有時候，聽到您溫柔地問一句「今天過得怎麼樣」，就會讓人覺得被關心。也希望您每天都能感受到別人給您的溫暖。",
          note: "我把感謝對象和感謝原因寫得更清楚，讓心意更具體。",
        },
        warmer: {
          rewritten:
            "謝謝您總是願意溫柔地聽我們說話。您的笑容和問候，看起來只是很小的事，但常常會讓人心裏亮一點。希望這張小卡片也能把一點溫暖送給您，願您每天都能輕鬆、安心，也感受到有人惦記着您。",
          note: "我增強了溫暖感，但沒有把它改成過度正式的祝福。",
        },
        fit_recipient: {
          rewritten:
            "寫給一直關心我們的您：謝謝您每次見到我們都會笑着打招呼，也願意聽我們說學校裏的小事。對長者來說，被記得、被問候，也是一種很重要的關心。希望您每天都能感受到這份溫暖。",
          note: "我讓內容更貼近社區長者，而不是普通同學。",
        },
        keep_example: {
          rewritten:
            "謝謝您每次見到我們都會笑着打招呼。有時候，光是聽到您溫柔地問一句「今天過得怎麼樣」，就會讓人心裏暖暖的。我想保留這個小細節，因為它最能說明您的關心。也希望您每天都能被溫柔對待。",
          note: "我保留了你原來的問候例子，並讓它成為卡片重點。",
        },
        keep_voice: {
          rewritten:
            "謝謝您每次見到我們都會笑着打招呼。有時候，光是聽到您溫柔地問一句「今天過得怎麼樣」，就會讓人心裏暖暖的。也希望您每天都能感受到別人對您的關心。",
          note: "我盡量保留你的原話，只讓表達更順一些。",
        },
        less_formal: {
          rewritten:
            "謝謝您每次看到我們都會笑着打招呼。您可能覺得這只是很平常的小事，但我們真的會覺得很溫暖。希望這張卡片也能讓您開心一點，也希望您每天都被好好關心。",
          note: "我讓語氣更自然，不像正式賀卡。",
        },
      },
    },
    en: {
      junior: {
        clearer: {
          rewritten:
            "Starting secondary school can feel uncertain. You may worry about keeping up, or even about who to sit with at lunch. I felt that way too. Later, I found that having one or two people to talk and study with can make school feel much safer. You do not need to do everything perfectly at once. Taking it step by step is already progress.",
          note: "I made the message clearer by showing the worry, keeping your example, and ending with gentle encouragement.",
        },
        warmer: {
          rewritten:
            "It is normal to feel nervous when you first start secondary school. You are not the only one who has felt this way. I also worried about keeping up and about who to sit with at lunch. Over time, I found that one or two kind people can make a big difference. You can take your time. You do not have to figure everything out immediately.",
          note: "I made the tone warmer and more reassuring.",
        },
        fit_recipient: {
          rewritten:
            "For someone just starting secondary school, the hardest part may be all the small changes: new classes, lunch time, homework, and new classmates. I felt nervous about these things too. Finding one or two people to talk and study with helped me feel steadier. You do not need to adapt all at once. Slowly finding your rhythm is enough.",
          note: "I made the message more specific to a new secondary student.",
        },
        keep_example: {
          rewritten:
            "When I first started secondary school, I was afraid I would not keep up, and I did not even know who to sit with at lunch. I want to keep that example because it feels real. Later, I found that one or two people to talk and study with can make things feel much easier. You can take your time.",
          note: "I kept your concrete lunch-time example.",
        },
        keep_voice: {
          rewritten:
            "When I first started secondary school, I was also afraid I could not keep up, and I did not know who to sit with at lunch. Later, I found that if you can find one or two people to talk and study with, your heart feels much steadier. You do not have to do everything well right away. Take it slowly.",
          note: "I mainly smoothed the wording while keeping your voice.",
        },
        less_formal: {
          rewritten:
            "Starting secondary school can be scary. I also worried about keeping up and even about who to sit with at lunch. Later I found that one or two people to talk and study with can really help. You do not need to rush. Just take it slowly.",
          note: "I made it shorter and more natural.",
        },
      },
      stress: {
        clearer: {
          rewritten:
            "If you have been really tired lately, you do not have to pretend that everything is fine. Resting is not giving up; it can help you get your strength back. I want you to know that you are not failing. You may simply have been carrying too much. Take care of yourself first, then handle things step by step.",
          note: "I clarified the message: acknowledge tiredness, explain rest, and offer support.",
        },
        warmer: {
          rewritten:
            "If you have been very tired lately, I hope you know that you do not always have to hold everything together. Sometimes taking a breath is already a way of caring for yourself. You are not weak or not good enough. This period has just been hard. I hope today feels a little lighter for you.",
          note: "I made the message warmer and less like advice.",
        },
        fit_recipient: {
          rewritten:
            "For someone under a lot of pressure, it can feel as if every small task is heavy. If that is how you feel lately, it does not mean you are not doing well. It may mean you need a pause, some support, and a little more kindness toward yourself. You do not have to handle it all alone.",
          note: "I made it more specific to a stressed classmate.",
        },
        keep_example: {
          rewritten:
            "If you are really tired lately, you do not have to keep pretending you are okay. I want to keep that idea because it matters. You are not not good enough; you have just been trying for a long time. Rest first, then move forward slowly.",
          note: "I kept your key idea about not pretending.",
        },
        keep_voice: {
          rewritten:
            "If you are really tired lately, you do not have to keep pretending that nothing is wrong. Sometimes resting matters more than forcing yourself to continue. You are not not good enough. You have just been working very hard. It is okay to slow down.",
          note: "I kept your voice and only smoothed the rhythm.",
        },
        less_formal: {
          rewritten:
            "If you are tired, you do not have to act like you are fine all the time. Everyone needs a pause sometimes. You are not not good enough. This has just been a hard time. Rest a little, then take the next step.",
          note: "I made it more natural and less formal.",
        },
      },
      new: {
        clearer: {
          rewritten:
            "Coming to a new school can feel unsettling. You may worry about saying the wrong thing or not knowing who to walk with. I felt that way before too. Later, I found that you do not need to know many people at once. Getting familiar with one or two friendly people can already make things easier.",
          note: "I made the new-school situation clearer.",
        },
        warmer: {
          rewritten:
            "It is normal to feel unsure when you come to a new school. You do not have to adapt immediately or know everyone right away. You can start with one smile, one greeting, or one small conversation. Slowly, you will find people and places that make you feel safe.",
          note: "I made the message warmer and more patient.",
        },
        fit_recipient: {
          rewritten:
            "For someone new to the school, everything can feel unfamiliar: the classroom, classmates, routes, and routines. It is okay to feel nervous. You can first remember a few places and try greeting one or two classmates. You do not have to fit in immediately. Feeling a little safer is already a good start.",
          note: "I made it fit a new student more closely.",
        },
        keep_example: {
          rewritten:
            "When I arrived in a new place, I also felt uneasy. I worried about saying the wrong thing and not finding someone to walk with. I want to keep that example because it feels honest. Later, I found that one or two friendly greetings can slowly make things easier.",
          note: "I kept your concrete worries.",
        },
        keep_voice: {
          rewritten:
            "When I came to a new place, I really felt uneasy. I worried about saying the wrong thing and not finding someone to walk with. Later, I found that if you first get to know one or two people who say hello, many things slowly become easier.",
          note: "I kept your original voice.",
        },
        less_formal: {
          rewritten:
            "Being new can feel awkward. I also used to worry about saying the wrong thing or not knowing who to walk with. Later I found that one or two friendly people can already help a lot. You do not need to rush.",
          note: "I made the wording more natural.",
        },
      },
      elder: {
        clearer: {
          rewritten:
            "Thank you for smiling and greeting us whenever you see us. To us, it is more than a simple hello. Sometimes, when you gently ask how our day is going, it makes us feel cared for. I hope you can also feel that same warmth from others every day.",
          note: "I made the reason for gratitude clearer and more specific.",
        },
        warmer: {
          rewritten:
            "Thank you for always being willing to listen to us with kindness. Your smile and greetings may seem small, but they often make someone’s day feel lighter. I hope this little card can send some warmth back to you. May you feel relaxed, cared for, and remembered each day.",
          note: "I made the tone warmer without making it too formal.",
        },
        fit_recipient: {
          rewritten:
            "To someone who has always cared about us: thank you for greeting us kindly and listening to small stories about school. Being remembered and greeted can mean a lot. I hope you can feel this care too, and that each day brings you a little warmth.",
          note: "I made it fit a community elder rather than a classmate.",
        },
        keep_example: {
          rewritten:
            "Thank you for smiling whenever you see us. Sometimes just hearing you ask, 'How was your day?' can make someone feel warm inside. I want to keep that small detail because it shows your kindness clearly. I hope you are treated with the same gentleness every day.",
          note: "I kept your greeting example and made it the center of the card.",
        },
        keep_voice: {
          rewritten:
            "Thank you for smiling whenever you see us. Sometimes, just hearing you gently ask how our day is going makes people feel warm inside. I also hope you can feel cared for by others every day.",
          note: "I kept your meaning and only made it smoother.",
        },
        less_formal: {
          rewritten:
            "Thank you for always smiling and saying hello to us. You may think it is a small thing, but it really makes people feel warm. I hope this card can make you happy too, and I hope you feel cared for every day.",
          note: "I made it more natural and less formal.",
        },
      },
    },
  };


const signals = getW3RewriteSignals(promptText, selectedTags);

const selected =
  bank[locale][recipient][intent] ?? bank[locale][recipient].clearer;

const compositeRewritten = polishW3CompositeRewrite(
  selected.rewritten,
  locale,
  recipient,
  intent,
  signals
);

const compositeNote = buildW3CompositeNote(
  locale,
  selected.note,
  intent,
  signals,
  recipient
);

return {
  mode: "rewrite",
  rewritten: compositeRewritten,
  note: compositeNote,
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
  const [w1HelpfulReasonTags, setW1HelpfulReasonTags] = useState<string[]>([]);
  const [w1NarrowReasonTags, setW1NarrowReasonTags] = useState<string[]>([]);
  const [w1Rules, setW1Rules] = useState({
    explainReason: false,
    teacherReview: false,
    tryNewThings: false,
    onlyPopular: false,
    sayWhatDataUsed: false,
  });
  const [w1Good, setW1Good] = useState("");
  const [w1Warn, setW1Warn] = useState("");

  // World 2
  const [w2Step, setW2Step] = useState(0);
  const [w2RoleChoice, setW2RoleChoice] = useState("");
  const [w2DraftChoice, setW2DraftChoice] = useState<"A" | "B" | "">("");
  const [w2DraftReasonTags, setW2DraftReasonTags] = useState<string[]>([]);
  const [w2FinalDecisionBy, setW2FinalDecisionBy] = useState<"student_group" | "teacher" | "ai" | "">("");
  const [w2ClaimStatus, setW2ClaimStatus] = useState<Record<string, ClaimStatus | "">>({});
  const [w2FinalReason, setW2FinalReason] = useState("");
  const [w2SourceCheckViewed, setW2SourceCheckViewed] = useState(false);
  const [w2SourceCheckChoice, setW2SourceCheckChoice] = useState<
  "trusted_source" | "ai_only" | "ask_teacher" | ""
>("");

  // World 3
// World 3
const [w3Step, setW3Step] = useState(0);
const [w3Recipient, setW3Recipient] = useState<W3Recipient | "">("");
const [w3Draft, setW3Draft] = useState("");
const [w3Prompt, setW3Prompt] = useState("");
const [w3LastPromptText, setW3LastPromptText] = useState("");
const [w3LastVisibleUserMessage, setW3LastVisibleUserMessage] = useState("");
const [w3LastAiReply, setW3LastAiReply] = useState("");
const [w3PromptTags, setW3PromptTags] = useState<string[]>([]);
const [w3Chat, setW3Chat] = useState<ChatMessage[]>([]);
const [w3FinalText, setW3FinalText] = useState("");
const [w3Checklist, setW3Checklist] = useState<string[]>([]);
const [w3SuggestionUseStrategy, setW3SuggestionUseStrategy] = useState("");
const [w3IdeaSupportTags, setW3IdeaSupportTags] = useState<string[]>([]);
const [w3PresentationFormat, setW3PresentationFormat] = useState("");
const [w3PresentationReasonTags, setW3PresentationReasonTags] = useState<string[]>([]);

// World 3 Step 5: AI collaboration review
const [w3HelpfulTags, setW3HelpfulTags] = useState<string[]>([]);
const [w3LimitationTags, setW3LimitationTags] = useState<string[]>([]);
const [w3UsabilityFeedback, setW3UsabilityFeedback] = useState("");
  // World 4
  const [w4Step, setW4Step] = useState(0);
  const [w4AiTasks, setW4AiTasks] = useState<string[]>([]);
  const [w4Role, setW4Role] = useState<"data" | "summary" | "draft" | "no_ai_support" | "">("");
  const [w4UseChoice, setW4UseChoice] = useState("");
  const [w4NoAiReason, setW4NoAiReason] = useState("");
  const [w4HumanStillDo, setW4HumanStillDo] = useState<string[]>([]);
  const [w4Rules, setW4Rules] = useState<string[]>([]);
  const [w4Reminder, setW4Reminder] = useState("");

  // World 5
  const [w5Step, setW5Step] = useState(0);
  const [w5Problem, setW5Problem] = useState<"crushed" | "">("crushed");
const [w5FailureCueIds, setW5FailureCueIds] = useState<string[]>([]);
  const [w5Cause, setW5Cause] = useState("");
  const [w5CauseIds, setW5CauseIds] = useState<string[]>([]);
  const [w5Training, setW5Training] = useState<string[]>([]);
  const [w5Reminders, setW5Reminders] = useState<string[]>([]);
  const [w5AffectedStakeholders, setW5AffectedStakeholders] = useState<string[]>([]);
  const [w5SystemImprovementChoice, setW5SystemImprovementChoice] = useState("");
  const [w5AiResourceUseChoice, setW5AiResourceUseChoice] = useState("");
  const [w5ImpactCauseLinkChoice, setW5ImpactCauseLinkChoice] = useState("");
  const [w5Card, setW5Card] = useState({
  purpose: "",
  intendedUsers: "",
  trainingData: "",
  limits: "",
  humanCheck: "",
  reminder: "",
  improve: "",
});
const [w5CardDraftAutoFilled, setW5CardDraftAutoFilled] = useState(false);
const [w5CardEditedFields, setW5CardEditedFields] = useState<string[]>([]);

  // World 3 v3 alignment modules: C2/C4/C5
const [w3ComparedFormatIds, setW3ComparedFormatIds] = useState<string[]>([]);
const [w3SelectedDesignElementIds, setW3SelectedDesignElementIds] = useState<string[]>([]);
const [w3RejectedElementIds, setW3RejectedElementIds] = useState<string[]>([]);
const [w3SelectedAssetIds, setW3SelectedAssetIds] = useState<string[]>([]);
const [w3DisclosureChoiceId, setW3DisclosureChoiceId] = useState("");
const [w3AttributionChoiceId, setW3AttributionChoiceId] = useState("");
const [w3KeptOwnSentence, setW3KeptOwnSentence] = useState(false);
const [w3MechanismSort, setW3MechanismSort] = useState<
  Record<string, "accurate" | "inaccurate" | "">
>({});
function setW3MechanismCard(
  statementId: string,
  value: "accurate" | "inaccurate"
) {
  setW3MechanismSort((prev) => ({
    ...prev,
    [statementId]: value,
  }));
}
function setW3DesignElementDecision(
  elementId: string,
  value: "use" | "reject"
) {
  setW3DesignElementAllocation((prev) => ({
    ...prev,
    [elementId]: value,
  }));

  setW3SelectedDesignElementIds((prev) => {
    if (value === "use") {
      return prev.includes(elementId) ? prev : [...prev, elementId];
    }
    return prev.filter((id) => id !== elementId);
  });

  setW3RejectedElementIds((prev) => {
    if (value === "reject") {
      return prev.includes(elementId) ? prev : [...prev, elementId];
    }
    return prev.filter((id) => id !== elementId);
  });
}

// World 4 v3 alignment module: M4 workflow delegation
const [w4WorkflowAllocation, setW4WorkflowAllocation] = useState<
  Record<string, "ai_auto" | "ai_assist_human_check" | "human_only">
>({});

// World 5 v3 alignment modules: D2/E4/D5
const [w5SystemComparisonChoiceByCase, setW5SystemComparisonChoiceByCase] =
  useState<
    Record<
      string,
      "rulebot" | "databot" | "both_need_human_check" | "speed_only" | ""
    >
  >({});
const [w5SystemComparisonReasonTags, setW5SystemComparisonReasonTags] =
  useState<string[]>([]);
const [w5UnfairOutcomeIds, setW5UnfairOutcomeIds] = useState<string[]>([]);
const [w5BiasCauseLinkIds, setW5BiasCauseLinkIds] = useState<string[]>([]);
const [w5BiasMitigationIds, setW5BiasMitigationIds] = useState<string[]>([]);

// v4.2 interaction-layer states: drag/drop and resource-use triage.
const [w3DesignElementAllocation, setW3DesignElementAllocation] = useState<
  Record<string, "use" | "reject" | "">
>({});
const [w3AssetAllocation, setW3AssetAllocation] = useState<
  Record<string, "use" | "credit" | "avoid" | "">
>({});
const [w5ResourceTriageAllocation, setW5ResourceTriageAllocation] = useState<
  Record<string, "worth_using_ai" | "simple_method_first" | "ai_assist_human_check" | "">
>({});
const [w5ResourceReasonTags, setW5ResourceReasonTags] = useState<string[]>([]);

  const w1HelpfulReasonOptions = useMemo(() => [
    { id: "uses_my_learning_record", label: locale === "en" ? "It uses my learning records" : locale === "zh-Hant" ? "它會參考我的學習記錄" : "它会参考我的学习记录" },
    { id: "matches_recent_learning", label: locale === "en" ? "It matches what I am learning recently" : locale === "zh-Hant" ? "它比較貼近我最近在學的內容" : "它比较贴近我最近在学的内容" },
    { id: "shows_common_student_interest", label: locale === "en" ? "It shows what many students are learning" : locale === "zh-Hant" ? "它能看到很多同學都在學什麼" : "它能看到很多同学都在学什么" },
    { id: "helps_try_new_topics", label: locale === "en" ? "It helps me try new topics" : locale === "zh-Hant" ? "它能幫我嘗試新的方向" : "它能帮我尝试新的方向" },
  ] as const, [locale]);

  const w1NarrowReasonOptions = useMemo(() => [
    { id: "repeats_similar_content", label: locale === "en" ? "It may repeat similar content" : locale === "zh-Hant" ? "它可能一直重複類似內容" : "它可能一直重复类似内容" },
    { id: "overuses_past_record", label: locale === "en" ? "It may rely too much on my past records" : locale === "zh-Hant" ? "它可能太依賴過去記錄" : "它可能太依赖过去记录" },
    { id: "follows_the_crowd", label: locale === "en" ? "It may make everyone see similar things" : locale === "zh-Hant" ? "它可能讓大家都看差不多的東西" : "它可能让大家都看差不多的东西" },
    { id: "reduces_exploration", label: locale === "en" ? "It may reduce chances to explore new content" : locale === "zh-Hant" ? "它可能減少探索新內容的機會" : "它可能减少探索新内容的机会" },
  ] as const, [locale]);

  const w2DraftReasonOptions = useMemo(() => [
    { id: "more_specific", label: locale === "en" ? "More specific" : locale === "zh-Hant" ? "內容更具體" : "内容更具体" },
    { id: "clearer_for_campus_card", label: locale === "en" ? "Clearer for a campus information card" : locale === "zh-Hant" ? "更適合做校園資訊卡" : "更适合做校园信息卡" },
    { id: "needs_further_checking", label: locale === "en" ? "Still needs further checking" : locale === "zh-Hant" ? "仍然需要進一步核查" : "仍然需要进一步核查" },
    { id: "too_general", label: locale === "en" ? "Too general" : locale === "zh-Hant" ? "太籠統" : "太笼统" },
    { id: "may_be_misleading", label: locale === "en" ? "May mislead readers" : locale === "zh-Hant" ? "可能會誤導讀者" : "可能会误导读者" },
  ] as const, [locale]);

  const w2FinalDecisionOptions = useMemo(() => [
    { id: "student_group", label: locale === "en" ? "The student group" : locale === "zh-Hant" ? "學生小組" : "学生小组" },
    { id: "teacher", label: locale === "en" ? "The teacher" : locale === "zh-Hant" ? "老師" : "老师" },
    { id: "ai", label: "AI" },
  ] as const, [locale]);

  const w3PromptTagOptions = useMemo(() => [
    { id: "keep_voice", label: locale === "en" ? "Keep my tone" : locale === "zh-Hant" ? "保留我的語氣" : "保留我的语气" },
    { id: "keep_example", label: locale === "en" ? "Do not remove my example" : locale === "zh-Hant" ? "不要刪掉我的例子" : "不要删掉我的例子" },
    { id: "warmer", label: locale === "en" ? "Make it warmer" : locale === "zh-Hant" ? "寫得更溫暖一點" : "写得更温暖一点" },
    { id: "fit_recipient", label: locale === "en" ? "Make it more suitable for this person" : locale === "zh-Hant" ? "更像寫給這個人" : "更像写给这个人" },
    { id: "less_formal", label: locale === "en" ? "Do not make it too formal" : locale === "zh-Hant" ? "不要太正式" : "不要太正式" },
  ] as const, [locale]);

  const w3MultimodalOptions = useMemo(
  () => [
    {
      id: "text_card",
      title:
        locale === "en"
          ? "Text card"
          : locale === "zh-Hant"
          ? "文字心意卡"
          : "文字心意卡",
      note:
        locale === "en"
          ? "Keeps the message simple and personal."
          : locale === "zh-Hant"
          ? "保留文字和個人語氣。"
          : "保留文字和个人语气。",
    },
    {
      id: "poster",
      title:
        locale === "en"
          ? "Poster"
          : locale === "zh-Hant"
          ? "圖文海報"
          : "图文海报",
      note:
        locale === "en"
          ? "Combines words with a visual design."
          : locale === "zh-Hant"
          ? "把文字和畫面組合起來。"
          : "把文字和画面组合起来。",
    },
    {
      id: "comic_sticker",
      title:
        locale === "en"
          ? "Mini comic / sticker"
          : locale === "zh-Hant"
          ? "小漫畫／貼紙卡"
          : "小漫画／贴纸卡",
      note:
        locale === "en"
          ? "Turns the message into a small visual story."
          : locale === "zh-Hant"
          ? "把心意變成小故事或視覺符號。"
          : "把心意变成小故事或视觉符号。",
    },
  ],
  [locale]
);

const w3DesignElementOptions = useMemo(
  () => [
    {
      id: "own_sentence",
      label:
        locale === "en"
          ? "My original sentence"
          : locale === "zh-Hant"
          ? "我的原句"
          : "我的原句",
    },
    {
      id: "ai_warm_title",
      label:
        locale === "en"
          ? "AI warm title"
          : locale === "zh-Hant"
          ? "AI 生成的溫暖標題"
          : "AI 生成的温暖标题",
    },
    {
      id: "ai_layout",
      label: locale === "en" ? "AI layout" : "AI 排版",
    },
    {
      id: "ai_image",
      label:
        locale === "en"
          ? "AI-generated image"
          : locale === "zh-Hant"
          ? "AI 生成插圖"
          : "AI 生成插图",
    },
    {
      id: "recipient_icon",
      label:
        locale === "en"
          ? "Recipient icon"
          : locale === "zh-Hant"
          ? "對象小圖示"
          : "对象小图标",
    },
  ],
  [locale]
);

const w3FormatReasonOptions = useMemo(
  () => [
    {
      id: "fits_recipient",
      label:
        locale === "en"
          ? "Fits the recipient"
          : locale === "zh-Hant"
          ? "更適合對象"
          : "更适合对象",
    },
    {
      id: "shows_care_better",
      label:
        locale === "en"
          ? "Shows care better"
          : locale === "zh-Hant"
          ? "更能表達關心"
          : "更能表达关心",
    },
    {
      id: "clearer_message",
      label:
        locale === "en"
          ? "Makes the message clearer"
          : locale === "zh-Hant"
          ? "信息更清楚"
          : "信息更清楚",
    },
    {
      id: "helps_visualise_idea",
      label:
        locale === "en"
          ? "Helps visualise the idea"
          : locale === "zh-Hant"
          ? "幫助把想法視覺化"
          : "帮助把想法视觉化",
    },
    {
      id: "looks_nicer_only",
      label:
        locale === "en"
          ? "Only because it looks nicer"
          : locale === "zh-Hant"
          ? "只是比較好看"
          : "只是比较好看",
    },
  ],
  [locale]
);

const w3AssetOptions = useMemo(() => {
  const items: Array<{ id: string; label: string }> = [
    {
      id: "own_sentence",
      label:
        locale === "en"
          ? "My own sentence"
          : locale === "zh-Hant"
          ? "我的原句"
          : "我的原句",
    },
  ];

  const usesImage = w3SelectedDesignElementIds.includes("ai_image");
  const usesIcon = w3SelectedDesignElementIds.includes("recipient_icon");
  const isPoster = w3PresentationFormat === "poster";
  const isSticker = w3PresentationFormat === "comic_sticker";

  if (usesImage || isPoster || isSticker) {
    items.push({
      id: "ai_background_image",
      label:
        locale === "en"
          ? "AI-generated background picture"
          : locale === "zh-Hant"
          ? "AI 生成背景圖"
          : "AI 生成背景图",
    });
  }

  if (usesIcon || isPoster || isSticker) {
    items.push({
      id: "free_source_icon",
      label:
        locale === "en"
          ? "Free-to-use icon with source noted"
          : locale === "zh-Hant"
          ? "可免費使用並註明來源的圖標"
          : "可免费使用并注明来源的图标",
    });
  }

  if (usesImage || isPoster || isSticker) {
    const recipientImageLabel =
      w3Recipient === "elder"
        ? locale === "en"
          ? "Realistic AI image of an elder"
          : locale === "zh-Hant"
          ? "像真人的 AI 長者照片"
          : "像真人的 AI 长者照片"
        : w3Recipient === "junior"
        ? locale === "en"
          ? "AI image of a new secondary student"
          : locale === "zh-Hant"
          ? "AI 生成的中學生人物圖"
          : "AI 生成的中学生人物图"
        : w3Recipient === "stress"
        ? locale === "en"
          ? "AI image of a tired student"
          : locale === "zh-Hant"
          ? "AI 生成的壓力同學人物圖"
          : "AI 生成的压力同学人物图"
        : locale === "en"
        ? "AI image of a new student"
        : locale === "zh-Hant"
        ? "AI 生成的新同學人物圖"
        : "AI 生成的新同学人物图";

    items.push({
      id: "ai_person_image",
      label: recipientImageLabel,
    });
  }

  // 这两个是干扰项。只要涉及图片/视觉素材，才出现。
  if (usesImage || isPoster || isSticker) {
    items.push(
      {
        id: "web_cartoon_unknown_source",
        label:
          locale === "en"
            ? "Online cartoon image with unknown source"
            : locale === "zh-Hant"
            ? "網上找到但來源不明的卡通圖"
            : "网上找到但来源不明的卡通图",
      },
      {
        id: "classmate_photo_without_permission",
        label:
          locale === "en"
            ? "Classmate photo without permission"
            : locale === "zh-Hant"
            ? "未經同意的同學照片"
            : "未经同意的同学照片",
      }
    );
  }

  return items;
}, [locale, w3PresentationFormat, w3Recipient, w3SelectedDesignElementIds]);

const w3MechanismStatements = useMemo(
  () => [
    {
      id: "prompt_pattern_generation",
      text:
        locale === "en"
          ? "AI writes based on my prompt and patterns it has learned."
          : locale === "zh-Hant"
          ? "AI 會根據我的提示和學到的語言模式生成文字。"
          : "AI 会根据我的提示和学到的语言模式生成文字。",
      answer: "accurate",
    },
    {
      id: "human_like_not_understanding",
      text:
        locale === "en"
          ? "AI text can sound human-like, but it does not really understand feelings."
          : locale === "zh-Hant"
          ? "AI 文字可以像人寫的，但不是真的理解感受。"
          : "AI 文字可以像人写的，但不是真的理解感受。",
      answer: "accurate",
    },
    {
      id: "student_judgement_needed",
      text:
        locale === "en"
          ? "I still need to judge whether the AI version is suitable for the person receiving the card."
          : locale === "zh-Hant"
          ? "我仍然需要判斷 AI 修改版是否適合收到卡片的人。"
          : "我仍然需要判断 AI 修改版是否适合收到卡片的人。",
      answer: "accurate",
    },
    {
      id: "warm_text_means_care",
      text:
        locale === "en"
          ? "If AI writes warmly, it means AI truly cares about the person."
          : locale === "zh-Hant"
          ? "如果 AI 寫得很溫暖，就代表 AI 真的關心對方。"
          : "如果 AI 写得很温暖，就代表 AI 真的关心对方。",
      answer: "inaccurate",
    },
    {
      id: "ai_knows_my_intent_better",
      text:
        locale === "en"
          ? "AI knows better than me what I want to say, so I can copy it directly."
          : locale === "zh-Hant"
          ? "AI 比我更知道我想說甚麼，所以我可以直接照搬。"
          : "AI 比我更知道我想说什么，所以我可以直接照搬。",
      answer: "inaccurate",
    },
  ],
  [locale]
);

  const w3SuggestionUseOptions = useMemo(() => [
    { id: "use_most", label: locale === "en" ? "I used most of it directly" : locale === "zh-Hant" ? "我大部分直接用了" : "我大部分直接用了" },
    { id: "use_part_and_revise", label: locale === "en" ? "I used part of it and revised it myself" : locale === "zh-Hant" ? "我用了其中一部分，並自己改過" : "我用了其中一部分，并自己改过" },
    { id: "use_idea_not_wording", label: locale === "en" ? "I used the idea, not the exact wording" : locale === "zh-Hant" ? "我只參考了意思，沒有照搬句子" : "我只参考了意思，没有照搬句子" },
    { id: "reject_and_write_myself", label: locale === "en" ? "I decided not to use this AI suggestion" : locale === "zh-Hant" ? "我決定不用這次 AI 建議，自己重寫" : "我决定不用这次 AI 建议，自己重写" },
  ] as const, [locale]);

  const w3IdeaSupportOptions = useMemo(() => [
    { id: "gave_new_expression_way", label: locale === "en" ? "It gave me a new way to express care" : locale === "zh-Hant" ? "它給了我一種新的表達方式" : "它给了我一种新的表达方式" },
    { id: "helped_think_from_recipient_view", label: locale === "en" ? "It helped me think from the recipient’s view" : locale === "zh-Hant" ? "它讓我想到對方可能需要什麼" : "它让我想到对方可能需要什么" },
    { id: "replaced_my_idea", label: locale === "en" ? "It replaced my own idea" : locale === "zh-Hant" ? "它基本替代了我的想法" : "它基本替代了我的想法" },
    { id: "only_made_sentence_longer", label: locale === "en" ? "It only made the sentence longer" : locale === "zh-Hant" ? "它只是把句子變長" : "它只是把句子变长" },
  ] as const, [locale]);

  const w3PresentationFormatOptions = useMemo(() => [
    { id: "short_message", label: locale === "en" ? "Short message" : locale === "zh-Hant" ? "短留言" : "短留言" },
    { id: "message_with_icon", label: locale === "en" ? "Message with an icon or small drawing" : locale === "zh-Hant" ? "配一個圖標或小插圖" : "配一个图标或小插图" },
    { id: "poster_style_card", label: locale === "en" ? "Poster-style card" : locale === "zh-Hant" ? "海報式卡片" : "海报式卡片" },
    { id: "spoken_message_script", label: locale === "en" ? "Spoken message script" : locale === "zh-Hant" ? "口頭祝福稿" : "口头祝福稿" },
  ] as const, [locale]);

  const w3PresentationReasonOptions = [
  {
    id: "fits_recipient",
    label:
      locale === "en"
        ? "It fits the recipient"
        : locale === "zh-Hant"
        ? "更適合這個對象"
        : "更适合这个对象",
  },
  {
    id: "clearer_expression",
    label:
      locale === "en"
        ? "It makes the message clearer"
        : locale === "zh-Hant"
        ? "表達更清楚"
        : "表达更清楚",
  },
  {
    id: "shows_care_better",
    label:
      locale === "en"
        ? "It shows care better"
        : locale === "zh-Hant"
        ? "更能表達關心"
        : "更能表达关心",
  },
  {
    id: "looks_nicer_only",
    label:
      locale === "en"
        ? "It only looks nicer"
        : locale === "zh-Hant"
        ? "只是看起來更好看"
        : "只是看起来更好看",
  },
] as const;

  const w4TaskOptions = useMemo(() => [
    { id: "calculate_percentages", label: locale === "en" ? "Calculate numbers and percentages" : locale === "zh-Hant" ? "計算人數和比例" : "计算人数和比例" },
    { id: "organize_key_points", label: locale === "en" ? "Organize three key points" : locale === "zh-Hant" ? "整理 3 條重點" : "整理 3 条重点" },
    { id: "explain_common_pattern", label: locale === "en" ? "Explain the most common travel pattern" : locale === "zh-Hant" ? "解釋最常見的出行方式" : "解释最常见的出行方式" },
    { id: "decide_final_suggestions", label: locale === "en" ? "Decide the final suggestions for the school" : locale === "zh-Hant" ? "決定最後給學校什麼建議" : "决定最后给学校什么建议" },
    { id: "check_fairness_feasibility", label: locale === "en" ? "Check whether suggestions are fair and feasible" : locale === "zh-Hant" ? "檢查建議是否公平、可執行" : "检查建议是否公平、可执行" },
    { id: "disclose_ai_use", label: locale === "en" ? "Explain where AI was used" : locale === "zh-Hant" ? "說明哪些地方用了 AI" : "说明哪些地方用了 AI" },
  ] as const, [locale]);

  const w4HumanResponsibilityOptions = useMemo(() => [
    { id: "explain_results", label: locale === "en" ? "Explain why the results look like this" : locale === "zh-Hant" ? "解釋為甚麼會出現這樣的結果" : "解释为什么会出现这样的结果" },
    { id: "decide_final_suggestions", label: locale === "en" ? "Decide the final suggestions for the school" : locale === "zh-Hant" ? "決定最後給學校甚麼建議" : "决定最后写给学校什么建议" },
    { id: "check_fairness_feasibility", label: locale === "en" ? "Check whether suggestions are fair, reasonable and feasible" : locale === "zh-Hant" ? "檢查建議是否公平、合理、可執行" : "检查建议是不是公平、合理、可执行" },
    { id: "explain_ai_use", label: locale === "en" ? "Explain which part used AI" : locale === "zh-Hant" ? "在簡報裡說明用了 AI 的哪一部分" : "在简报里说明用了 AI 的哪一部分" },
  ] as const, [locale]);

  const w4RuleOptions = useMemo(() => [
    { id: "disclose_ai_use", label: locale === "en" ? "Explain where AI was used" : locale === "zh-Hant" ? "用了 AI 的地方要說明" : "用了 AI 的地方要说明" },
    { id: "do_not_copy_ai_directly", label: locale === "en" ? "Do not submit AI text directly" : locale === "zh-Hant" ? "AI 給的內容不能直接整段交上去" : "AI 给的内容不能直接整段交上去" },
    { id: "human_final_decision", label: locale === "en" ? "Humans make the final decision" : locale === "zh-Hant" ? "最後建議必須由人來決定" : "最后建议必须由人来决定" },
    { id: "check_ai_data", label: locale === "en" ? "Check AI-organized data once" : locale === "zh-Hant" ? "AI 整理的數據也要再檢查一次" : "AI 整理的数据也要再检查一次" },
  ] as const, [locale]);

  const w4WorkflowColumns = useMemo(
  () =>
    [
      {
        id: "ai_auto",
        label:
          locale === "en"
            ? "AI can automate"
            : locale === "zh-Hant"
            ? "AI 可以自動完成"
            : "AI 可以自动完成",
      },
      {
        id: "ai_assist_human_check",
        label:
          locale === "en"
            ? "AI assists, humans check"
            : locale === "zh-Hant"
            ? "AI 輔助，人來檢查"
            : "AI 辅助，人来检查",
      },
      {
        id: "human_only",
        label:
          locale === "en"
            ? "Humans must do"
            : locale === "zh-Hant"
            ? "必須由人完成"
            : "必须由人完成",
      },
    ] as const,
  [locale]
);

  const w5ReminderOptions = [
  {
    id: "ai_may_be_wrong",
    label:
      locale === "en"
        ? "It may still make mistakes on special items"
        : locale === "zh-Hant"
        ? "它在某些特殊物品上還是可能判斷錯"
        : "它在某些特殊物品上还是可能判断错",
    note:
      locale === "en"
        ? "AI suggestions should not be treated as always correct."
        : locale === "zh-Hant"
        ? "AI 的建議不能被當成一定正確。"
        : "AI 的建议不能被当成一定正确。",
  },
  {
    id: "check_uncertain_cases",
    label:
      locale === "en"
        ? "Check again yourself; do not follow it blindly"
        : locale === "zh-Hant"
        ? "使用時要再自己看一眼，不要完全照著做"
        : "使用时要再自己看一眼，不要完全照着做",
    note:
      locale === "en"
        ? "This keeps human checking in the loop."
        : locale === "zh-Hant"
        ? "這能保留人的檢查和判斷。"
        : "这能保留人的检查和判断。",
  },
  {
    id: "ask_human_when_unsure",
    label:
      locale === "en"
        ? "Ask a teacher or staff member when unsure"
        : locale === "zh-Hant"
        ? "不確定時問老師或工作人員"
        : "不确定时问老师或工作人员",
    note:
      locale === "en"
        ? "Some decisions still need human support."
        : locale === "zh-Hant"
        ? "有些判斷仍然需要人的協助。"
        : "有些判断仍然需要人的协助。",
  },
  {
    id: "do_not_treat_ai_as_final_authority",
    label:
      locale === "en"
        ? "Do not treat AI as the final authority"
        : locale === "zh-Hant"
        ? "不要把 AI 當成最後權威"
        : "不要把 AI 当成最后权威",
    note:
      locale === "en"
        ? "AI can support decisions, but it should not replace responsibility."
        : locale === "zh-Hant"
        ? "AI 可以協助判斷，但不能取代責任。"
        : "AI 可以协助判断，但不能取代责任。",
  },
  {
    id: "use_ai_when_helpful_because_ai_uses_computing_resources",
    label:
      locale === "en"
        ? "Use AI only when it is helpful"
        : locale === "zh-Hant"
        ? "有用時才用 AI"
        : "有用时才用 AI",
    note:
      locale === "en"
        ? "AI systems also use computing resources and energy."
        : locale === "zh-Hant"
        ? "AI 系統運行也會使用計算資源和能源。"
        : "AI 系统运行也会使用计算资源和能源。",
  },
] as const;

  const w5AffectedOptions = useMemo(
  () =>
    [
      {
        id: "cleaning_staff",
        label:
          locale === "en"
            ? "Cleaning or recycling staff who must fix wrong sorting"
            : locale === "zh-Hant"
            ? "需要重新處理錯誤分類的清潔或回收人員"
            : "需要重新处理错误分类的清洁或回收人员",
      },
      {
        id: "younger_students",
        label:
          locale === "en"
            ? "Younger students who may follow the wrong AI suggestion"
            : locale === "zh-Hant"
            ? "可能直接照着 AI 提示做的低年級同學"
            : "可能直接照着 AI 提示做的低年级同学",
      },
      {
        id: "students_with_similar_items",
        label:
          locale === "en"
            ? "Students throwing away crushed or changed-shape recyclables"
            : locale === "zh-Hant"
            ? "投放壓扁或形狀改變可回收物的同學"
            : "投放压扁或形状改变可回收物的同学",
      },
      {
        id: "canteen_users",
        label:
          locale === "en"
            ? "Students using the recycling station during busy times"
            : locale === "zh-Hant"
            ? "高峰時段使用回收站的同學"
            : "高峰时段使用回收站的同学",
      },
      {
        id: "no_one",
        label:
          locale === "en"
            ? "No one would be affected"
            : locale === "zh-Hant"
            ? "沒有人會受影響"
            : "没有人会受影响",
      },
    ] as const,
  [locale]
);
const w5FailureCueOptions = useMemo(
  () =>
    [
      {
        id: "crushed_shape",
        label:
          locale === "en"
            ? "The paper box is crushed and no longer looks like the usual example."
            : locale === "zh-Hant"
            ? "紙盒被壓扁了，看起來不像平常完整的紙盒。"
            : "纸盒被压扁了，看起来不像平常完整的纸盒。",
      },
      {
        id: "paper_material_still_recyclable",
        label:
          locale === "en"
            ? "It is still made of paper, so the material matters."
            : locale === "zh-Hant"
            ? "它仍然是紙做的，所以材質很重要。"
            : "它仍然是纸做的，所以材质很重要。",
      },
      {
        id: "confidence_not_final_answer",
        label:
          locale === "en"
            ? "The AI says 82% confidence, but confidence is not the same as correctness."
            : locale === "zh-Hant"
            ? "AI 顯示 82% 可信度，但可信度不等於一定正確。"
            : "AI 显示 82% 可信度，但可信度不等于一定正确。",
      },
      {
        id: "needs_human_check",
        label:
          locale === "en"
            ? "This uncertain case should be checked by a person before being treated as final."
            : locale === "zh-Hant"
            ? "這種不確定情況應該由人再檢查，不能直接當成最終答案。"
            : "这种不确定情况应该由人再检查，不能直接当成最终答案。",
      },
      {
        id: "page_colour_problem",
        label:
          locale === "en"
            ? "The main problem is that the page colour is not attractive."
            : locale === "zh-Hant"
            ? "主要問題是頁面顏色不夠好看。"
            : "主要问题是页面颜色不够好看。",
      },
      {
        id: "speed_problem",
        label:
          locale === "en"
            ? "The main problem is that the system answered too slowly."
            : locale === "zh-Hant"
            ? "主要問題是系統回答太慢。"
            : "主要问题是系统回答太慢。",
      },
    ] as const,
  [locale]
);
const w5CauseOptions = useMemo(
  () =>
    [
      {
        id: "data",
        label:
          locale === "en"
            ? "It has seen too few crushed boxes."
            : locale === "zh-Hant"
            ? "它看過的壓扁紙盒太少。"
            : "它看过的压扁纸盒太少。",
      },
      {
        id: "similar",
        label:
          locale === "en"
            ? "The crushed shape looks like waste."
            : locale === "zh-Hant"
            ? "壓扁後看起來像垃圾。"
            : "压扁后看起来像垃圾。",
      },
      {
        id: "rule",
        label:
          locale === "en"
            ? "It may only know complete boxes."
            : locale === "zh-Hant"
            ? "它可能只認得完整紙盒。"
            : "它可能只认得完整纸盒。",
      },
      {
        id: "speed",
        label:
          locale === "en"
            ? "It mainly needs to answer faster."
            : locale === "zh-Hant"
            ? "它主要需要回答更快。"
            : "它主要需要回答更快。",
      },
    ] as const,
  [locale]
);
const w5SystemImprovementOptions = useMemo(
  () =>
    [
      {
        id: "handle_special_cases",
        label:
          locale === "en"
            ? "Handle changed-shape items better."
            : locale === "zh-Hant"
            ? "更好處理形狀改變的物品。"
            : "更好处理形状改变的物品。",
      },
      {
        id: "answer_faster",
        label:
          locale === "en"
            ? "Make sorting results appear faster."
            : locale === "zh-Hant"
            ? "讓分類結果出現得更快。"
            : "让分类结果出现得更快。",
      },
      {
        id: "look_nicer",
        label:
          locale === "en"
            ? "Make the result page look nicer."
            : locale === "zh-Hant"
            ? "讓結果頁面看起來更好。"
            : "让结果页面看起来更好。",
      },
      {
        id: "remove_human_check",
        label:
          locale === "en"
            ? "Remove checking by people."
            : locale === "zh-Hant"
            ? "取消由人再檢查。"
            : "取消由人再检查。",
      },
    ] as const,
  [locale]
);

const w5ImpactCauseOptions = useMemo(
  () =>
    [
      {
        id: "training_data_not_diverse",
        label:
          locale === "en"
            ? "The training data is not diverse enough."
            : locale === "zh-Hant"
            ? "訓練資料不夠多樣。"
            : "训练数据不够多样。",
      },
      {
        id: "visual_features_too_similar",
        label:
          locale === "en"
            ? "Some objects look too similar for the system."
            : locale === "zh-Hant"
            ? "有些物品外觀太相似。"
            : "有些物品外观太相似。",
      },
      {
        id: "human_check_needed",
        label:
          locale === "en"
            ? "People still need to check uncertain cases."
            : locale === "zh-Hant"
            ? "不確定時仍然需要人檢查。"
            : "不确定时仍然需要人检查。",
      },
      {
        id: "not_related_to_ai_limit",
        label:
          locale === "en"
            ? "This has nothing to do with AI limits."
            : locale === "zh-Hant"
            ? "這和 AI 限制沒有關係。"
            : "这和 AI 限制没有关系。",
      },
    ] as const,
  [locale]
);
const w5HandlingStrategyOptions = useMemo(
  () =>
    [
      {
        id: "databot",
        title:
          locale === "en"
            ? "Add more similar examples"
            : locale === "zh-Hant"
            ? "補更多類似例子"
            : "补更多类似例子",
        note:
          locale === "en"
            ? "Good when the item changes shape."
            : locale === "zh-Hant"
            ? "適合物品形狀會變的情況。"
            : "适合物品形状会变的情况。",
        reasonTags: [
          "data_model_needs_representative_examples",
          "data_model_can_generalise_if_training_varied",
        ],
      },
      {
        id: "both_need_human_check",
        title:
          locale === "en"
            ? "Mark uncertain results for checking"
            : locale === "zh-Hant"
            ? "不確定時標記要檢查"
            : "不确定时标记要检查",
        note:
          locale === "en"
            ? "Good when a wrong result may affect people."
            : locale === "zh-Hant"
            ? "適合錯誤結果可能影響人的情況。"
            : "适合错误结果可能影响人的情况。",
        reasonTags: ["both_need_human_check"],
      },
      {
        id: "rulebot",
        title:
          locale === "en"
            ? "Keep the old fixed check"
            : locale === "zh-Hant"
            ? "繼續用原來固定判斷"
            : "继续用原来固定判断",
        note:
          locale === "en"
            ? "Only works when the case is very clear."
            : locale === "zh-Hant"
            ? "只適合情況非常清楚時。"
            : "只适合情况非常清楚时。",
        reasonTags: ["rule_is_clear_but_inflexible"],
      },
      {
        id: "speed_only",
        title:
          locale === "en"
            ? "Only make it answer faster"
            : locale === "zh-Hant"
            ? "只讓它回答更快"
            : "只让它回答更快",
        note:
          locale === "en"
            ? "This does not fix the wrong sorting."
            : locale === "zh-Hant"
            ? "這不能修正分類錯誤。"
            : "这不能修正分类错误。",
        reasonTags: ["faster_is_better"],
      },
    ] as const,
  [locale]
);
const w5SystemComparisonCases = useMemo(
  () => [
    {
      id: "normal_paper_box",
      title:
        locale === "en"
          ? "A complete paper box with a clear recycling label"
          : locale === "zh-Hant"
          ? "一個完整、有清楚回收標誌的紙盒"
          : "一个完整、有清楚回收标志的纸盒",
    },
    {
      id: "crushed_paper_box",
      title:
        locale === "en"
          ? "A crushed paper box that no longer keeps its normal shape"
          : locale === "zh-Hant"
          ? "一個被壓扁、形狀改變的紙盒"
          : "一个被压扁、形状改变的纸盒",
    },
    {
      id: "uncertain_dirty_box",
      title:
        locale === "en"
          ? "A dirty or unclear paper box that may need checking"
          : locale === "zh-Hant"
          ? "一個有污漬或看不清楚、可能需要檢查的紙盒"
          : "一个有污渍或看不清楚、可能需要检查的纸盒",
    },
  ],
  [locale]
);

const w5SystemComparisonReasonOptions = useMemo(
  () => [
    {
      id: "rule_is_clear_but_inflexible",
      label:
        locale === "en"
          ? "RuleBot is clear but inflexible"
          : locale === "zh-Hant"
          ? "規則系統清楚但不夠靈活"
          : "规则系统清楚但不够灵活",
    },
    {
      id: "data_model_needs_representative_examples",
      label:
        locale === "en"
          ? "DataBot needs representative examples"
          : locale === "zh-Hant"
          ? "數據模型需要有代表性的例子"
          : "数据模型需要有代表性的例子",
    },
    {
      id: "data_model_can_generalise_if_training_varied",
      label:
        locale === "en"
          ? "DataBot may handle variation if trained with varied data"
          : locale === "zh-Hant"
          ? "如果訓練數據多樣，數據模型可能處理變化"
          : "如果训练数据多样，数据模型可能处理变化",
    },
    {
      id: "both_need_human_check",
      label:
        locale === "en"
          ? "Both still need human checking"
          : locale === "zh-Hant"
          ? "兩者仍然需要人檢查"
          : "两者仍然需要人检查",
    },
    {
      id: "faster_is_better",
      label:
        locale === "en"
          ? "The faster one is better"
          : locale === "zh-Hant"
          ? "跑得更快的就更好"
          : "跑得更快的就更好",
    },
  ],
  [locale]
);

const w5UnfairOutcomeOptions = useMemo(
  () => [
    {
      id: "extra_work_for_cleaning_staff",
      label:
        locale === "en"
          ? "Cleaning staff need to correct repeated mistakes"
          : locale === "zh-Hant"
          ? "清潔工需要反覆處理誤判"
          : "清洁工需要反复处理误判",
    },
    {
      id: "some_students_more_likely_flagged",
      label:
        locale === "en"
          ? "Some students or locations are misjudged more often"
          : locale === "zh-Hant"
          ? "某些同學或地點更常被誤判"
          : "某些同学或地点更常被误判",
    },
    {
      id: "wrong_feedback_or_penalty",
      label:
        locale === "en"
          ? "Students may receive wrong feedback or penalties"
          : locale === "zh-Hant"
          ? "同學可能收到錯誤提示或扣分"
          : "同学可能收到错误提示或扣分",
    },
  ],
  [locale]
);

const w5BiasMitigationOptions = useMemo(
  () => [
    {
      id: "add_diverse_training_images",
      label:
        locale === "en"
          ? "Add more diverse training images"
          : locale === "zh-Hant"
          ? "補充更多樣的訓練圖片"
          : "补充更多样的训练图片",
    },
    {
      id: "human_check_uncertain_cases",
      label:
        locale === "en"
          ? "Human review for uncertain cases"
          : locale === "zh-Hant"
          ? "不確定時由人複核"
          : "不确定时由人复核",
    },
    {
      id: "explain_system_limits",
      label:
        locale === "en"
          ? "Explain system limits to users"
          : locale === "zh-Hant"
          ? "向使用者說明系統限制"
          : "向使用者说明系统限制",
    },
    {
      id: "allow_user_correction",
      label:
        locale === "en"
          ? "Allow users to correct mistakes"
          : locale === "zh-Hant"
          ? "允許使用者更正錯誤"
          : "允许使用者更正错误",
    },
  ],
  [locale]
);
const w5ImpactProblemOptions = useMemo(
  () =>
    [
      {
        id: "wrong_bin_guidance",
        label:
          locale === "en"
            ? "A student sorted correctly but still gets a wrong reminder."
            : locale === "zh-Hant"
            ? "同學明明分類對了，卻仍被提醒做錯。"
            : "同学明明分类对了，却仍被提醒做错。",
      },
      {
        id: "extra_work_for_cleaning_staff",
        label:
          locale === "en"
            ? "Cleaning staff may need to check this mistake again and again."
            : locale === "zh-Hant"
            ? "清潔人員可能要反覆檢查同類錯誤。"
            : "清洁人员可能要反复检查同类错误。",
      },
      {
        id: "recycling_record_inaccurate",
        label:
          locale === "en"
            ? "The recycling record may become less accurate."
            : locale === "zh-Hant"
            ? "回收統計可能變得不準確。"
            : "回收统计可能变得不准确。",
      },
      {
        id: "overtrust_ai",
        label:
          locale === "en"
            ? "Everyone will trust the AI more because it looks confident."
            : locale === "zh-Hant"
            ? "大家會因為 AI 看起來自信而更相信它。"
            : "大家会因为 AI 看起来自信而更相信它。",
      },
    ] as const,
  [locale]
);

function deriveW5AffectedStakeholders(outcomeIds: string[]) {
  const result = new Set<string>();

  if (
    outcomeIds.includes("wrong_bin_guidance") ||
    outcomeIds.includes("overtrust_ai")
  ) {
    result.add("younger_students");
    result.add("students_with_similar_items");
  }

  if (outcomeIds.includes("extra_work_for_cleaning_staff")) {
    result.add("cleaning_staff");
  }

  if (outcomeIds.includes("recycling_record_inaccurate")) {
    result.add("canteen_users");
  }

  return Array.from(result);
}
const w5ResourceTriageCards = useMemo(
  () => [
    {
      id: "analyse_many_photos",
      label:
        locale === "en"
          ? "Analyse many photos of crushed, folded, and normal paper boxes"
          : locale === "zh-Hant"
          ? "分析大量壓扁、折起和完整紙盒照片"
          : "分析大量压扁、折起和完整纸盒照片",
      note:
        locale === "en"
          ? "Large-scale pattern checking can be a reasonable use of AI."
          : locale === "zh-Hant"
          ? "大量圖像模式分析，使用 AI 是合理的。"
          : "大量图像模式分析，使用 AI 是合理的。",
    },
    {
      id: "clear_bottle_with_sign",
      label:
        locale === "en"
          ? "Sort one clean, complete box when the recycling sign is clear"
          : locale === "zh-Hant"
          ? "分類一個完整清楚、旁邊已有標誌的紙盒"
          : "分类一个完整清楚、旁边已有标志的纸盒",
      note:
        locale === "en"
          ? "A simple, clear case may not need AI."
          : locale === "zh-Hant"
          ? "簡單清楚的情況不一定需要 AI。"
          : "简单清楚的情况不一定需要 AI。",
    },
    {
      id: "auto_penalty",
      label:
        locale === "en"
          ? "Automatically warn or penalise students based only on the AI result"
          : locale === "zh-Hant"
          ? "只根據 AI 結果自動提醒或處罰學生"
          : "只根据 AI 结果自动提醒或处罚学生",
      note:
        locale === "en"
          ? "High-impact decisions need human checking."
          : locale === "zh-Hant"
          ? "會影響學生的結果需要人類檢查。"
          : "会影响学生的结果需要人类检查。",
    },
  ],
  [locale]
);

const w5ResourceReasonOptions = useMemo(
  () => [
    {
      id: "ai_uses_energy_resources",
      label:
        locale === "en"
          ? "AI uses computing resources and energy"
          : locale === "zh-Hant"
          ? "AI 會使用計算資源和能源"
          : "AI 会使用计算资源和能源",
    },
    {
      id: "use_ai_when_task_complex",
      label:
        locale === "en"
          ? "Use AI when the task is complex or large-scale"
          : locale === "zh-Hant"
          ? "任務複雜或資料量大時才較值得用 AI"
          : "任务复杂或资料量大时才较值得用 AI",
    },
    {
      id: "simple_task_no_ai_needed",
      label:
        locale === "en"
          ? "Simple tasks may be handled without AI"
          : locale === "zh-Hant"
          ? "簡單任務可以不用 AI"
          : "简单任务可以不用 AI",
    },
    {
      id: "high_impact_needs_human_check",
      label:
        locale === "en"
          ? "High-impact AI results need human checking"
          : locale === "zh-Hant"
          ? "高影響的 AI 結果需要人類檢查"
          : "高影响的 AI 结果需要人类检查",
    },
  ],
  [locale]
);

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
  const w1ModeOptions = useMemo(
  () =>
    [
      {
        id: "personal",
        label:
          locale === "en"
            ? "Best for me"
            : locale === "zh-Hant"
            ? "最適合我"
            : "最适合我",
      },
      {
        id: "popular",
        label:
          locale === "en"
            ? "What everyone is learning"
            : locale === "zh-Hant"
            ? "大家都在學"
            : "大家都在学",
      },
      {
        id: "explore",
        label:
          locale === "en"
            ? "Try a new direction"
            : locale === "zh-Hant"
            ? "試試新方向"
            : "试试新方向",
      },
    ] as const,
  [locale]
);
const w1RuleOptions = useMemo(
  () =>
    [
      {
        key: "explainReason",
        label:
          locale === "en"
            ? "Explain why something is recommended"
            : locale === "zh-Hant"
            ? "解釋推薦原因"
            : "解释推荐原因",
      },
      {
        key: "teacherReview",
        label:
          locale === "en"
            ? "Allow teachers to review and adjust"
            : locale === "zh-Hant"
            ? "允許老師查看和調整"
            : "允许老师查看和调整",
      },
      {
        key: "tryNewThings",
        label:
          locale === "en"
            ? "Give students a “try a new direction” button"
            : locale === "zh-Hant"
            ? "給學生一個「試試新方向」按鈕"
            : "给学生一个“试试新方向”按钮",
      },
      {
        key: "sayWhatDataUsed",
        label:
          locale === "en"
            ? "Clearly state which learning records were used"
            : locale === "zh-Hant"
            ? "清楚說明用了哪些學習記錄"
            : "清楚说明用了哪些学习记录",
      },
      {
        key: "onlyPopular",
        label:
          locale === "en"
            ? "Only recommend popular content, regardless of individual needs"
            : locale === "zh-Hant"
            ? "只推熱門內容，不管每個人的需要"
            : "只推热门内容，不管每个人的需要",
      },
    ] as const,
  [locale]
);
const commuteSurveyData = useMemo(
  () =>
    locale === "en"
      ? [
          { type: "Walking", count: 18, note: "More students live near the school." },
          { type: "Parent drop-off", count: 12, note: "This is more concentrated during the morning peak." },
          { type: "School bus / public transport", count: 9, note: "These students mainly come from farther neighbourhoods." },
          { type: "Cycling", count: 6, note: "Safer routes need to be considered." },
        ]
      : locale === "zh-Hant"
      ? [
          { type: "步行", count: 18, note: "離學校近的同學較多" },
          { type: "家長接送", count: 12, note: "早高峰比較集中" },
          { type: "校車／公交", count: 9, note: "主要來自較遠社區" },
          { type: "騎車", count: 6, note: "需要考慮安全路線" },
        ]
      : commuteSurvey,
  [locale]
);
const roleOutputsData = useMemo(
  () =>
    ({
      data: {
        title:
          locale === "en"
            ? "Data organiser"
            : locale === "zh-Hant"
            ? "數據整理助手"
            : "数据整理助手",
        body:
          locale === "en"
            ? [
                "Walking 40.0%",
                "Parent drop-off 26.7%",
                "School bus / public transport 20.0%",
                "Cycling 13.3%",
              ]
            : locale === "zh-Hant"
            ? [
                "步行 40.0%",
                "家長接送 26.7%",
                "校車／公交 20.0%",
                "騎車 13.3%",
              ]
            : [
                "步行 40.0%",
                "家长接送 26.7%",
                "校车/公交 20.0%",
                "骑车 13.3%",
              ],
      },
      summary: {
        title:
          locale === "en"
            ? "Summary helper"
            : locale === "zh-Hant"
            ? "摘要助手"
            : "摘要助手",
        body:
          locale === "en"
            ? [
                "Walking is the most common way to get to school.",
                "Parent drop-off is concentrated during the morning peak, which may cause congestion.",
                "Students from farther neighbourhoods rely more on school buses or public transport.",
              ]
            : locale === "zh-Hant"
            ? [
                "步行是最常見的上學方式。",
                "家長接送集中在早高峰，容易造成擁擠。",
                "來自較遠社區的同學更依賴校車或公交。",
              ]
            : [
                "步行是最常见的上学方式。",
                "家长接送集中在早高峰，容易堵车。",
                "较远社区的同学更依赖校车或公交。",
              ],
      },
      draft: {
        title:
          locale === "en"
            ? "Suggestion-draft helper"
            : locale === "zh-Hant"
            ? "建議草稿助手"
            : "建议草稿助手",
        body:
          locale === "en"
            ? [
                "The school could improve traffic flow near the gate during the morning peak.",
                "The school could provide safer route reminders for students who walk or cycle.",
                "The report should note that different travel modes create different needs.",
              ]
            : locale === "zh-Hant"
            ? [
                "建議學校優化早高峰校門口的通行安排。",
                "建議為步行和騎車同學設計更安全的路線提示。",
                "建議在簡報中提醒大家，不同上學方式有不同需要。",
              ]
            : [
                "建议学校优化校门口高峰时段通行安排。",
                "建议为步行和骑车同学设计更安全的路线提示。",
                "建议在简报中提醒大家不同上学方式的需要不一样。",
              ],
      },
    } as const),
  [locale]
);
const recycleCasesData = useMemo(
  () =>
    ({
      crushed: {
        title:
          locale === "en"
            ? "Crushed paper box"
            : locale === "zh-Hant"
            ? "被壓扁後的紙盒"
            : "被压扁后的纸盒",
        emoji: "📦",
        system:
          locale === "en"
            ? "The system classified it as “other waste”."
            : locale === "zh-Hant"
            ? "系統把它判成了「其他垃圾」。"
            : "系统把它判成了“其他垃圾”。",
        actual:
          locale === "en"
            ? "A more reasonable judgement is “recyclable paper”."
            : locale === "zh-Hant"
            ? "更合理的判斷是「可回收紙類」。"
            : "更合理的判断是“可回收纸类”。",
      },
    } as const),
  [locale]
);
const trainingImagesByCaseData = useMemo(
  () =>
    ({
      crushed: [
        {
          id: "c1",
          title:
            locale === "en"
              ? "Crushed paper box"
              : locale === "zh-Hant"
              ? "壓扁的紙盒"
              : "压扁的纸盒",
          note:
            locale === "en"
              ? "Useful"
              : locale === "zh-Hant"
              ? "有用"
              : "有用",
          good: true,
        },
        {
          id: "c3",
          title:
            locale === "en"
              ? "Paper boxes with different damage levels"
              : locale === "zh-Hant"
              ? "不同破損程度的紙盒"
              : "不同破损程度的纸盒",
          note:
            locale === "en"
              ? "Useful"
              : locale === "zh-Hant"
              ? "有用"
              : "有用",
          good: true,
        },
        {
          id: "c5",
          title:
            locale === "en"
              ? "Folded paper box"
              : locale === "zh-Hant"
              ? "摺起來的紙盒"
              : "折起来的纸盒",
          note:
            locale === "en"
              ? "Useful"
              : locale === "zh-Hant"
              ? "有用"
              : "有用",
          good: true,
        },
        {
          id: "c6",
          title:
            locale === "en"
              ? "Wet or deformed paper box"
              : locale === "zh-Hant"
              ? "潮濕變形的紙盒"
              : "潮湿变形的纸盒",
          note:
            locale === "en"
              ? "Useful"
              : locale === "zh-Hant"
              ? "有用"
              : "有用",
          good: true,
        },
        {
          id: "c2",
          title:
            locale === "en"
              ? "Complete flat paper box"
              : locale === "zh-Hant"
              ? "完整平整的紙盒"
              : "完整平整的纸盒",
          note:
            locale === "en"
              ? "Too narrow"
              : locale === "zh-Hant"
              ? "例子太窄"
              : "例子太窄",
          good: false,
        },
        {
          id: "c4",
          title:
            locale === "en"
              ? "Classroom desk photo"
              : locale === "zh-Hant"
              ? "教室桌面照片"
              : "教室桌面照片",
          note:
            locale === "en"
              ? "Irrelevant"
              : locale === "zh-Hant"
              ? "不相關"
              : "不相关",
          good: false,
        },
        {
          id: "c7",
          title:
            locale === "en"
              ? "Plastic bottle photo"
              : locale === "zh-Hant"
              ? "塑膠瓶照片"
              : "塑料瓶照片",
          note:
            locale === "en"
              ? "Irrelevant"
              : locale === "zh-Hant"
              ? "不相關"
              : "不相关",
          good: false,
        },
        {
          id: "c8",
          title:
            locale === "en"
              ? "Ordinary scenery photo"
              : locale === "zh-Hant"
              ? "普通風景照片"
              : "普通风景照片",
          note:
            locale === "en"
              ? "Irrelevant"
              : locale === "zh-Hant"
              ? "不相關"
              : "不相关",
          good: false,
        },
      ],
    } as const),
  [locale]
);

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

  const promptTagsList = useMemo(() => w3PromptTagOptions.map((tag) => tag.label), [w3PromptTagOptions]);


  const w3HelpfulReviewTags = useMemo(
  () => [
    { id: "clearer_expression", label: locale === "en" ? "Made my message clearer" : locale === "zh-Hant" ? "讓表達更清楚" : "让表达更清楚" },
    { id: "warmer_tone", label: locale === "en" ? "Made the tone warmer" : locale === "zh-Hant" ? "讓語氣更溫暖" : "让语气更温暖" },
    { id: "fit_recipient", label: locale === "en" ? "Helped me write more for the recipient" : locale === "zh-Hant" ? "幫我想到更適合對象的說法" : "帮我想到更适合对象的说法" },
    { id: "noticed_improvement", label: locale === "en" ? "Helped me notice what could be improved" : locale === "zh-Hant" ? "幫我發現原稿可以改進的地方" : "帮我发现原稿可以改进的地方" },
    { id: "not_much_help", label: locale === "en" ? "Did not help much" : locale === "zh-Hant" ? "沒有太大幫助" : "没有太大帮助" },
  ] as const,
  [locale]
);

const w3LimitationReviewTags = useMemo(
  () => [
    { id: "too_generic", label: locale === "en" ? "A bit too generic" : locale === "zh-Hant" ? "有點太普通" : "有点太普通" },
    { id: "too_formal", label: locale === "en" ? "A bit too formal" : locale === "zh-Hant" ? "有點太正式" : "有点太正式" },
    { id: "not_my_voice", label: locale === "en" ? "Did not sound like my voice" : locale === "zh-Hant" ? "不太像我的語氣" : "不太像我的语气" },
    { id: "not_fit_recipient", label: locale === "en" ? "Did not fit my chosen recipient enough" : locale === "zh-Hant" ? "不夠適合我選擇的對象" : "不够适合我选择的对象" },
    { id: "did_not_keep_example", label: locale === "en" ? "Did not keep my example or feeling well" : locale === "zh-Hant" ? "沒有保留好我的例子或感受" : "没有保留好我的例子或感受" },
    { id: "no_obvious_problem", label: locale === "en" ? "No obvious problem" : locale === "zh-Hant" ? "沒有明顯問題" : "没有明显问题" },
  ] as const,
  [locale]
);

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

  async function trackEvent(payload: {
  worldId?: string;
  stepId?: string;
  eventType: string;
  eventName: string;
  eventValueJson?: unknown;
}) {
  if (!sessionId) return null;

  try {
    await postJson("/api/event", {
      ...payload,
      sessionId,
    });
  } catch (error) {
    console.warn("[browser] trackEvent failed", error);
    return null;
  }

  return null;
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

  function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function runScore(): Promise<boolean> {
  if (!sessionId) return false;

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      await postJson("/api/score/run", { sessionId });
      return true;
    } catch (error) {
      lastError = error;
      console.error(`[browser] runScore failed, attempt ${attempt}/5`, error);

      // 1.2s, 2.4s, 3.6s, 4.8s, 6s
      await sleep(1200 * attempt);
    }
  }

  console.error("[browser] runScore failed after all retries", lastError);
  return false;
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
  
function deriveW3KeptOwnSentence() {
  const assetKeepsOwnSentence =
    w3AssetAllocation.own_sentence === "use" ||
    w3AssetAllocation.own_sentence === "credit";

  const finalText = w3FinalText.trim();
  const draftText = w3Draft.trim();

  const hasSharedWords =
    draftText.length > 10 &&
    finalText.length > 10 &&
    draftText
      .split(/[，。！？,.!?\s]+/)
      .filter((x) => x.trim().length >= 2)
      .some((piece) => finalText.includes(piece));

  return assetKeepsOwnSentence || hasSharedWords;
}
  async function finishWorld(id: WorldId) {
    if (id === "w1") {
      const selectedW1RuleIds = [
        ...(w1Rules.explainReason ? ["explain_reason"] : []),
        ...(w1Rules.teacherReview ? ["teacher_review"] : []),
        ...(w1Rules.tryNewThings ? ["try_new_things"] : []),
        ...(w1Rules.sayWhatDataUsed ? ["say_what_data_used"] : []),
        ...(w1Rules.onlyPopular ? ["only_popular"] : []),
      ];

      const selectedW1RuleItems = [
        {
          id: "explain_reason",
          legacyKey: "explainReason",
          label:
            locale === "en"
              ? "Explain the recommendation reason"
              : locale === "zh-Hant"
              ? "解釋推薦原因"
              : "解释推荐原因",
          selected: w1Rules.explainReason,
        },
        {
          id: "teacher_review",
          legacyKey: "teacherReview",
          label:
            locale === "en"
              ? "Allow teacher review and adjustment"
              : locale === "zh-Hant"
              ? "允許老師查看和調整"
              : "允许老师查看和调整",
          selected: w1Rules.teacherReview,
        },
        {
          id: "try_new_things",
          legacyKey: "tryNewThings",
          label:
            locale === "en"
              ? "Give students a try-something-new button"
              : locale === "zh-Hant"
              ? "給學生一個「試試新方向」按鈕"
              : "给学生一个“试试新方向”按钮",
          selected: w1Rules.tryNewThings,
        },
        {
          id: "say_what_data_used",
          legacyKey: "sayWhatDataUsed",
          label:
            locale === "en"
              ? "Clearly explain what learning records were used"
              : locale === "zh-Hant"
              ? "清楚說明用了哪些學習記錄"
              : "清楚说明用了哪些学习记录",
          selected: w1Rules.sayWhatDataUsed,
        },
        {
          id: "only_popular",
          legacyKey: "onlyPopular",
          label:
            locale === "en"
              ? "Only recommend popular content regardless of individual needs"
              : locale === "zh-Hant"
              ? "只推熱門內容，不管每個人的需要"
              : "只推热门内容，不管每个人的需要",
          selected: w1Rules.onlyPopular,
        },
      ];

      const openedCardItems = Object.values(learningCardsByModeData)
        .flat()
        .filter((card) => w1OpenedCards.includes(card.id))
        .map((card) => ({
          id: card.id,
          title: card.title,
          label: card.label,
          reason: card.reason,
          detail: card.detail,
        }));

      const helpfulReasonSnapshots = w1HelpfulReasonOptions
        .filter((item) => w1HelpfulReasonTags.includes(item.id))
        .map((item) => ({ id: item.id, label: item.label }));

      const narrowReasonSnapshots = w1NarrowReasonOptions
        .filter((item) => w1NarrowReasonTags.includes(item.id))
        .map((item) => ({ id: item.id, label: item.label }));

      await saveStep("w1", "w1_step1", {
        openedCardIds: w1OpenedCards,
        viewedReasonCardIds: w1OpenedCards,
        visitedModes: w1VisitedModes,

        // Evidence snapshot for teacher report
        openedCardItems,
      });

      await saveStep("w1", "w1_step2", {
        helpfulModeId: w1BestMode,
        narrowModeId: w1NarrowMode,
        helpfulReasonTags: w1HelpfulReasonTags,
        narrowReasonTags: w1NarrowReasonTags,
        helpfulReasonSnapshots,
        narrowReasonSnapshots,
        currentModeId: w1Mode,
        visitedModes: w1VisitedModes,

        // Legacy aliases: keep them until all report/scoring code reads canonical fields.
        mode: w1Mode,
        logic: "learning",
        bestMode: w1BestMode,
        narrowMode: w1NarrowMode,
      });

      await saveStep("w1", "w1_step3", {
        selectedRuleIds: selectedW1RuleIds,
        aiUseRuleIds: selectedW1RuleIds,
        ruleItems: selectedW1RuleItems,
        selectedRuleItems: selectedW1RuleItems.filter((item) => item.selected),

        // Legacy aliases: old report/scoring code may still read rules.*.
        rules: {
          explain_reason: w1Rules.explainReason,
          teacher_review: w1Rules.teacherReview,
          try_new_things: w1Rules.tryNewThings,
          only_popular: w1Rules.onlyPopular,
          say_what_data_used: w1Rules.sayWhatDataUsed,
          explainReason: w1Rules.explainReason,
          teacherReview: w1Rules.teacherReview,
          tryNewThings: w1Rules.tryNewThings,
          onlyPopular: w1Rules.onlyPopular,
          sayWhatDataUsed: w1Rules.sayWhatDataUsed,
        },
      });

      await saveSubmission("w1", "info_card", `${w1Good}\n\n${w1Warn}`, {
        good: w1Good,
        warning: w1Warn,
        helpfulModeId: w1BestMode,
        narrowModeId: w1NarrowMode,
        helpfulReasonTags: w1HelpfulReasonTags,
        narrowReasonTags: w1NarrowReasonTags,
        selectedRuleIds: selectedW1RuleIds,
        selectedRuleItems: selectedW1RuleItems.filter((item) => item.selected),
        openedCardItems,
      });
    } else if (id === "w2") {
      await saveStep("w2", "w2_step1", {
        aiRoleChoiceId:
          w2RoleChoice === "draft"
            ? "organize_information_generate_draft"
            : w2RoleChoice,
        finalDecisionBy: w2FinalDecisionBy,
        choice: w2RoleChoice,
      });

      const selectedW2DraftForSaving = w2DraftChoice
        ? infoTaskDraftsData[w2DraftChoice]
        : null;

      const claimChoiceLabel = (status: ClaimStatus | "" | undefined): string => {
        if (status === "keep") {
          return locale === "en"
            ? "Keep"
            : locale === "zh-Hant"
            ? "可以保留"
            : "可以保留";
        }
        if (status === "check") {
          return locale === "en"
            ? "Check again"
            : locale === "zh-Hant"
            ? "要再查一下"
            : "要再查一下";
        }
        if (status === "remove") {
          return locale === "en"
            ? "Do not publish directly"
            : locale === "zh-Hant"
            ? "不能直接發布"
            : "不能直接发布";
        }
        return "";
      };

      const w2DraftReasonSnapshots = w2DraftReasonOptions
        .filter((item) => w2DraftReasonTags.includes(item.id))
        .map((item) => ({ id: item.id, label: item.label }));

      const w2ClaimReviewItems = selectedW2DraftForSaving
        ? selectedW2DraftForSaving.claims.map((claim, index) => ({
            id: `claim_${index + 1}`,
            text: claim,
            studentChoice: w2ClaimStatus[claim] ?? "",
            studentChoiceLabel: claimChoiceLabel(w2ClaimStatus[claim]),
          }))
        : [];

      await saveStep("w2", "w2_step2", {
        draftChoiceId: w2DraftChoice,
        draftReasonTags: w2DraftReasonTags,
        draftReasonSnapshots: w2DraftReasonSnapshots,
        choice: w2DraftChoice,

        // Evidence snapshot for teacher report
        selectedDraftTitle: selectedW2DraftForSaving?.title ?? "",
        selectedDraftText: selectedW2DraftForSaving?.text ?? "",
        selectedDraftClaims: selectedW2DraftForSaving?.claims ?? [],
      });

      await saveStep("w2", "w2_step3", {
        claimStatusById: w2ClaimStatus,

        // Evidence snapshot for teacher report
        claimReviewItems: w2ClaimReviewItems,
        sourceCheckViewed: w2SourceCheckViewed,
        sourceCheckChoice: w2SourceCheckChoice,

        flaggedClaims: Object.entries(w2ClaimStatus)
          .filter(([, status]) => status === "check" || status === "remove")
          .map(([claim]) => claim),
      });

      await saveStep("w2", "w2_step4", {
  finalReason: w2FinalReason,
  sourceCheckViewed: w2SourceCheckViewed,
  sourceCheckChoice: w2SourceCheckChoice,
});


      await saveSubmission("w2", "info_card", w2FinalReason, {
        finalReason: w2FinalReason,
        draftChoiceId: w2DraftChoice,
        selectedDraftTitle: selectedW2DraftForSaving?.title ?? "",
        selectedDraftText: selectedW2DraftForSaving?.text ?? "",
        claimReviewItems: w2ClaimReviewItems,
        sourceCheckViewed: w2SourceCheckViewed,
        sourceCheckChoice: w2SourceCheckChoice,
      });
    } else if (id === "w3") {
      await saveStep("w3", "w3_step1", {
        recipientId: w3Recipient,
        recipient: w3Recipient,
      });

      const w3SystemSampleDraft = w3Recipient ? draftSamplesData[w3Recipient] : "";

      await saveStep("w3", "w3_step2", {
        recipient: w3Recipient,

        // Evidence snapshot for teacher report
        systemSampleDraft: w3SystemSampleDraft,
        studentUsedSystemSample:
          !!w3SystemSampleDraft && w3Draft.trim() === w3SystemSampleDraft.trim(),

        firstDraftText: w3Draft,
        draft: w3Draft,
      });

      await saveStep("w3", "w3_step3", {
  promptText: w3LastVisibleUserMessage || w3LastPromptText || w3Prompt,
  rawPromptText: w3LastPromptText || w3Prompt,
  visibleUserMessage: w3LastVisibleUserMessage,
  aiReply: w3LastAiReply,
  promptTagIds: w3PromptTags,
  promptTags: w3PromptTags,
  aiSuggestionUseStrategy: w3SuggestionUseStrategy,
  ideaSupportTags: w3IdeaSupportTags,
});

      const w3MechanismCorrectCount = Object.entries(w3MechanismSort).filter(
        ([statementId, value]) => {
          const item = w3MechanismStatements.find((x) => x.id === statementId);
          return item && item.answer === value;
        }
      ).length;

      await saveStep("w3", "w3_step4", {
        selectedFormatId: w3PresentationFormat,
        presentationFormat: w3PresentationFormat,
        comparedFormatIds: w3ComparedFormatIds,
        selectedDesignElementIds: w3SelectedDesignElementIds,
        rejectedElementIds: w3RejectedElementIds,
        designElementAllocation: w3DesignElementAllocation,
        formatReasonTags: w3PresentationReasonTags,
        presentationReasonTags: w3PresentationReasonTags,
      });

      await saveStep("w3", "w3_step5", {
        selectedAssetIds: w3SelectedAssetIds,
        assetAllocation: w3AssetAllocation,
        disclosureChoiceId: w3DisclosureChoiceId,
        attributionChoiceId: w3AttributionChoiceId,
        keptOwnSentence: deriveW3KeptOwnSentence(),
      });

      await saveStep("w3", "w3_step6", {
        mechanismSort: w3MechanismSort,
        mechanismCorrectCount: w3MechanismCorrectCount,
      });

      await saveStep("w3", "w3_step7", {
        finalText: w3FinalText,
        creditNotes: w3CreditNotes,
        aiHelpfulTagIds: w3HelpfulTags,
        aiLimitationTagIds: w3LimitationTags,
        helpfulTags: w3HelpfulTags,
        limitationTags: w3LimitationTags,
        aiUsabilityFeedback: w3UsabilityFeedback,
        usabilityFeedbackScored: false,
        selfCheckJson: {
          checklist: w3Checklist,
        },
      });

      await saveSubmission("w3", "warm_card", w3FinalText, {
        checklist: w3Checklist,
        presentationFormat: w3PresentationFormat,
        presentationReasonTags: w3PresentationReasonTags,
        selectedFormatId: w3PresentationFormat,
comparedFormatIds: w3ComparedFormatIds,
selectedDesignElementIds: w3SelectedDesignElementIds,
rejectedElementIds: w3RejectedElementIds,
formatReasonTags: w3PresentationReasonTags,
selectedAssetIds: w3SelectedAssetIds,
creditNotes: w3CreditNotes,
disclosureChoiceId: w3DisclosureChoiceId,
attributionChoiceId: w3AttributionChoiceId,
keptOwnSentence: deriveW3KeptOwnSentence(),
mechanismSort: w3MechanismSort,
mechanismCorrectCount: w3MechanismCorrectCount,
        aiSuggestionUseStrategy: w3SuggestionUseStrategy,
        ideaSupportTags: w3IdeaSupportTags,
        systemSampleDraft: w3SystemSampleDraft,
        studentUsedSystemSample:
          !!w3SystemSampleDraft && w3Draft.trim() === w3SystemSampleDraft.trim(),
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
      const w4TaskResponsibilityById = {
        calculate_percentages: w4AiTasks.includes("calculate_percentages")
          ? "ai"
          : "human",
        organize_key_points: w4AiTasks.includes("organize_key_points")
          ? "ai"
          : "human",
        explain_common_pattern: w4AiTasks.includes("explain_common_pattern")
          ? "ai_assisted_human_check"
          : "human",
        decide_final_suggestions: w4AiTasks.includes("decide_final_suggestions")
          ? "ai"
          : "human",
        check_fairness_feasibility: w4AiTasks.includes("check_fairness_feasibility")
          ? "ai"
          : "human",
        disclose_ai_use: w4AiTasks.includes("disclose_ai_use") ? "ai" : "human",
      };

      const selectedW4AiTaskItems = w4TaskOptions
        .filter((item) => w4AiTasks.includes(item.id))
        .map((item) => ({ id: item.id, label: item.label }));

      const selectedW4HumanResponsibilityItems = w4HumanResponsibilityOptions
        .filter((item) => w4HumanStillDo.includes(item.id))
        .map((item) => ({ id: item.id, label: item.label }));

      const selectedW4RuleItems = w4RuleOptions
        .filter((item) => w4Rules.includes(item.id))
        .map((item) => ({ id: item.id, label: item.label }));

      const selectedW4RoleSnapshot =
        selectedW4RoleOutput && w4Role !== "no_ai_support"
          ? {
              roleId: w4Role,
              title: selectedW4RoleOutput.title,
              body: selectedW4RoleOutput.body,
            }
          : null;

      await saveStep("w4", "w4_step1", {
        taskContextId: "commute_survey_school_suggestions",
        surveyItems: commuteSurveyData,

        // Legacy alias retained because older report/scoring may still read it.
        useAiChoice: w4UseChoice,
      });

      await saveStep("w4", "w4_step2", {
  workflowAllocation: w4WorkflowAllocation,
  taskResponsibilityById: w4WorkflowAllocation,

  automationTaskIds: Object.entries(w4WorkflowAllocation)
    .filter(([, value]) => value === "ai_auto")
    .map(([taskId]) => taskId),

  augmentationTaskIds: Object.entries(w4WorkflowAllocation)
    .filter(([, value]) => value === "ai_assist_human_check")
    .map(([taskId]) => taskId),

  humanJudgementTaskIds: Object.entries(w4WorkflowAllocation)
    .filter(([, value]) => value === "human_only")
    .map(([taskId]) => taskId),

  // Legacy aliases
  aiTasks: w4AiTasks,
  aiTaskIds: w4AiTasks,
  humanTasks: w4HumanStillDo,
  humanTaskIds: w4HumanStillDo,
});
      await saveStep("w4", "w4_step3", {
        aiRoleId: w4Role,
        noAiReason: w4NoAiReason,

        // Evidence snapshot for teacher report
        selectedRoleSnapshot: selectedW4RoleSnapshot,

        // Legacy alias.
        aiRole: w4Role,
      });

      await saveStep("w4", "w4_step4", {
        aiOutputUseChoiceId: w4UseChoice,
        humanStillDoIds: w4HumanStillDo,
        aiUseRuleIds: w4Rules,
        reminder: w4Reminder,
        noAiReason: w4NoAiReason,
        adjustedWorkflow: !!w4UseChoice || w4Role === "no_ai_support",

        // Evidence snapshots for teacher report
        humanStillDoItems: selectedW4HumanResponsibilityItems,
        aiUseRuleItems: selectedW4RuleItems,

        // Legacy alias.
        rules: w4Rules,
      });

      await saveSubmission("w4", "workflow_card", `${w4Rules.join("；")}\n\n${w4Reminder || w4NoAiReason}`, {
        taskResponsibilityById: w4TaskResponsibilityById,
        aiTaskIds: w4AiTasks,
        selectedAiTaskItems: selectedW4AiTaskItems,
        aiRoleId: w4Role,
        selectedRoleSnapshot: selectedW4RoleSnapshot,
        aiOutputUseChoiceId: w4UseChoice,
        aiUseRuleIds: w4Rules,
        aiUseRuleItems: selectedW4RuleItems,
        humanStillDoIds: w4HumanStillDo,
        humanStillDoItems: selectedW4HumanResponsibilityItems,
        noAiReason: w4NoAiReason,
        reminder: w4Reminder,
        workflowAllocation: w4WorkflowAllocation,
automationTaskIds: Object.entries(w4WorkflowAllocation)
  .filter(([, value]) => value === "ai_auto")
  .map(([taskId]) => taskId),
augmentationTaskIds: Object.entries(w4WorkflowAllocation)
  .filter(([, value]) => value === "ai_assist_human_check")
  .map(([taskId]) => taskId),
humanJudgementTaskIds: Object.entries(w4WorkflowAllocation)
  .filter(([, value]) => value === "human_only")
  .map(([taskId]) => taskId),
      });
    } else if (id === "w5") {
      await saveStep("w5", "w5_step1", {
  failureCaseId: "crushed",
  choice: "crushed",
  selectedSuspiciousRecordId: "crushed_paper_box",
  failureCueIds: w5FailureCueIds,
  failureCueItems: w5FailureCueOptions
    .filter((item) => w5FailureCueIds.includes(item.id))
    .map((item) => ({ id: item.id, label: item.label })),
  aiCategory: "other_waste",
  aiConfidence: 0.82,
});

      await saveStep("w5", "w5_step2", {
  causeChoiceId: w5Cause,
  causeChoiceIds: w5CauseIds,
  choice: w5Cause,
  systemImprovementChoice: w5SystemImprovementChoice,
});

      await saveStep("w5", "w5_step3", {
        systemComparisonChoiceByCase: w5SystemComparisonChoiceByCase,
        systemComparisonReasonTags: w5SystemComparisonReasonTags,
      });

      const selectedTrainingImageItems = world5Images
        .filter((img) => w5Training.includes(img.id))
        .map((img) => ({
          id: img.id,
          title: img.title,
          note: img.note,
          good: img.good,
          problemCase: w5Problem,
        }));

      await saveStep("w5", "w5_step4", {
        selectedTrainingImageIds: w5Training,
        selectedTrainingImages: w5Training,
        selectedTrainingImageItems,
      });

      const effectiveW5BiasCauseLinkIds = w5BiasCauseLinkIds.length
  ? w5BiasCauseLinkIds
  : deriveW5BiasCauseLinkIds(w5Cause);

const effectiveAffectedStakeholders = w5AffectedStakeholders.length
  ? w5AffectedStakeholders
  : deriveW5AffectedStakeholders(w5UnfairOutcomeIds);

await saveStep("w5", "w5_step5", {
  affectedStakeholders: effectiveAffectedStakeholders,
  unfairOutcomeIds: w5UnfairOutcomeIds,
  biasCauseLinkIds: effectiveW5BiasCauseLinkIds,
  manuallySelectedBiasCauseLinkIds: w5BiasCauseLinkIds,
  derivedBiasCauseLinkIds: deriveW5BiasCauseLinkIds(w5Cause),
  biasMitigationIds: w5BiasMitigationIds,
});

      await saveStep("w5", "w5_step6", {
        selectedReminderIds: w5Reminders,
        selectedReminders: w5Reminders,
        resourceTriageAllocation: w5ResourceTriageAllocation,
        resourceReasonTags: [],
        aiResourceUseChoice: w5AiResourceUseChoice,
        impactCauseLinkChoice: w5ImpactCauseLinkChoice,
      });

      await saveStep("w5", "w5_step7", {
  purpose: w5Card.purpose,
  intendedUsers: w5Card.intendedUsers,
  trainingData: w5Card.trainingData,
  limits: w5Card.limits,
  humanCheck: w5Card.humanCheck,
  reminder: w5Card.reminder,
  improve: w5Card.improve,
  cardDraftAutoFilled: w5CardDraftAutoFilled,
  cardEditedFields: w5CardEditedFields,
  cardEditedFieldCount: w5CardEditedFields.length,
});

      await saveSubmission(
        "w5",
        "model_card_lite",
        `用途：${w5Card.purpose}\n使用对象：${w5Card.intendedUsers}\n训练数据：${w5Card.trainingData}\n限制：${w5Card.limits}\n人类检查：${w5Card.humanCheck}\n提醒：${w5Card.reminder}\n改进：${w5Card.improve}`,
        {
          purpose: w5Card.purpose,
          intendedUsers: w5Card.intendedUsers,
          trainingData: w5Card.trainingData,
          limits: w5Card.limits,
          humanCheck: w5Card.humanCheck,
          reminder: w5Card.reminder,
          improve: w5Card.improve,
          cardDraftAutoFilled: w5CardDraftAutoFilled,
          cardEditedFields: w5CardEditedFields,
          cardEditedFieldCount: w5CardEditedFields.length,
          selectedTrainingImageItems,
          affectedStakeholders: w5AffectedStakeholders,
          unfairOutcomeIds: w5UnfairOutcomeIds,
          biasCauseLinkIds: w5BiasCauseLinkIds,
          biasMitigationIds: w5BiasMitigationIds,
          selectedReminderIds: w5Reminders,
          resourceTriageAllocation: w5ResourceTriageAllocation,
          resourceReasonTags: [],
          aiResourceUseChoice: w5AiResourceUseChoice,
          impactCauseLinkChoice: w5ImpactCauseLinkChoice,
          systemImprovementChoice: w5SystemImprovementChoice,
          systemComparisonChoiceByCase: w5SystemComparisonChoiceByCase,
          systemComparisonReasonTags: w5SystemComparisonReasonTags,
        }
      );
    }

    const scoreOk = await runScore();

    if (!scoreOk) {
      alert(
        locale === "en"
          ? "Your answers were saved, but scoring did not finish. Please wait and ask your teacher to re-score this session."
          : locale === "zh-Hant"
          ? "你的答案已保存，但評分暫時未完成。請稍後讓老師重新評分。"
          : "你的答案已保存，但评分暂时未完成。请稍后让老师重新评分。"
      );
      if (id === "w5") return;
    }

    if (id === "w5" && sessionId) {
      try {
        await postJson("/api/session/end", {
          sessionId,
          currentWorld: "w5",
          currentStep: "w5_done",
          status: "completed",
        });
      } catch (error) {
        console.error("session end failed", error);
        alert(
          locale === "en"
            ? "Scoring finished, but the final completion status was not saved. Please ask your teacher to refresh the report."
            : locale === "zh-Hant"
            ? "評分已完成，但最終完成狀態未能保存。請老師刷新報告。"
            : "评分已完成，但最终完成状态没有保存成功。请老师刷新报告。"
        );
        return;
      }
    }

    setCompleted((prev) => ({ ...prev, [id]: true }));
    setScreen("home");
  }


  // Progress
  const w3DesignElementCards = useMemo(
    () => w3DesignElementOptions.map((item) => ({ id: item.id, label: item.label })),
    [w3DesignElementOptions]
  );

  const w3AssetCards = useMemo(
    () => w3AssetOptions.map((item) => ({ id: item.id, label: item.label })),
    [w3AssetOptions]
  );

  const w3MechanismCards = useMemo(
    () => w3MechanismStatements.map((item) => ({ id: item.id, label: item.text })),
    [w3MechanismStatements]
  );

  const w4WorkflowCards = useMemo(() => {
  const noteById: Record<string, string> = {
    calculate_percentages:
      locale === "en"
        ? "Turn survey numbers into counts and percentages."
        : locale === "zh-Hant"
        ? "把調查數字整理成人數和比例。"
        : "把调查数字整理成人数和比例。",
    organize_key_points:
      locale === "en"
        ? "Organise the main findings into short points."
        : locale === "zh-Hant"
        ? "把主要發現整理成幾條重點。"
        : "把主要发现整理成几条重点。",
    generate_chart_title:
      locale === "en"
        ? "Draft a clear title for the chart."
        : locale === "zh-Hant"
        ? "幫圖表起一個清楚的標題。"
        : "帮图表起一个清楚的标题。",
    explain_common_pattern:
      locale === "en"
        ? "Explain what the most common travel pattern means."
        : locale === "zh-Hant"
        ? "解釋最常見的出行方式代表甚麼。"
        : "解释最常见的出行方式代表什么。",
    decide_final_suggestions:
      locale === "en"
        ? "Decide what suggestions should finally be sent to the school."
        : locale === "zh-Hant"
        ? "決定最後要給學校甚麼建議。"
        : "决定最后要给学校什么建议。",
    check_fairness_feasibility:
      locale === "en"
        ? "Check whether the suggestions are fair and doable."
        : locale === "zh-Hant"
        ? "檢查建議是否公平，也是否做得到。"
        : "检查建议是否公平，也是否做得到。",
    disclose_ai_use:
      locale === "en"
        ? "Tell readers which parts used AI help."
        : locale === "zh-Hant"
        ? "說明哪些地方用了 AI 幫忙。"
        : "说明哪些地方用了 AI 帮忙。",
    decide_what_to_send_school:
      locale === "en"
        ? "Choose the final message to submit to the school."
        : locale === "zh-Hant"
        ? "選擇最後提交給學校的內容。"
        : "选择最后提交给学校的内容。",
  };

  return w4TaskOptions.map((task) => ({
    id: task.id,
    label: task.label,
    note: noteById[task.id] ?? "",
  }));
}, [w4TaskOptions, locale]);

  const w5SystemCaseCards = useMemo(
    () => w5SystemComparisonCases.map((item) => ({ id: item.id, label: item.title })),
    [w5SystemComparisonCases]
  );

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
    if (w2RoleChoice && w2FinalDecisionBy) s += 25;
    if (w2DraftChoice) s += 25;
    if (w2ClaimsDone) s += 25;
    if (w2FinalReason.trim().length > 10) s += 25;
    return s;
  }, [w2RoleChoice, w2FinalDecisionBy, w2DraftChoice, w2ClaimsDone, w2FinalReason]);

  const p3 = useMemo(() => {
    let s = 0;
    if (w3Recipient) s += 14;
    if (w3Draft.trim().length > 20) s += 14;
    if (w3Chat.length > 0 && w3SuggestionUseStrategy && w3IdeaSupportTags.length > 0) s += 14;
    if (w3PresentationFormat && Object.keys(w3DesignElementAllocation).length >= 4 && w3PresentationReasonTags.length > 0) s += 15;
    if (
  w3AssetOptions.length > 0 &&
  w3AssetOptions.every((item) => !!w3AssetAllocation[item.id])
) {
  s += 14;
}
    if (Object.keys(w3MechanismSort).length >= 5) s += 15;
    if (w3FinalText.trim().length > 20) s += 16;
    return Math.min(100, s);
  }, [
    w3Recipient,
    w3Draft,
    w3Chat.length,
    w3SuggestionUseStrategy,
    w3IdeaSupportTags.length,
    w3PresentationFormat,
    w3DesignElementAllocation,
    w3PresentationReasonTags.length,
    w3AssetAllocation,
    w3KeptOwnSentence,
    w3MechanismSort,
    w3FinalText,
    w3HelpfulTags.length,
    w3LimitationTags.length,
    w3AssetOptions.length,
  ]);

  const p4 = useMemo(() => {
  let s = 20;

  if (Object.keys(w4WorkflowAllocation).length >= w4TaskOptions.length) s += 20;
  if (w4Role) s += 20;

  if (
    (w4Role === "no_ai_support" && w4NoAiReason.trim().length > 8) ||
    (w4Role !== "no_ai_support" && w4UseChoice)
  ) {
    s += 20;
  }

  if (w4Reminder.trim().length > 8) s += 15;
  if (w4Rules.length > 0) s += 5;

  return Math.min(100, s);
}, [
  w4WorkflowAllocation,
  w4TaskOptions.length,
  w4Role,
  w4NoAiReason,
  w4UseChoice,
  w4Rules.length,
  w4Reminder,
]);
  const p5 = useMemo(() => {
    let s = 0;
    if (w5Problem) s += 14;
    if (w5Cause && w5SystemImprovementChoice) s += 14;
    if (w5SystemComparisonChoiceByCase.crushed_paper_box) s += 11;
    if (w5SystemComparisonReasonTags.length > 0) s += 3;
    if (w5Training.length > 0) s += 14;
    if (w5UnfairOutcomeIds.length > 0 && w5BiasMitigationIds.length > 0) s += 15;
    if (Object.keys(w5ResourceTriageAllocation).length >= 3) s += 12;
    if (w5Reminders.length > 0) s += 3;
    if (
      w5Card.purpose.trim().length > 5 &&
      w5Card.intendedUsers.trim().length > 5 &&
      w5Card.trainingData.trim().length > 5 &&
      w5Card.limits.trim().length > 5 &&
      w5Card.humanCheck.trim().length > 5 &&
      w5Card.improve.trim().length > 5
    ) {
      s += 14;
    }
    return Math.min(100, s);
  }, [
    w5Problem,
    w5Cause,
    w5SystemImprovementChoice,
    w5SystemComparisonChoiceByCase,
    w5SystemComparisonReasonTags.length,
    w5Training.length,
    w5AffectedStakeholders.length,
    w5UnfairOutcomeIds.length,
    w5BiasMitigationIds.length,
    w5Reminders.length,
    w5ResourceTriageAllocation,
    w5ResourceReasonTags.length,
    w5Card,
  ]);

  function toggleListValue(
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function setW4WorkflowTask(
  taskId: string,
  value: "ai_auto" | "ai_assist_human_check" | "human_only"
) {
  setW4WorkflowAllocation((prev) => ({ ...prev, [taskId]: value }));

  // Maintain legacy aliases for current report/scoring compatibility.
  setW4AiTasks((prev) => {
    const without = prev.filter((id) => id !== taskId);
    return value === "ai_auto" || value === "ai_assist_human_check"
      ? [...without, taskId]
      : without;
  });
}

function setW5SystemComparison(
  caseId: string,
  choice: "rulebot" | "databot" | "both_need_human_check"
) {
  setW5SystemComparisonChoiceByCase((prev) => ({
    ...prev,
    [caseId]: choice,
  }));
}

function getW3RecipientIcon() {
  const id = String(w3Recipient || "");

  if (id.includes("teacher")) return "👩‍🏫";
  if (id.includes("elder") || id.includes("grand")) return "👵";
  if (id.includes("friend") || id.includes("classmate")) return "🧑‍🎓";
  if (id.includes("family") || id.includes("parent")) return "👨‍👩‍👧";

  return "😊";
}

function buildW3CreditNote() {
  const notes: string[] = [];
  const asset = w3AssetAllocation;

  if (asset.own_sentence === "use" || asset.own_sentence === "credit") {
    notes.push(
      locale === "en"
        ? "Text: the card keeps my own idea or wording."
        : locale === "zh-Hant"
        ? "文字：卡片保留了我自己的想法或說法。"
        : "文字：卡片保留了我自己的想法或说法。"
    );
  }

  if (asset.ai_background_image === "credit") {
    notes.push(
      locale === "en"
        ? "Image: AI-generated background image was used and checked."
        : locale === "zh-Hant"
        ? "圖片：使用了 AI 生成背景圖，並已檢查。"
        : "图片：使用了 AI 生成背景图，并已检查。"
    );
  }

  if (asset.free_source_icon === "credit") {
    notes.push(
      locale === "en"
        ? "Icon: free-to-use icon with source noted."
        : locale === "zh-Hant"
        ? "圖標：使用可授權素材，並註明來源。"
        : "图标：使用可授权素材，并注明来源。"
    );
  }

  if (asset.ai_person_image === "credit") {
    notes.push(
      locale === "en"
        ? "Person image: AI-generated person image, not a real photo."
        : locale === "zh-Hant"
        ? "人物圖：AI 生成，並非真實人物照片。"
        : "人物图：AI 生成，并非真实人物照片。"
    );
  }

  if (asset.web_cartoon_unknown_source === "avoid") {
    notes.push(
      locale === "en"
        ? "Not used: online cartoon image with unclear source."
        : locale === "zh-Hant"
        ? "未使用：來源不明的網絡卡通圖。"
        : "未使用：来源不明的网络卡通图。"
    );
  }

  if (asset.classmate_photo_without_permission === "avoid") {
    notes.push(
      locale === "en"
        ? "Not used: classmate photo without permission."
        : locale === "zh-Hant"
        ? "未使用：未經同意的同學照片。"
        : "未使用：未经同意的同学照片。"
    );
  }

  if (w3DisclosureChoiceId) {
    notes.push(
      locale === "en"
        ? "AI help is disclosed in the final card."
        : locale === "zh-Hant"
        ? "最終卡片會說明哪些地方用了 AI 幫助。"
        : "最终卡片会说明哪些地方用了 AI 帮助。"
    );
  }

  if (w3AttributionChoiceId) {
    notes.push(
      locale === "en"
        ? "Material sources are explained when needed."
        : locale === "zh-Hant"
        ? "需要時會說明素材來源。"
        : "需要时会说明素材来源。"
    );
  }

  return notes;
}

function setW3AssetDecision(assetId: string, value: "use" | "credit" | "avoid") {
  setW3AssetAllocation((prev) => ({ ...prev, [assetId]: value }));

  setW3SelectedAssetIds((prev) => {
    const without = prev.filter((id) => id !== assetId);
    return value === "use" || value === "credit" ? [...without, assetId] : without;
  });

  if (
  (assetId === "ai_background_image" || assetId === "ai_person_image") &&
  value === "credit"
) {
  setW3DisclosureChoiceId("state_ai_assisted");
}

if (assetId === "free_source_icon" && value === "credit") {
  setW3AttributionChoiceId("credit_free_icon");
}

if (value === "avoid") return;

if (
  !w3DisclosureChoiceId &&
  (assetId === "ai_background_image" || assetId === "ai_person_image")
) {
  setW3DisclosureChoiceId("state_ai_assisted");
}
}

function setW5ResourceTriage(
  taskId: string,
  value: "worth_using_ai" | "simple_method_first" | "ai_assist_human_check"
) {
  setW5ResourceTriageAllocation((prev) => ({ ...prev, [taskId]: value }));

  if (value === "simple_method_first") {
    setW5AiResourceUseChoice("simple_task_no_ai_resource");
  } else if (value === "worth_using_ai") {
    setW5AiResourceUseChoice("use_ai_when_task_complex");
  } else if (value === "ai_assist_human_check") {
    setW5AiResourceUseChoice("high_impact_needs_human_check");
  }

  const inferredReason =
    value === "worth_using_ai"
      ? "use_ai_when_task_complex"
      : value === "simple_method_first"
      ? "simple_task_no_ai_needed"
      : "high_impact_needs_human_check";

  setW5ResourceReasonTags((prev) =>
    prev.includes(inferredReason) ? prev : [...prev, inferredReason]
  );
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

  const selectedPromptTagLabels = w3PromptTagOptions
    .filter((tag) => w3PromptTags.includes(tag.id))
    .map((tag) => tag.label);

  const userText = buildW3VisibleUserMessage(locale, finalPrompt, selectedPromptTagLabels);
  const result = buildW3AiRewriteLocalized(
  locale,
  w3Recipient,
  w3Draft,
  w3PromptTags,
  finalPrompt
);
  const aiText =
    result.mode === "scaffold"
      ? result.note
      : locale === "en"
      ? `Revised version:\n${result.rewritten}\n\nWhat I changed:\n${result.note}`
      : `改写后的版本：\n${result.rewritten}\n\n我做了什么调整：\n${result.note}`;
setW3LastPromptText(finalPrompt);
setW3LastVisibleUserMessage(userText);
setW3LastAiReply(aiText);
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
  const world5Images =
  w5Problem && w5Problem in trainingImagesByCaseData
    ? trainingImagesByCaseData[w5Problem as keyof typeof trainingImagesByCaseData]
    : [];
    function getW5TrainingIcon(imageId: string) {
  if (["c1", "c3", "c5", "c6"].includes(imageId)) return "📦";
  if (imageId === "c2") return "▣";
  if (imageId === "c4") return "🪑";
  if (imageId === "c7") return "🧴";
  if (imageId === "c8") return "🌄";
  if (imageId.includes("l")) return "🌃";
  if (imageId.includes("s")) return "🥤";
  return "🖼️";
}
  function getW4TaskLabel(taskId: string) {
  const allOptions = [
    ...w4TaskOptions,
    ...w4HumanResponsibilityOptions,
    ...w4RuleOptions,
  ];

  const found = allOptions.find((item) => item.id === taskId);
  if (found) return found.label;

  const fallback: Record<string, string> = {
    explain_results:
      locale === "en"
        ? "Explain how the results were produced"
        : locale === "zh-Hant"
        ? "說明結果是怎樣得出的"
        : "说明结果是怎么来的",
    explain_ai_use:
      locale === "en"
        ? "Explain where AI was used"
        : locale === "zh-Hant"
        ? "說明哪裡使用了 AI"
        : "说明哪里用了 AI",
      
    explain_common_pattern:
      locale === "en"
        ? "Explain the common pattern in the results"
        : locale === "zh-Hant"
        ? "解釋結果中的共同模式"
        : "解释结果中的共同模式",
    check_fairness:
      locale === "en"
        ? "Check whether the suggestion is fair"
        : locale === "zh-Hant"
        ? "檢查建議是否公平"
        : "检查建议是否公平",
    check_fairness_feasibility:
      locale === "en"
        ? "Check whether the suggestion is fair and feasible"
        : locale === "zh-Hant"
        ? "檢查建議是否公平、可行"
        : "检查建议是否公平、可行",
    disclose_ai_use:
      locale === "en"
        ? "Disclose where AI was used"
        : locale === "zh-Hant"
        ? "說明哪些地方用了 AI"
        : "说明哪些地方用了 AI",
    organize_key_points:
      locale === "en"
        ? "Organise key points"
        : locale === "zh-Hant"
        ? "整理重點"
        : "整理重点",
    calculate_percentages:
      locale === "en"
        ? "Calculate numbers and percentages"
        : locale === "zh-Hant"
        ? "計算人數和比例"
        : "计算人数和比例",
  };

  return fallback[taskId] ?? taskId;
}

function getW4ColumnLabel(columnId: string) {
  if (columnId === "ai_auto") {
    return locale === "en"
      ? "AI can do first"
      : locale === "zh-Hant"
      ? "AI 可以先做"
      : "AI 可以先做";
  }
  if (columnId === "ai_assist_human_check") {
    return locale === "en"
      ? "AI helps, we check"
      : locale === "zh-Hant"
      ? "AI 幫忙，我們檢查"
      : "AI 帮忙，我们检查";
  }
  if (columnId === "human_only") {
    return locale === "en"
      ? "People decide"
      : locale === "zh-Hant"
      ? "由人來決定"
      : "由人来决定";
  }
  return columnId;
}
  const selectedW4RoleOutput =
  w4Role === "data" || w4Role === "summary" || w4Role === "draft"
    ? roleOutputsData[w4Role]
    : null;
  
    const selectedW5Case =
  w5Problem && w5Problem in recycleCasesData
    ? recycleCasesData[w5Problem as keyof typeof recycleCasesData]
    : null;
function labelFromOptions(
  id: string,
  options: ReadonlyArray<{ id: string; label: string }>
) {
  return options.find((item) => item.id === id)?.label ?? "";
}

function labelsFromOptions(
  ids: string[],
  options: ReadonlyArray<{ id: string; label: string }>
) {
  return ids
    .map((id) => labelFromOptions(id, options))
    .filter(Boolean);
}
function toggleW5Cause(id: string) {
  const next = w5CauseIds.includes(id)
    ? w5CauseIds.filter((item) => item !== id)
    : [...w5CauseIds, id];

  setW5CauseIds(next);

  const preferredOrder = ["data", "similar", "rule", "speed"];
  const primary = preferredOrder.find((item) => next.includes(item)) ?? "";
  setW5Cause(primary);
}
function deriveW5BiasCauseLinkIds(causeId: string) {
  if (causeId === "data") {
    return ["training_data_lacks_shape_variation"];
  }

  if (causeId === "similar") {
    return ["visual_features_too_similar"];
  }

  if (causeId === "rule") {
    return ["rule_boundary_unclear"];
  }

  return [];
}
function buildW5CardDraft() {
  const caseTitle =
    selectedW5Case?.title ||
    (locale === "en"
      ? "the selected recycling case"
      : locale === "zh-Hant"
      ? "你選擇的垃圾分類案例"
      : "你选择的垃圾分类案例");

  const causeText = labelFromOptions(w5Cause, w5CauseOptions);
  const improvementText = labelFromOptions(
    w5SystemImprovementChoice,
    w5SystemImprovementOptions
  );

  const selectedImageTitles = world5Images
    .filter((img) => w5Training.includes(img.id))
    .map((img) => img.title);

  const affectedLabels = labelsFromOptions(
  w5AffectedStakeholders,
  w5AffectedOptions
);

  const unfairLabels = labelsFromOptions(
    w5UnfairOutcomeIds,
    w5UnfairOutcomeOptions
  );

const effectiveBiasCauseLinkIds = w5BiasCauseLinkIds.length
  ? w5BiasCauseLinkIds
  : deriveW5BiasCauseLinkIds(w5Cause);

const causeLabels = labelsFromOptions(
  effectiveBiasCauseLinkIds,
  w5BiasCauseOptions
);

  const mitigationLabels = labelsFromOptions(
    w5BiasMitigationIds,
    w5BiasMitigationOptions
  );

  const reminderLabels = labelsFromOptions(w5Reminders, w5ReminderOptions);

  const triageValues = Object.values(w5ResourceTriageAllocation);
  const hasHumanCheckTask = triageValues.includes("ai_assist_human_check");

  return {
    purpose:
      locale === "en"
        ? "This AI system helps the school sort recycling items more consistently."
        : locale === "zh-Hant"
        ? "這個 AI 系統用來幫學校更穩定地分類回收物品。"
        : "这个 AI 系统用来帮学校更稳定地分类回收物品。",

    intendedUsers:
      locale === "en"
        ? "Students, teachers, and cleaning or recycling staff may use this system."
        : locale === "zh-Hant"
        ? "學生、老師，以及清潔或回收工作人員可能會使用這個系統。"
        : "学生、老师，以及清洁或回收工作人员可能会使用这个系统。",

    trainingData:
      selectedImageTitles.length
        ? locale === "en"
          ? `It needs varied examples such as ${selectedImageTitles.join(", ")}.`
          : locale === "zh-Hant"
          ? `它需要更多不同情況的例子，例如：${selectedImageTitles.join("、")}。`
          : `它需要更多不同情况的例子，例如：${selectedImageTitles.join("、")}。`
        : locale === "en"
        ? `It needs more varied examples related to ${caseTitle}.`
        : locale === "zh-Hant"
        ? `它需要更多和「${caseTitle}」有關的不同例子。`
        : `它需要更多和“${caseTitle}”有关的不同例子。`,

    limits:
      locale === "en"
        ? `It may still make mistakes in cases like ${caseTitle}${causeText ? ` because ${causeText}` : ""}.`
        : locale === "zh-Hant"
        ? `它在「${caseTitle}」這類情況下仍可能出錯${causeText ? `，因為${causeText}` : ""}。`
        : `它在“${caseTitle}”这类情况下仍可能出错${causeText ? `，因为${causeText}` : ""}。`,

    humanCheck:
      hasHumanCheckTask || w5Reminders.length > 0
        ? locale === "en"
          ? "People should check uncertain or high-impact results before acting on them."
          : locale === "zh-Hant"
          ? "遇到不確定或會影響別人的結果時，應該由人再檢查。"
          : "遇到不确定或会影响别人的结果时，应该由人再检查。"
        : locale === "en"
        ? "People should still check unclear cases before using the result."
        : locale === "zh-Hant"
        ? "遇到不清楚的情況時，仍然應該由人檢查。"
        : "遇到不清楚的情况时，仍然应该由人检查。",

    reminder:
      reminderLabels.length
        ? reminderLabels.join(locale === "en" ? "; " : "；")
        : locale === "en"
        ? "Do not treat the AI result as always correct."
        : locale === "zh-Hant"
        ? "不要把 AI 的結果當成一定正確。"
        : "不要把 AI 的结果当成一定正确。",

    improve:
      mitigationLabels.length || improvementText
        ? locale === "en"
          ? `Next, improve it by ${[
              improvementText,
              ...mitigationLabels,
            ]
              .filter(Boolean)
              .join("; ")}.`
          : locale === "zh-Hant"
          ? `下一步可以這樣改進：${[
              improvementText,
              ...mitigationLabels,
            ]
              .filter(Boolean)
              .join("；")}。`
          : `下一步可以这样改进：${[
              improvementText,
              ...mitigationLabels,
            ]
              .filter(Boolean)
              .join("；")}。`
        : locale === "en"
        ? "Next, add better examples, explain limits, and keep human checking."
        : locale === "zh-Hant"
        ? "下一步可以補充更好的例子、說明限制，並保留人的檢查。"
        : "下一步可以补充更好的例子、说明限制，并保留人的检查。",
  };
}
function markW5CardEdited(field: string) {
  setW5CardEditedFields((prev) =>
    prev.includes(field) ? prev : [...prev, field]
  );
}
function fillW5CardDraft(overwrite = false) {
  const draft = buildW5CardDraft();
  setW5CardDraftAutoFilled(true);

  setW5Card((prev) => ({
    purpose: overwrite || !prev.purpose.trim() ? draft.purpose : prev.purpose,
    intendedUsers:
      overwrite || !prev.intendedUsers.trim()
        ? draft.intendedUsers
        : prev.intendedUsers,
    trainingData:
      overwrite || !prev.trainingData.trim()
        ? draft.trainingData
        : prev.trainingData,
    limits: overwrite || !prev.limits.trim() ? draft.limits : prev.limits,
    humanCheck:
      overwrite || !prev.humanCheck.trim() ? draft.humanCheck : prev.humanCheck,
    reminder: overwrite || !prev.reminder.trim() ? draft.reminder : prev.reminder,
    improve: overwrite || !prev.improve.trim() ? draft.improve : prev.improve,
  }));
}

useEffect(() => {
  if (w5Step === 6) {
    fillW5CardDraft(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [w5Step]);

const w3HasAiLayout = w3SelectedDesignElementIds.includes("ai_layout");
const w3HasAiImage = w3SelectedDesignElementIds.includes("ai_image");
const w3HasRecipientIcon = w3SelectedDesignElementIds.includes("recipient_icon");

const w3RecipientKey = String(w3Recipient || "");
const w3RecipientIcon = w3RecipientKey.includes("teacher")
  ? "👩‍🏫"
  : w3RecipientKey.includes("elder") || w3RecipientKey.includes("grand")
  ? "👵"
  : w3RecipientKey.includes("friend") || w3RecipientKey.includes("classmate")
  ? "🧑‍🎓"
  : w3RecipientKey.includes("family") || w3RecipientKey.includes("parent")
  ? "👨‍👩‍👧"
  : "😊";
const w3CreditNotes = buildW3CreditNote();
const W3_FORMAT_ELEMENT_IDS: Record<string, string[]> = {
  text_card: ["own_sentence", "ai_warm_title", "recipient_icon"],
  poster: ["own_sentence", "ai_warm_title", "ai_image", "ai_layout"],
  comic_sticker: ["own_sentence", "ai_warm_title", "recipient_icon", "ai_image", "ai_layout"],
};

const W3_REQUIRED_ELEMENT_IDS: Record<string, string[]> = {
  text_card: ["own_sentence"],
  poster: ["own_sentence"],
  comic_sticker: ["own_sentence"],
};

function getW3VisibleDesignElementOptions() {
  const allowedIds = W3_FORMAT_ELEMENT_IDS[w3PresentationFormat] ?? [];
  return w3DesignElementOptions.filter((item) => allowedIds.includes(item.id));
}

function applyW3PresentationFormat(formatId: string) {
  const allowedIds = W3_FORMAT_ELEMENT_IDS[formatId] ?? [];
  const requiredIds = W3_REQUIRED_ELEMENT_IDS[formatId] ?? ["own_sentence"];

  setW3ComparedFormatIds((prev) =>
    prev.includes(formatId) ? prev : [...prev, formatId]
  );

  setW3PresentationFormat(formatId);

  const nextAllocation: Record<string, "use" | "reject" | ""> = {};

  w3DesignElementOptions.forEach((item) => {
    if (requiredIds.includes(item.id)) {
      nextAllocation[item.id] = "use";
    } else if (!allowedIds.includes(item.id)) {
      nextAllocation[item.id] = "reject";
    } else {
      nextAllocation[item.id] = "";
    }
  });

  setW3DesignElementAllocation(nextAllocation);
  setW3SelectedDesignElementIds(requiredIds);
  setW3RejectedElementIds(
    w3DesignElementOptions
      .filter((item) => !allowedIds.includes(item.id))
      .map((item) => item.id)
  );
}

return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_24%),linear-gradient(to_bottom_right,_#f8fafc,_#ffffff,_#eef2ff)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <div className="flex flex-wrap items-center gap-2">
    <Link
      href="/teacher"
      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
    >
      {locale === "en"
        ? "Teacher Portal"
        : locale === "zh-Hant"
        ? "教師端"
        : "教师端"}
    </Link>

    {sessionId ? (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
        <span className="font-medium">
          {identity.studentName ||
            (locale === "en" ? "Student" : locale === "zh-Hant" ? "學生" : "学生")}
        </span>
        <span>{identity.studentCode}</span>
        <span>{sessionCode}</span>
      </div>
    ) : null}
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
                    <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-5">
  <div className="flex gap-3">
    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
      <Sparkles className="h-5 w-5" />
    </div>

    <div>
      <h3 className="text-base font-semibold text-slate-900">
        {studentEntryText[locale].introTitle}
      </h3>

      <ul className="mt-3 space-y-2">
        {studentEntryText[locale].introPoints.map((point) => (
          <li key={point} className="flex gap-2 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {learningCardsByModeData.personal.map((card) => {
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
                              {opened && (
  <Pill tone="light">
    {locale === "en"
      ? "Viewed"
      : locale === "zh-Hant"
      ? "已查看"
      : "已查看"}
  </Pill>
)}
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
                  title={
  locale === "en"
    ? "Try another recommendation mode and see whether the results change"
    : locale === "zh-Hant"
    ? "換一種推薦方式，看看結果會否改變"
    : "换一种推荐方式，看看结果会不会变"
}
description={
  locale === "en"
    ? "Use the tabs above to switch modes. View at least two modes first, then answer the two questions below."
    : locale === "zh-Hant"
    ? "點上面的標籤切換模式。先至少看過兩種模式，再回答下面兩個問題。"
    : "点上面的标签切换模式。先至少看过两种模式，再回答下面两个问题。"
}
                >
                  <div className="flex flex-wrap gap-2">
  {w1ModeOptions.map((item) => (
    <TagButton
      key={item.id}
      active={w1Mode === item.id}
      onClick={() =>
        onChangeWorld1Mode(item.id as "personal" | "popular" | "explore")
      }
    >
      {item.label}
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
                      <div className="mb-3 text-sm font-medium text-slate-700">{locale === "en"
  ? "Which mode do you think helps your learning most?"
  : locale === "zh-Hant"
  ? "你覺得哪一種最能幫助你學習？"
  : "你觉得哪一种最能帮你学习？"}</div>
                      <div className="flex flex-wrap gap-2">
                       {w1ModeOptions.map((item) => (
  <TagButton
    key={item.id}
    active={w1BestMode === item.id}
    onClick={() => setW1BestMode(item.id)}
  >
    {item.label}
  </TagButton>
))}
                      </div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <div className="mb-3 text-sm font-medium text-slate-700">{locale === "en"
  ? "Which mode is most likely to become too narrow?"
  : locale === "zh-Hant"
  ? "你覺得哪一種最可能愈推愈窄？"
  : "你觉得哪一种最可能越推越窄？"}</div>
                      <div className="flex flex-wrap gap-2">
                        {w1ModeOptions.map((item) => (
  <TagButton
    key={item.id}
    active={w1NarrowMode === item.id}
    onClick={() => setW1NarrowMode(item.id)}
  >
    {item.label}
  </TagButton>
))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 text-sm font-medium text-slate-700">
                        {locale === "en" ? "Why might this mode help learning?" : locale === "zh-Hant" ? "為什麼它可能幫助學習？" : "为什么它可能帮助学习？"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {w1HelpfulReasonOptions.map((item) => (
                          <TagButton
                            key={item.id}
                            active={w1HelpfulReasonTags.includes(item.id)}
                            onClick={() => toggleValue(item.id, w1HelpfulReasonTags, setW1HelpfulReasonTags)}
                          >
                            {item.label}
                          </TagButton>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 text-sm font-medium text-slate-700">
                        {locale === "en" ? "Why might this mode become too narrow?" : locale === "zh-Hant" ? "為什麼它可能越推越窄？" : "为什么它可能越推越窄？"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {w1NarrowReasonOptions.map((item) => (
                          <TagButton
                            key={item.id}
                            active={w1NarrowReasonTags.includes(item.id)}
                            onClick={() => toggleValue(item.id, w1NarrowReasonTags, setW1NarrowReasonTags)}
                          >
                            {item.label}
                          </TagButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {w1Step === 2 && (
                <Section
                  title={
  locale === "en"
    ? "If this system were used across the school, what rules would you add?"
    : locale === "zh-Hant"
    ? "如果這個系統要給全校學生使用，你會加上哪些守則？"
    : "如果这个系统要给全校学生用，你会给它加哪些守则？"
}
description={
  locale === "en"
    ? "Choose the system rules you think should be kept. The settings card on the right will update as you choose."
    : locale === "zh-Hant"
    ? "點一下你認為應該保留的系統守則。右邊的設定卡會同步更新。"
    : "点一下你觉得应该保留的系统守则。页面右边会实时更新系统状态。"
}
                >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <div className="space-y-3">
                      {w1RuleOptions.map(({ key, label }) => (
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
  <div className="mb-3 flex items-center justify-between gap-3">
    <div>
      <div className="text-sm font-semibold text-slate-800">
        {locale === "en" ? "My recommendation settings card" : locale === "zh-Hant" ? "我的推薦設定卡" : "我的推荐设置卡"}
      </div>
      <div className="mt-1 text-xs text-slate-500">
        {locale === "en" ? "This card updates as you choose system rules." : locale === "zh-Hant" ? "你選擇守則時，這張卡會同步更新。" : "你选择守则时，这张卡会同步更新。"}
      </div>
    </div>
    <Pill tone="outline">{locale === "en" ? "Preview" : locale === "zh-Hant" ? "預覽" : "预览"}</Pill>
  </div>

  <div className="space-y-3 text-sm leading-7 text-slate-600">
    <div className="flex items-center justify-between rounded-2xl bg-white p-3">
      <span>🔍 {locale === "en" ? "Recommendation reason" : locale === "zh-Hant" ? "推薦原因" : "推荐原因"}</span>
      <span className="font-medium text-slate-800">{w1Rules.explainReason ? (locale === "en" ? "Shown" : "会显示") : (locale === "en" ? "Hidden" : "不显示")}</span>
    </div>
    <div className="flex items-center justify-between rounded-2xl bg-white p-3">
      <span>🧑‍🏫 {locale === "en" ? "Teacher review" : locale === "zh-Hant" ? "老師審核" : "老师审核"}</span>
      <span className="font-medium text-slate-800">{w1Rules.teacherReview ? (locale === "en" ? "Allowed" : "可以调整") : (locale === "en" ? "Not set" : "没有设置")}</span>
    </div>
    <div className="flex items-center justify-between rounded-2xl bg-white p-3">
      <span>🧭 {locale === "en" ? "Explore new content" : locale === "zh-Hant" ? "探索新內容" : "探索新内容"}</span>
      <span className="font-medium text-slate-800">{w1Rules.tryNewThings ? (locale === "en" ? "On" : "打开") : (locale === "en" ? "Off" : "关闭")}</span>
    </div>
    <div className="flex items-center justify-between rounded-2xl bg-white p-3">
      <span>📌 {locale === "en" ? "Data use note" : locale === "zh-Hant" ? "資料使用說明" : "学习记录说明"}</span>
      <span className="font-medium text-slate-800">{w1Rules.sayWhatDataUsed ? (locale === "en" ? "Shown" : "会说明") : (locale === "en" ? "Hidden" : "不说明")}</span>
    </div>
           <div className="flex items-center justify-between rounded-2xl bg-white p-3">
  <span>
    🔥{" "}
    {locale === "en"
      ? "Popular-only mode"
      : locale === "zh-Hant"
      ? "只推熱門"
      : "只推热门"}
  </span>
  <span className="font-medium text-slate-800">
    {w1Rules.onlyPopular
      ? locale === "en"
        ? "On"
        : locale === "zh-Hant"
        ? "已開啟"
        : "已开启"
      : locale === "en"
      ? "Off"
      : locale === "zh-Hant"
      ? "未開啟"
      : "未开启"}
  </span>
</div>
  </div>
</div>
</div>

                </Section>
              )}

              {w1Step === 3 && (
                <Section
                  title={
  locale === "en"
    ? "Submit your feedback card"
    : locale === "zh-Hant"
    ? "提交測試回饋卡"
    : "提交测试反馈卡"
}
description={
  locale === "en"
    ? "Write two short parts: What was most helpful about this system? What would you most want the teacher to notice?"
    : locale === "zh-Hant"
    ? "請寫兩小段：這個系統最有幫助的地方是甚麼？你最想提醒老師注意甚麼？"
    : "请写两小段：这个系统最有帮助的地方是什么？你最想提醒老师注意什么？"
}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <textarea
  value={w1Good}
  onChange={(e) => setW1Good(e.target.value)}
  className="min-h-[220px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
  placeholder={
    locale === "en"
      ? "Write one sentence, at least 10 words: What was most helpful about this system?"
      : locale === "zh-Hant"
      ? "請寫 1 句，至少 10 個字：這個系統最有幫助的地方是……"
      : "请写 1 句，至少 10 个字：这个系统最有帮助的地方是……"
  }
/>
                    <textarea
  value={w1Warn}
  onChange={(e) => setW1Warn(e.target.value)}
  className="min-h-[220px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
  placeholder={
    locale === "en"
      ? "Write one sentence, at least 10 words: What would you remind the teacher to notice?"
      : locale === "zh-Hant"
      ? "請寫 1 句，至少 10 個字：我最想提醒老師注意……"
      : "请写 1 句，至少 10 个字：我最想提醒老师注意……"
  }
/>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      disabled={!(w1Good.trim().length > 8 && w1Warn.trim().length > 8)}
                      onClick={() => finishWorld("w1")}
                    >
                      {locale === "en"
  ? "Submit feedback"
  : locale === "zh-Hant"
  ? "提交測試回饋"
  : "提交测试反馈"}
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
                        <User className="h-4 w-4" /> {tr(locale, "我的输入")}
                      </div>
                      <div className="rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
                        {locale === "en"
  ? "Please organise the key points about plastic pollution and write a short explanation suitable for secondary students."
  : locale === "zh-Hant"
  ? "請幫我整理關於塑膠污染的重點，寫成適合中學生看的短說明。"
  : "请帮我整理关于塑料污染的重点，写成适合中学生看的短说明。"}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Bot className="h-4 w-4" /> {tr(locale, "AI 输出")}
                      </div>
                      <div className="space-y-3">
                        {(
  locale === "en"
    ? [
        "Plastic pollution can harm the ocean environment.",
        "Microplastics may affect marine life.",
        "Reducing single-use plastic matters.",
        "Schools can help by using fewer single-use plastics.",
      ]
    : locale === "zh-Hant"
    ? [
        "塑膠污染會影響海洋環境。",
        "塑膠微粒可能影響海洋生物。",
        "減少一次性塑膠很重要。",
        "學校少用一次性塑膠可以幫助改善問題。",
      ]
    : [
        "塑料污染会影响海洋环境。",
        "塑料微粒可能影响海洋生物。",
        "减少一次性塑料很重要。",
        "学校少用一次性塑料可以帮助改善问题。",
      ]
).map((item) => (
                          <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                    <div className="mb-3 text-sm font-medium text-slate-700">
                      {locale === "en"
  ? "What is this AI mainly helping you do right now?"
  : locale === "zh-Hant"
  ? "這個 AI 現在主要在幫你完成哪一步？"
  : "这个 AI 现在主要在帮你完成哪一步？"}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <OptionCard
                        icon={Feather}
                        title={
  locale === "en"
    ? "Organise information and draft an explanation"
    : locale === "zh-Hant"
    ? "整理資料並生成說明草稿"
    : "整理资料并生成说明草稿"
}
note={
  locale === "en"
    ? "It is turning information into a draft that can still be revised."
    : locale === "zh-Hant"
    ? "它正在把資料變成可以繼續修改的草稿。"
    : "它正在把资料变成适合继续修改的草稿。"
}
                        selected={w2RoleChoice === "draft"}
                        onClick={() => setW2RoleChoice("draft")}
                      />
                      <OptionCard
                        icon={Brain}
                       title={
  locale === "en"
    ? "Make the final decision for the teacher"
    : locale === "zh-Hant"
    ? "直接替老師做最後判斷"
    : "直接替老师做最后判断"
}
note={
  locale === "en"
    ? "It has already decided whether the content can be published."
    : locale === "zh-Hant"
    ? "它已經替你決定最後能不能發布。"
    : "它已经替你决定最后能不能发布。"
}
                        selected={w2RoleChoice === "final"}
                        onClick={() => setW2RoleChoice("final")}
                      />
                      <OptionCard
                        icon={Sparkles}
                        title={
  locale === "en"
    ? "Only make the page look nicer"
    : locale === "zh-Hant"
    ? "只是把頁面變好看"
    : "只是把页面变好看"
}
note={
  locale === "en"
    ? "It is not really processing the content."
    : locale === "zh-Hant"
    ? "它沒有真的在處理內容。"
    : "它没有真的在处理内容。"
}
                        selected={w2RoleChoice === "beauty"}
                        onClick={() => setW2RoleChoice("beauty")}
                      />
                      <OptionCard
                        icon={ClipboardList}
                        title={
  locale === "en"
    ? "Help schedule activity dates"
    : locale === "zh-Hant"
    ? "幫你安排活動日期"
    : "帮你安排活动日期"
}
note={
  locale === "en"
    ? "It is mainly doing administrative scheduling."
    : locale === "zh-Hant"
    ? "它主要在做行政排程。"
    : "它主要在做行政排程。"
}
                        selected={w2RoleChoice === "admin"}
                        onClick={() => setW2RoleChoice("admin")}
                      />
                    </div>
                  </div>

                    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 text-sm font-medium text-slate-700">
                        {locale === "en" ? "Before publishing, who should make the final decision?" : locale === "zh-Hant" ? "發布前，最後應該由誰來決定？" : "发布前，最后应该由谁来决定？"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {w2FinalDecisionOptions.map((item) => (
                          <TagButton
                            key={item.id}
                            active={w2FinalDecisionBy === item.id}
                            onClick={() => setW2FinalDecisionBy(item.id as "student_group" | "teacher" | "ai")}
                          >
                            {item.label}
                          </TagButton>
                        ))}
                      </div>
                    </div>
                </Section>
              )}

              {w2Step === 1 && (
                <Section
                  title={
  locale === "en"
    ? "AI gave you two drafts. Choose the one that is better for further revision."
    : locale === "zh-Hant"
    ? "AI 給了你兩版草稿，先選一個更適合繼續修改的版本"
    : "AI 给了你两版草稿，先选一个更适合继续修改的版本"
}
description={
  locale === "en"
    ? "This is not about choosing a perfect answer. Choose the draft that is more suitable for further checking and improvement."
    : locale === "zh-Hant"
    ? "這裡不是選「絕對正確答案」，而是選一個更適合繼續加工的資訊草稿。"
    : "这里不是选‘绝对正确答案’，而是选一个更适合继续加工的信息草稿。"
}
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
                            {selected && (
  <Pill tone="light">
    {locale === "en"
      ? "Revise this one"
      : locale === "zh-Hant"
      ? "繼續修改這個"
      : "继续修改这个"}
  </Pill>
)}
                          </div>
                          <div className="text-base leading-8">{draft.text}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 text-sm font-medium text-slate-700">
                      {locale === "en" ? "Why did you choose this draft?" : locale === "zh-Hant" ? "你為什麼選這個草稿？" : "你为什么选这个草稿？"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {w2DraftReasonOptions.map((item) => (
                        <TagButton
                          key={item.id}
                          active={w2DraftReasonTags.includes(item.id)}
                          onClick={() => toggleValue(item.id, w2DraftReasonTags, setW2DraftReasonTags)}
                        >
                          {item.label}
                        </TagButton>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {w2Step === 2 && selectedDraft && (
                <Section
                  title={
  locale === "en"
    ? "Check before publishing: what can stay, and what still needs checking?"
    : locale === "zh-Hant"
    ? "發布前檢查：哪句可以保留，哪句要再查一下？"
    : "发布前检查：哪句可以保留，哪句要再查一下？"
}
description={
  locale === "en"
    ? "This information card will be shared with the whole school, so uncertain claims should not be published directly. Choose one status for each sentence."
    : locale === "zh-Hant"
    ? "這張資訊卡是要發給全校同學看的，所以不能把不確定的話直接發出去。每一句都選一種狀態。"
    : "这张信息卡是要发给全校同学看的，所以不能把不确定的话直接发出去。每一句都选一种状态。"
}
                >
                  <div className="mb-3 text-sm text-slate-500">
  {locale === "en"
    ? "The draft you selected:"
    : locale === "zh-Hant"
    ? "你剛才選中的草稿："
    : "你刚才选中的草稿："}{" "}
  {selectedDraft.title}
</div>
                  <div className="space-y-4">
                    {selectedDraft.claims.map((claim) => (
                      <div key={claim} className="rounded-3xl border border-slate-200 p-4">
                        <div className="mb-3 text-sm leading-7 text-slate-700">{claim}</div>
                        <div className="flex flex-wrap gap-2">
                          <TagButton
                            active={w2ClaimStatus[claim] === "keep"}
                            onClick={() => setW2ClaimStatus((prev) => ({ ...prev, [claim]: "keep" }))}
                          >
                            {locale === "en"
  ? "Can keep"
  : locale === "zh-Hant"
  ? "可以保留"
  : "可以保留"}
                          </TagButton>
                          <TagButton
                            active={w2ClaimStatus[claim] === "check"}
                            onClick={() => setW2ClaimStatus((prev) => ({ ...prev, [claim]: "check" }))}
                          >
                            {locale === "en"
  ? "Check again"
  : locale === "zh-Hant"
  ? "要再查一下"
  : "要再查一下"}
                          </TagButton>
                          <TagButton
                            active={w2ClaimStatus[claim] === "remove"}
                            onClick={() => setW2ClaimStatus((prev) => ({ ...prev, [claim]: "remove" }))}
                          >
                            {locale === "en"
  ? "Do not publish directly"
  : locale === "zh-Hant"
  ? "不能直接發"
  : "不能直接发"}
                          </TagButton>
                        </div>
                      </div>
                    ))}
                  </div>     
                  <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div className="text-sm font-semibold text-slate-800">
        {locale === "en"
  ? "How else would you confirm it?"
  : locale === "zh-Hant"
  ? "發布前，你還想怎樣確認？"
  : "发布前，你还想怎样确认？"}
        </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        {locale === "en"
  ? "Before sharing the card, you can choose one more way to check uncertain information."
  : locale === "zh-Hant"
  ? "如果有些內容不太確定，發布前可以再選一種確認方法。"
  : "如果有些内容不太确定，发布前可以再选一种确认方法。"}
      </p>
    </div>
    <Button
      variant="secondary"
      onClick={() => setW2SourceCheckViewed((prev) => !prev)}
    >
      {w2SourceCheckViewed
  ? locale === "en"
    ? "Hide choices"
    : locale === "zh-Hant"
    ? "收起確認方法"
    : "收起确认方法"
  : locale === "en"
  ? "Show choices"
  : locale === "zh-Hant"
  ? "看看確認方法"
  : "看看确认方法"}
    </Button>
  </div>

  {w2SourceCheckViewed && (
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {[
  {
    id: "trusted_source",
    label:
      locale === "en"
        ? "Check a school source or reliable webpage"
        : locale === "zh-Hant"
        ? "查學校資料或可靠網頁"
        : "查学校资料或可靠网页",
    icon: "📚",
  },
  {
    id: "ask_teacher",
    label:
      locale === "en"
        ? "Ask a teacher or classmate to confirm"
        : locale === "zh-Hant"
        ? "請老師或同學幫忙確認"
        : "请老师或同学帮忙确认",
    icon: "👥",
  },
  {
    id: "ai_only",
    label:
      locale === "en"
        ? "Only read the AI draft again"
        : locale === "zh-Hant"
        ? "只再看 AI 草稿"
        : "只再看 AI 草稿",
    icon: "🤖",
  },
].map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setW2SourceCheckChoice(item.id as "trusted_source" | "ask_teacher" | "ai_only")}
          className={cn(
            "rounded-2xl border p-3 text-left text-sm transition",
            w2SourceCheckChoice === item.id
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
          )}
        >
          <div className="mb-2 text-2xl">{item.icon}</div>
          {item.label}
        </button>
      ))}
    </div>
  )}
</div>
  
                </Section>
              )}

              {w2Step === 3 && selectedDraft && (
                <Section
                  title={
  locale === "en"
    ? "Submit the final information card"
    : locale === "zh-Hant"
    ? "交出最後可發布的資訊卡"
    : "交出最终可发布的信息卡"
}
description={
  locale === "en"
    ? "Review what you decided to keep or check, then write one short explanation."
    : locale === "zh-Hant"
    ? "看看你決定保留甚麼、要處理甚麼，再寫一句說明。"
    : "看看你决定保留什么、要处理什么，再写一句说明。"
}
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
                      <div className="mb-3 text-sm font-medium text-amber-700">{locale === "en"
  ? "Content I decided to remove or check again"
  : locale === "zh-Hant"
  ? "我決定刪掉或再查一下的內容"
  : "我决定删掉或再查一下的内容"}</div>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        {selectedDraft.claims
                          .filter((claim) => w2ClaimStatus[claim] !== "keep")
                          .map((claim) => (
                            <div key={claim}>• {claim}</div>
                          ))}
                        {selectedDraft.claims.filter((claim) => w2ClaimStatus[claim] !== "keep").length === 0 && (
                          <div>{locale === "en"
  ? "Nothing yet."
  : locale === "zh-Hant"
  ? "暫時還沒有。"
  : "暂时还没有。"}。</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <textarea
                    value={w2FinalReason}
                    onChange={(e) => setW2FinalReason(e.target.value)}
                    className="mt-4 min-h-[180px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                    placeholder={
  locale === "en"
    ? "Write 1–2 sentences, at least 12 words: Why did you keep, revise, or remove these parts?"
    : locale === "zh-Hant"
    ? "請寫 1–2 句，至少 12 個字：你為甚麼這樣保留、修改或刪除？"
    : "请写 1–2 句，至少 12 个字：你为什么这样保留、修改或删除？"
}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button
                      disabled={!(w2FinalReason.trim().length > 10)}
                      onClick={() => finishWorld("w2")}
                    >
                      {locale === "en"
  ? "Submit this information card"
  : locale === "zh-Hant"
  ? "提交這張資訊卡"
  : "提交这张信息卡"}
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
                subtitle={
  locale === "en"
    ? "Make a warm card with AI help. Start with your own words, choose a card style, check the images, and decide what to send."
    : locale === "zh-Hant"
    ? "和 AI 一起做一張溫暖卡片。先寫自己的話，再選卡片樣式、檢查圖片，最後決定要不要發送。"
    : "和 AI 一起做一张温暖卡片。先写自己的话，再选卡片样式、检查图片，最后决定要不要发送。"
}
                badge={tr(locale, "世界3")}
                color={worldMeta.w3.color}
                icon={worldMeta.w3.icon}
                progress={p3}
                steps={
  locale === "en"
    ? [
        "1. Choose someone",
        "2. Write my words",
        "3. Ask AI to help",
        "4. Choose a card style",
        "5. Check images and credit",
        "6. Does AI really understand?",
        "7. Check before sending",
      ]
    : locale === "zh-Hant"
    ? [
        "1. 選對象",
        "2. 寫自己的話",
        "3. 請 AI 幫忙",
        "4. 選卡片樣式",
        "5. 檢查圖片和署名",
        "6. AI 真的懂我嗎？",
        "7. 發送前檢查",
      ]
    : [
        "1. 选对象",
        "2. 写自己的话",
        "3. 请 AI 帮忙",
        "4. 选卡片样式",
        "5. 检查图片和署名",
        "6. AI 真的懂我吗？",
        "7. 发送前检查",
      ]
}
                activeStep={w3Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w3Step === 0 && (
                <Section
                  title={locale === "en" ? "Choose who you are writing to" : locale === "zh-Hant" ? "先選你想寫給誰" : "先选你想写给谁"}
                  description={locale === "en" ? "The recipient matters. Your choices later should fit this person and purpose." : locale === "zh-Hant" ? "對象很重要。後面的 AI 修改和設計選擇都要適合這個人。" : "对象很重要。后面的 AI 修改和设计选择都要适合这个人。"}
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
                          if (existingIsSample) setW3Draft("");
                          setW3Prompt("");
                          setW3PromptTags([]);
                          setW3Chat([]);
                          setW3SuggestionUseStrategy("");
                          setW3IdeaSupportTags([]);
                          setW3PresentationFormat("");
                          setW3PresentationReasonTags([]);
                          setW3HelpfulTags([]);
                          setW3LimitationTags([]);
                          setW3UsabilityFeedback("");
                          setW3FinalText("");
                          setW3ComparedFormatIds([]);
                          setW3SelectedDesignElementIds([]);
                          setW3RejectedElementIds([]);
                          setW3SelectedAssetIds([]);
                          setW3DisclosureChoiceId("");
                          setW3AttributionChoiceId("");
                          setW3KeptOwnSentence(false);
                          setW3MechanismSort({});
                          setW3DesignElementAllocation({});
                          setW3AssetAllocation({});
                        }}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {w3Step === 1 && (
                <Section
                  title={
  locale === "en"
    ? "Write your own message first"
    : locale === "zh-Hant"
    ? "先寫你自己想說的話"
    : "先写你自己想说的话"
}
description={
  locale === "en"
    ? "AI can help later. This first version should begin with your own idea."
    : locale === "zh-Hant"
    ? "AI 可以之後幫忙。這一版先從你自己的想法開始。"
    : "AI 可以之后帮忙。这一版先从你自己的想法开始。"
}
                >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
  <div>
    <div className="mb-4 rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
      {locale === "en"
        ? "Write one real message first. AI can help later, but the card should start from you."
        : locale === "zh-Hant"
        ? "先寫一句真正想說的話。AI 可以之後幫忙，但卡片要從你自己開始。"
        : "先写一句真正想说的话。AI 可以之后帮忙，但卡片要从你自己开始。"}
    </div>

    <Button
      variant="secondary"
      onClick={() => w3Recipient && setW3Draft(draftSamplesData[w3Recipient])}
    >
      <PencilLine className="mr-2 h-4 w-4" />
      {locale === "en"
        ? "Use a sample starter"
        : locale === "zh-Hant"
        ? "放入示例初稿"
        : "放入示例初稿"}
    </Button>

    <textarea
      value={w3Draft}
      onChange={(e) => setW3Draft(e.target.value)}
      className="mt-4 min-h-[220px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
      placeholder={
  locale === "en"
    ? "Write 2–3 sentences, at least 25 words. Start with what you really want to say."
    : locale === "zh-Hant"
    ? "請寫 2–3 句，至少 25 個字。先寫你自己真正想說的話。"
    : "请写 2–3 句，至少 25 个字。先写你自己真正想说的话。"
}
    />
  </div>

  <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-fuchsia-50 to-white p-5 shadow-sm">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="text-sm font-semibold text-slate-800">
        {locale === "en"
          ? "Card preview"
          : locale === "zh-Hant"
          ? "卡片預覽"
          : "卡片预览"}
      </div>
      <Pill tone="outline">
        {w3Recipient
          ? recipientOptions.find((r) => r.id === w3Recipient)?.title
          : locale === "en"
          ? "No recipient yet"
          : "未选择对象"}
      </Pill>
    </div>

    <div className="min-h-[260px] rounded-3xl bg-white p-5 shadow-inner">
      <div className="mb-4 text-4xl">💌</div>
      <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">
        {w3Draft ||
          (locale === "en"
            ? "Your message will appear here."
            : locale === "zh-Hant"
            ? "你的文字會出現在這裡。"
            : "你的文字会出现在这里。")}
      </p>
    </div>
  </div>
</div>
                </Section>
              )}

              {w3Step === 2 && (
                <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                  <Section
                    title={
  locale === "en"
    ? "Ask AI to help, but keep your own meaning"
    : locale === "zh-Hant"
    ? "請 AI 幫忙，但保留你的意思"
    : "请 AI 帮忙，但保留你的意思"
}
description={
  locale === "en"
    ? "Tell AI what to keep and what to improve. The card should still sound like you."
    : locale === "zh-Hant"
    ? "告訴 AI 哪些要保留、哪些可以改。卡片最後仍然要像你自己想說的話。"
    : "告诉 AI 哪些要保留、哪些可以改。卡片最后仍然要像你自己想说的话。"
}
                    >
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {w3PromptTagOptions.map((tag) => (
                          <TagButton key={tag.id} active={w3PromptTags.includes(tag.id)} onClick={() => toggleValue(tag.id, w3PromptTags, setW3PromptTags)}>
                            {tag.label}
                          </TagButton>
                        ))}
                      </div>
                      <textarea
                        value={w3Prompt}
                        onChange={(e) => setW3Prompt(e.target.value)}
                        className="min-h-[140px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                        placeholder={
  locale === "en"
    ? "Write one clear request, at least 15 words. Example: Please make it warmer, but keep my example and my own tone."
    : locale === "zh-Hant"
    ? "請寫 1 個清楚要求，至少 15 個字。例如：請幫我寫得更溫暖，但保留我的例子和語氣。"
    : "请写 1 个清楚要求，至少 15 个字。例如：请帮我写得更温暖，但保留我的例子和语气。"
}
                      />
                      <Button onClick={submitCreativePrompt}>
                        <Wand2 className="mr-2 h-4 w-4" /> {locale === "en" ? "Send to AI" : "让 AI 回我"}
                      </Button>

                      {w3Chat.length > 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-4">
                          <div className="mb-3 text-sm font-semibold text-slate-800">{locale === "en" ? "How will you use the AI suggestion?" : "你会怎样使用 AI 建议？"}</div>
                          <div className="grid gap-2 md:grid-cols-2">
                            {w3SuggestionUseOptions.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setW3SuggestionUseStrategy(item.id)}
                                className={cn(
                                  "rounded-2xl border p-3 text-left text-sm transition",
                                  w3SuggestionUseStrategy === item.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                )}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {w3Chat.length > 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-4">
                          <div className="mb-3 text-sm font-semibold text-slate-800">{locale === "en" ? "How did AI expand your idea?" : "AI 怎样拓展了你的想法？"}</div>
                          <div className="flex flex-wrap gap-2">
                            {w3IdeaSupportOptions.map((item) => (
                              <TagButton key={item.id} active={w3IdeaSupportTags.includes(item.id)} onClick={() => toggleValue(item.id, w3IdeaSupportTags, setW3IdeaSupportTags)}>
                                {item.label}
                              </TagButton>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Section>

                  <Section
  title={locale === "en" ? "AI reply preview" : locale === "zh-Hant" ? "AI 回覆預覽" : "AI 回复预览"}
  description={
    locale === "en"
      ? "After you send your request, you can compare your first draft and the AI version here."
      : locale === "zh-Hant"
      ? "發送要求後，你可以在這裡比較自己的初稿和 AI 修改版。"
      : "发送要求后，你可以在这里比较自己的初稿和 AI 修改版。"
  }
>
                      <div className="space-y-4">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 text-sm font-medium text-slate-700">{locale === "en" ? "My first draft" : "我的初稿"}</div>
                        <p className="text-sm leading-8 text-slate-600">{w3Draft || (locale === "en" ? "Write your first draft first." : "请先完成上一步初稿。")}</p>
                      </div>
                      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        {w3Chat.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{locale === "en" ? "Send your prompt to see the simulated AI response." : "发送后，这里会出现模拟 AI 回复。"}</div>}
                        {w3Chat.map((msg, idx) => (
                          <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                            <div className={cn("max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7", msg.role === "user" ? "bg-slate-900 text-white" : "border border-slate-200 bg-slate-50 text-slate-700")}>
                              <div className="mb-1 flex items-center gap-2 text-xs opacity-70">
                                {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                                {msg.role === "user" ? (locale === "en" ? "Me" : "我") : "AI"}
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
                  title={
  locale === "en"
    ? "Choose a card style"
    : locale === "zh-Hant"
    ? "選一種卡片樣式"
    : "选一种卡片样式"
}
description={
  locale === "en"
    ? "Choose how your message should look. The preview will change as you choose."
    : locale === "zh-Hant"
    ? "選擇你想把這段心意做成甚麼樣子。右邊的預覽會跟著改變。"
    : "选择你想把这段心意做成什么样子。右边的预览会跟着改变。"
}
                  >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
  <div className="space-y-4">
    <div className="rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
      {locale === "en"
  ? "Choose a main format first. Different formats allow different elements."
  : locale === "zh-Hant"
  ? "先選主要樣式。不同樣式可以使用的元素不同。"
  : "先选主要样式。不同样式可以使用的元素不同。"}
    </div>

    <div className="grid gap-3 md:grid-cols-3">
      {w3MultimodalOptions.map((item) => {
        const selected = w3PresentationFormat === item.id;
        const previewIcon =
          item.id === "poster"
            ? "🖼️"
            : item.id === "comic_sticker"
            ? "💬"
            : "💌";

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => applyW3PresentationFormat(item.id)}
            className={cn(
              "rounded-3xl border p-4 text-left transition",
              selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            <div
              className={cn(
                "mb-3 flex h-24 items-center justify-center rounded-2xl text-4xl",
                selected ? "bg-white/10" : "bg-slate-50"
              )}
            >
              {previewIcon}
            </div>
            <div className="font-semibold">{item.title}</div>
            <div
              className={cn(
                "mt-2 text-sm leading-6",
                selected ? "text-white/80" : "text-slate-500"
              )}
            >
              {item.note}
            </div>
          </button>
        );
      })}
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-slate-800">
        {locale === "en"
          ? "Choose elements for your final card"
          : locale === "zh-Hant"
          ? "選擇要放進最終卡片的元素"
          : "选择要放进最终卡片的元素"}
      </div>

      <div className="space-y-3">
        {getW3VisibleDesignElementOptions().map((item) => {
          const value = w3DesignElementAllocation[item.id];

          return (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3"
            >
              <span className="text-sm text-slate-700">{item.label}</span>
              <div className="flex gap-2">
                <TagButton
                  active={value === "use"}
                  onClick={() => setW3DesignElementDecision(item.id, "use")}
                >
                  {locale === "en"
                    ? "Use"
                    : locale === "zh-Hant"
                    ? "放進作品"
                    : "放进作品"}
                </TagButton>

                <TagButton
                  active={value === "reject"}
                  onClick={() => setW3DesignElementDecision(item.id, "reject")}
                >
                  {locale === "en"
                    ? "Skip"
                    : locale === "zh-Hant"
                    ? "不使用"
                    : "不使用"}
                </TagButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-2 text-sm font-semibold text-slate-800">
        {locale === "en"
          ? "Why this design?"
          : locale === "zh-Hant"
          ? "為什麼這樣設計？"
          : "为什么这样设计？"}
      </div>

      <div className="flex flex-wrap gap-2">
        {w3FormatReasonOptions.map((item) => (
          <TagButton
            key={item.id}
            active={w3PresentationReasonTags.includes(item.id)}
            onClick={() =>
              toggleValue(
                item.id,
                w3PresentationReasonTags,
                setW3PresentationReasonTags
              )
            }
          >
            {item.label}
          </TagButton>
        ))}
      </div>
    </div>
  </div>

  <W3CardPreviewShared
  title={
    locale === "en"
      ? "Final card preview"
      : locale === "zh-Hant"
      ? "最終卡片預覽"
      : "最终卡片预览"
  }
  text={w3FinalText}
  locale={locale}
  formatId={w3PresentationFormat || "text_card"}
  selectedDesignElementIds={
    w3SelectedDesignElementIds.length > 0
      ? w3SelectedDesignElementIds
      : ["own_sentence"]
  }
  recipientId={String(w3Recipient || "")}
  creditNotes={w3CreditNotes}
  forceShowText
/>
</div>
                </Section>
              )}
              

              {w3Step === 4 && (
                <Section
                  title={locale === "en" ? "Source and authorship check" : locale === "zh-Hant" ? "素材與署名檢查" : "素材与署名检查"}
                  description={locale === "en" ? "Before publishing, decide which materials can be used, credited, or avoided." : locale === "zh-Hant" ? "發布前，先判斷哪些素材可以用、哪些要說明來源、哪些不應使用。" : "发布前，先判断哪些素材可以用、哪些要说明来源、哪些不应使用。"}
                >
                  <DragBoard
                    title={locale === "en" ? "Sort the materials" : locale === "zh-Hant" ? "分類素材卡" : "分类素材卡"}
                    description={locale === "en" ? "Drag each material to the most responsible choice." : locale === "zh-Hant" ? "把每張素材卡拖到最負責任的選擇。" : "把每张素材卡拖到最负责任的选择。"}
                    cards={w3AssetCards}
                      unassignedLabel={
    locale === "en"
      ? "Materials to sort"
      : locale === "zh-Hant"
      ? "待分類素材"
      : "待分类素材"
  }
  emptyLabel={
    locale === "en"
      ? "Drag a card here, or select a card and click this column."
      : locale === "zh-Hant"
      ? "把卡片拖到這裏，或先點選卡片再點目標欄。"
      : "把卡片拖到这里，或先点选卡片再点目标栏。"
  }
  allAssignedLabel={
    locale === "en"
      ? "All material cards have been placed."
      : locale === "zh-Hant"
      ? "所有素材卡都已放入欄目。"
      : "所有素材卡都已放入栏目。"
  }
  selectedHintLabel={
    locale === "en"
      ? "One card is selected. You can drag it, or click a target column."
      : locale === "zh-Hant"
      ? "已選中一張卡片。你可以拖動它，或直接點擊目標欄。"
      : "已选中一张卡片。你可以拖拽它，或直接点击目标栏目。"
  }
                    columns={[
                      { id: "use", title: locale === "en" ? "Can use" : locale === "zh-Hant" ? "可以使用" : "可以使用" },
                      { id: "credit", title: locale === "en" ? "Use with credit/disclosure" : locale === "zh-Hant" ? "可用，但要說明" : "可用，但要说明" },
                      { id: "avoid", title: locale === "en" ? "Do not use" : locale === "zh-Hant" ? "不要使用" : "不要使用" },
                    ]}
                    allocation={w3AssetAllocation}
                    onAssign={setW3AssetDecision}
                  />
                  

                
                </Section>
              )}

              {w3Step === 5 && (
  <Section
    title={
      locale === "en"
        ? "AI writes like a person, but does it really understand?"
        : locale === "zh-Hant"
        ? "AI 寫得像人，但它真的懂嗎？"
        : "AI 写得像人，但它真的懂吗？"
    }
    description={
      locale === "en"
        ? "Read each statement and decide whether it sounds reliable. This is about how AI produced the card text."
        : locale === "zh-Hant"
        ? "讀一讀下面的說法，判斷它是不是比較可靠。這一步是在看 AI 是怎樣寫出卡片文字的。"
        : "读一读下面的说法，判断它是不是比较可靠。这一步是在看 AI 是怎样写出卡片文字的。"
    }
  >
    <div className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
      <div className="space-y-3">
        {w3MechanismStatements.map((item) => {
          const selected = w3MechanismSort[item.id];
          return (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-4"
            >
              <div className="text-sm leading-7 text-slate-700">{item.text}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <TagButton
                  active={selected === "accurate"}
                  onClick={() => setW3MechanismCard(item.id, "accurate")}
                >
                  {locale === "en"
                    ? "Sounds reliable"
                    : locale === "zh-Hant"
                    ? "比較可靠"
                    : "比较可靠"}
                </TagButton>

                <TagButton
                  active={selected === "inaccurate"}
                  onClick={() => setW3MechanismCard(item.id, "inaccurate")}
                >
                  {locale === "en"
                    ? "Not very reliable"
                    : locale === "zh-Hant"
                    ? "不太可靠"
                    : "不太可靠"}
                </TagButton>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "Judgement record"
            : locale === "zh-Hant"
            ? "判斷記錄"
            : "判断记录"}
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-3">
            {locale === "en"
              ? "Answered"
              : locale === "zh-Hant"
              ? "已判斷"
              : "已判断"}
            ：{Object.keys(w3MechanismSort).length} / {w3MechanismStatements.length}
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 leading-6">
            {locale === "en"
              ? "This step does not show right or wrong answers here. Your choices will be used in the final report."
              : locale === "zh-Hant"
              ? "這裡不直接顯示對錯。你的判斷會保存在最後報告中。"
              : "这里不直接显示对错。你的判断会保存在最后报告中。"}
          </div>
        </div>
      </div>
    </div>
  </Section>
)}

              {w3Step === 6 && (
  <Section
    title={
      locale === "en"
        ? "Check before sending"
        : locale === "zh-Hant"
        ? "發送前檢查"
        : "发送前检查"
    }
    description={
      locale === "en"
        ? "Write the final card text. The reflection tags are optional; if you leave them blank, the report will simply show less reflection evidence."
        : locale === "zh-Hant"
        ? "寫下最後要發送的卡片文字。下面的反思標籤可以不選；不選也可以提交，只是報告中相關證據會較少。"
        : "写下最后要发送的卡片文字。下面的反思标签可以不选；不选也可以提交，只是报告中相关证据会较少。"
    }
  >
    <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
      <div>
        <textarea
          value={w3FinalText}
          onChange={(e) => setW3FinalText(e.target.value)}
          className="min-h-[220px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
          placeholder={
            locale === "en"
              ? "Write the final card text here, at least 25 words."
              : locale === "zh-Hant"
              ? "請在這裡寫最後版本，至少 25 個字。"
              : "请在这里写最后版本，至少 25 个字。"
          }
        />

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">
              {locale === "en"
                ? "Optional: What did AI help with?"
                : locale === "zh-Hant"
                ? "可選：AI 哪些地方幫到了你？"
                : "可选：AI 哪些地方帮到了你？"}
            </div>
            <div className="flex flex-wrap gap-2">
              {w3HelpfulReviewTags.map((tag) => (
                <TagButton
                  key={tag.id}
                  active={w3HelpfulTags.includes(tag.id)}
                  onClick={() => toggleW3HelpfulReviewTag(tag.id)}
                >
                  {tag.label}
                </TagButton>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">
              {locale === "en"
                ? "Optional: What still needs checking?"
                : locale === "zh-Hant"
                ? "可選：哪些地方還要檢查？"
                : "可选：哪些地方还要检查？"}
            </div>
            <div className="flex flex-wrap gap-2">
              {w3LimitationReviewTags.map((tag) => (
                <TagButton
                  key={tag.id}
                  active={w3LimitationTags.includes(tag.id)}
                  onClick={() => toggleW3LimitationReviewTag(tag.id)}
                >
                  {tag.label}
                </TagButton>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <div className="mb-3 text-sm font-medium text-slate-700">
            {locale === "en"
              ? "Optional self-check"
              : locale === "zh-Hant"
              ? "可選自我檢查"
              : "可选自我检查"}
          </div>
          <div className="space-y-3">
            {[
              {
                id: "我保留了自己的例子或想法",
                label:
                  locale === "en"
                    ? "The card still includes my own idea or example."
                    : locale === "zh-Hant"
                    ? "卡片裡仍然有我自己的想法或例子。"
                    : "卡片里仍然有我自己的想法或例子。",
              },
              {
                id: "我改过 AI 给我的句子",
                label:
                  locale === "en"
                    ? "I changed some AI sentences before sending."
                    : locale === "zh-Hant"
                    ? "我發送前修改過 AI 給我的句子。"
                    : "我发送前修改过 AI 给我的句子。",
              },
              {
                id: "我没有直接整段照搬",
                label:
                  locale === "en"
                    ? "I did not copy the whole AI version directly."
                    : locale === "zh-Hant"
                    ? "我沒有整段直接照搬 AI 版本。"
                    : "我没有整段直接照搬 AI 版本。",
              },
              {
                id: "我知道 AI 是根据提示和模式生成内容，不是真的理解我",
                label:
                  locale === "en"
                    ? "I know AI generates from prompts and patterns, not real understanding."
                    : locale === "zh-Hant"
                    ? "我知道 AI 是根據提示和模式生成內容，不是真的理解我。"
                    : "我知道 AI 是根据提示和模式生成内容，不是真的理解我。",
              },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <input
                  type="checkbox"
                  checked={w3Checklist.includes(item.id)}
                  onChange={() => toggleValue(item.id, w3Checklist, setW3Checklist)}
                  className="h-5 w-5"
                />
                <span className="text-sm leading-7 text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <W3CardPreviewShared
  title={
    locale === "en"
      ? "Card preview"
      : locale === "zh-Hant"
      ? "卡片預覽"
      : "卡片预览"
  }
  text={w3FinalText || w3Draft}
  locale={locale}
  formatId={w3PresentationFormat || "text_card"}
  selectedDesignElementIds={
    w3SelectedDesignElementIds.length > 0
      ? w3SelectedDesignElementIds
      : ["own_sentence"]
  }
  recipientId={String(w3Recipient || "")}
  creditNotes={[]}
  forceShowText
/>
</div>

    <div className="mt-5 flex justify-end">
      <Button
        disabled={!(w3FinalText.trim().length > 20)}
        onClick={() => finishWorld("w3")}
      >
        {locale === "en"
          ? "Complete World 3"
          : locale === "zh-Hant"
          ? "完成世界 3"
          : "完成世界 3"}
      </Button>
    </div>
  </Section>
)}

              <Nav
                locale={locale}
                step={w3Step}
                setStep={setW3Step}
                maxStep={6}
                canNext={
                  (w3Step === 0 && !!w3Recipient) ||
                  (w3Step === 1 && w3Draft.trim().length > 20) ||
                  (w3Step === 2 && w3Chat.length > 0 && !!w3SuggestionUseStrategy && w3IdeaSupportTags.length > 0) ||
                  (w3Step === 3 && !!w3PresentationFormat && w3SelectedDesignElementIds.length >= 1) ||
                  (w3AssetOptions.length > 0 &&
w3AssetOptions.every((item) => !!w3AssetAllocation[item.id])) ||
                  (w3Step === 5 && Object.keys(w3MechanismSort).length >= 5) ||
                  (w3Step === 6 && w3FinalText.trim().length > 20)
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
                subtitle={
  locale === "en"
    ? "Your group is preparing a school travel survey report. Decide which tasks AI can help with, which parts people must check, and what rules the group should follow."
    : locale === "zh-Hant"
    ? "你的小組要整理一份校園出行調查報告。你來決定哪些工作可以請 AI 先幫忙，哪些部分必須由人檢查，以及小組要遵守甚麼規則。"
    : "你的小组要整理一份校园出行调查报告。你来决定哪些工作可以请 AI 先帮忙，哪些部分必须由人检查，以及小组要遵守什么规则。"
}
                badge={tr(locale, "世界4")}
                color={worldMeta.w4.color}
                icon={worldMeta.w4.icon}
                progress={p4}
                steps={
  locale === "en"
    ? [
        "1. Read the project",
        "2. Divide the work",
        "3. Choose AI's helper role",
        "4. Check the plan",
        "5. Set group rules",
      ]
    : locale === "zh-Hant"
    ? [
        "1. 看項目任務",
        "2. 分配工作",
        "3. 選 AI 幫忙方式",
        "4. 檢查分工",
        "5. 設定小組規則",
      ]
    : [
        "1. 看项目任务",
        "2. 分配工作",
        "3. 选 AI 帮忙方式",
        "4. 检查分工",
        "5. 设定小组规则",
      ]
}
                activeStep={w4Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w4Step === 0 && (
                <Section
                  title={locale === "en" ? "First, look at the project your group needs to complete" : locale === "zh-Hant" ? "先看看你們這次要完成甚麼項目" : "先看你们这次要完成什么项目"}
                  description={
  locale === "en"
    ? "After reading the project brief, you will decide what AI can help with and what your group should still do yourselves."
    : locale === "zh-Hant"
    ? "看完項目簡要後，你會開始決定：哪些工作可以讓 AI 幫忙，哪些還是要你們自己做。"
    : "看完项目简要后，你会开始决定：哪些工作可以让 AI 帮忙，哪些还是要你们自己做。"
}
                >
                  <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">{locale === "en"
  ? "Project task"
  : locale === "zh-Hant"
  ? "項目任務"
  : "项目任务"}</div>
                      <ul className="space-y-2 text-sm leading-7 text-slate-600">
                        {(
  locale === "en"
    ? [
        "Organise the results of a school travel survey.",
        "Make a one-page briefing.",
        "Write two suggestions for the school.",
        "You may use an AI assistant, but your group is responsible for the final conclusions.",
      ]
    : locale === "zh-Hant"
    ? [
        "整理「同學上學方式調查」結果",
        "做一頁簡報",
        "給學校寫兩條建議",
        "可以使用 AI 助手，但結論必須由小組負責",
      ]
    : [
        "整理“同学上学方式调查”结果",
        "做一页简报",
        "给学校写两条建议",
        "可以使用 AI 助手，但结论必须由小组负责",
      ]
).map((item) => (
  <li key={item}>• {item}</li>
))}
                      </ul>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">{locale === "en"
  ? "Survey results (sample)"
  : locale === "zh-Hant"
  ? "調查結果（示意）"
  : "调查结果（示意）"}</div>
                      <div className="space-y-3">
                        {commuteSurveyData.map((item) => (
                          <div key={item.type} className="rounded-2xl bg-slate-50 p-3 text-sm leading-7 text-slate-600">
                            <div className="font-medium text-slate-700">
                              {item.type}: {item.count}{" "}
{locale === "en" ? "students" : "人"}
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
                title={
  locale === "en"
    ? "Divide the work for your group project"
    : locale === "zh-Hant"
    ? "幫小組分配工作"
    : "帮小组分配工作"
}  
                description={
  locale === "en"
    ? "Put each task where you think it belongs. Some tasks can be started by AI, but important decisions should still be checked by people."
    : locale === "zh-Hant"
    ? "把每張任務卡放到你覺得合適的位置。有些工作可以先請 AI 幫忙，但重要決定仍要由人檢查。"
    : "把每张任务卡放到你觉得合适的位置。有些工作可以先请 AI 帮忙，但重要决定仍要由人检查。"
}
                >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
  <DragBoard
    title={
  locale === "en"
    ? "Move each task card"
    : locale === "zh-Hant"
    ? "移動任務卡"
    : "移动任务卡"
}
    description={
  locale === "en"
    ? "Drag a card, or click a card and then click a column."
    : locale === "zh-Hant"
    ? "可以拖動卡片，也可以先點卡片再點欄目。"
    : "可以拖动卡片，也可以先点卡片再点栏目。"
}
    cards={w4WorkflowCards}
      unassignedLabel={
    locale === "en"
      ? "Task cards to place"
      : locale === "zh-Hant"
      ? "待分配任務卡"
      : "待分配任务卡"
  }
  emptyLabel={
    locale === "en"
      ? "Drag a card here, or select a card and click this column."
      : locale === "zh-Hant"
      ? "把卡片拖到這裏，或先點選卡片再點目標欄。"
      : "把卡片拖到这里，或先点选卡片再点目标栏。"
  }
  allAssignedLabel={
    locale === "en"
      ? "All task cards have been placed."
      : locale === "zh-Hant"
      ? "所有任務卡都已放入欄目。"
      : "所有任务卡都已放入栏目。"
  }
  selectedHintLabel={
    locale === "en"
      ? "One task card is selected. You can drag it, or click a target column."
      : locale === "zh-Hant"
      ? "已選中一張任務卡。你可以拖動它，或直接點擊目標欄。"
      : "已选中一张任务卡。你可以拖拽它，或直接点击目标栏目。"
  }
    columns={[
  {
    id: "ai_auto",
    title:
      locale === "en"
        ? "AI can do first"
        : locale === "zh-Hant"
        ? "AI 可以先做"
        : "AI 可以先做",
    note:
      locale === "en"
        ? "Good for counting, sorting, or making a first draft."
        : locale === "zh-Hant"
        ? "適合計算、整理，或先做一個草稿。"
        : "适合计算、整理，或先做一个草稿。",
  },
  {
    id: "ai_assist_human_check",
    title:
      locale === "en"
        ? "AI helps, we check"
        : locale === "zh-Hant"
        ? "AI 幫忙，我們檢查"
        : "AI 帮忙，我们检查",
    note:
      locale === "en"
        ? "Useful when AI can suggest something, but people need to review it."
        : locale === "zh-Hant"
        ? "AI 可以給建議，但要由人看一看是否合適。"
        : "AI 可以给建议，但要由人看一看是否合适。",
  },
  {
    id: "human_only",
    title:
      locale === "en"
        ? "People decide"
        : locale === "zh-Hant"
        ? "由人來決定"
        : "由人来决定",
    note:
      locale === "en"
        ? "For fairness, final suggestions, and explaining AI use."
        : locale === "zh-Hant"
        ? "適合公平判斷、最後建議，以及說明 AI 使用。"
        : "适合公平判断、最后建议，以及说明 AI 使用。",
  },
]}
    allocation={w4WorkflowAllocation}
    onAssign={setW4WorkflowTask}
  />

  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-3 text-sm font-semibold text-slate-800">
      {locale === "en"
        ? "Project division preview"
        : locale === "zh-Hant"
        ? "項目分工預覽"
        : "项目分工预览"}
    </div>

    {["ai_auto", "ai_assist_human_check", "human_only"].map((columnId) => {
      const label = getW4ColumnLabel(columnId);

      const tasks = w4WorkflowCards.filter(
        (card) => w4WorkflowAllocation[card.id] === columnId
      );

      return (
        <div key={columnId} className="mb-3 rounded-2xl bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold text-slate-600">
            {label}
          </div>
          <div className="space-y-1 text-sm text-slate-700">
            {tasks.length ? (
              tasks.map((task) => <div key={task.id}>• {getW4TaskLabel(task.id)}</div>)
              
            ) : (
              <div className="text-slate-400">
                {locale === "en" ? "No task yet" : "还没有任务"}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>
                </Section>
              )}

              {w4Step === 2 && (
                <Section
                  title={
  locale === "en"
    ? "Choose how AI helps your group"
    : locale === "zh-Hant"
    ? "選擇 AI 怎樣幫小組"
    : "选择 AI 怎样帮小组"
}
description={
  locale === "en"
    ? "Look at your project. What kind of help would be most useful?"
    : locale === "zh-Hant"
    ? "看看這個項目，AI 哪種幫忙方式最有用？"
    : "看看这个项目，AI 哪种帮忙方式最有用？"
}
                  >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <OptionCard
                      icon={ChartColumnIncreasing}
                      title={locale === "en" ? "Data organiser" : locale === "zh-Hant" ? "數據整理助手" : "数据整理助手"}
                      note={locale === "en" ? "Helps calculate numbers and percentages." : locale === "zh-Hant" ? "幫你統計人數和比例。" : "帮你统计人数和比例。"}
                      selected={w4Role === "data"}
                      onClick={() => setW4Role("data")}
                    />
                    <OptionCard
                      icon={ClipboardList}
                      title={locale === "en" ? "Summary assistant" : locale === "zh-Hant" ? "摘要助手" : "摘要助手"}
                      note={locale === "en" ? "Helps organise the survey results into key points." : locale === "zh-Hant" ? "幫你把調查結果整理成重點。" : "帮你把调查结果整理成重点。"}
                      selected={w4Role === "summary"}
                      onClick={() => setW4Role("summary")}
                    />
                    <OptionCard
                      icon={FileText}
                      title={locale === "en" ? "Suggestion draft assistant" : locale === "zh-Hant" ? "建議草稿助手" : "建议草稿助手"}
                      note={locale === "en" ? "Helps draft suggestions that still need human review." : locale === "zh-Hant" ? "先幫你寫一版建議，但仍需要人檢查。" : "先帮你写一版建议，但仍需要人检查。"}
                      selected={w4Role === "draft"}
                      onClick={() => setW4Role("draft")}
                    />
                    <OptionCard
                      icon={ShieldCheck}
                      title={locale === "en" ? "No AI support needed" : locale === "zh-Hant" ? "這次不需要 AI" : "这次不需要 AI"}
                      note={locale === "en" ? "Choose this if human judgement should handle the project without AI." : locale === "zh-Hant" ? "如果你認為這次主要應由人完成，可以選這項。" : "如果你认为这次主要应由人完成，可以选这项。"}
                      selected={w4Role === "no_ai_support"}
                      onClick={() => setW4Role("no_ai_support")}
                    />
                  </div>
                </Section>
              )}

              {w4Step === 3 && w4Role && (
  <Section
    title={
  w4Role === "no_ai_support"
    ? locale === "en"
      ? "Why not use AI this time?"
      : locale === "zh-Hant"
      ? "為甚麼這次不用 AI？"
      : "为什么这次不用 AI？"
    : locale === "en"
    ? "Check the AI helper's result"
    : locale === "zh-Hant"
    ? "檢查 AI 助手給出的結果"
    : "检查 AI 助手给出的结果"
}
    description={
  w4Role === "no_ai_support"
    ? locale === "en"
      ? "If your group does not need AI here, explain your reason in your own words."
      : locale === "zh-Hant"
      ? "如果你覺得這個項目不需要 AI，請用自己的話說明原因。"
      : "如果你觉得这个项目不需要 AI，请用自己的话说明原因。"
    : locale === "en"
    ? "Look at the AI helper's result. Then decide whether your group should use it directly, revise it, or not use it."
    : locale === "zh-Hant"
    ? "看看 AI 助手給出的結果，再決定小組能不能直接用、要修改後再用，還是不能用。"
    : "看看 AI 助手给出的结果，再决定小组能不能直接用、要修改后再用，还是不能用。"
}
  >
    {w4Role === "no_ai_support" ? (
      <textarea
        value={w4NoAiReason}
        onChange={(e) => setW4NoAiReason(e.target.value)}
        className="min-h-[180px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
        placeholder={
  locale === "en"
    ? "Write 1-2 sentences, at least 15 words. Why is AI not needed here?"
    : locale === "zh-Hant"
    ? "請寫 1-2 句，至少 15 個字：為什麼這次不需要 AI?"
    : "请写 1-2 句，至少 15 个字：为什么这次不需要 AI?"
}
      />
    ) : (
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          {selectedW4RoleOutput ? (
            <>
              <div className="mb-3 text-sm font-medium text-slate-700">
                {selectedW4RoleOutput.title}
              </div>

              <div className="space-y-2">
                {selectedW4RoleOutput.body.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-50 p-3 text-sm leading-7 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              {locale === "en"
                ? "Choose an AI assistant role first."
                : locale === "zh-Hant"
                ? "請先選擇一個 AI 助手角色。"
                : "请先选择一个 AI 助手角色。"}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="mb-3 text-sm font-medium text-slate-700">
              {locale === "en"
  ? "What will your group do with this result?"
  : locale === "zh-Hant"
  ? "小組會怎樣處理這個結果？"
  : "小组会怎样处理这个结果？"}
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  id: "use_directly",
                  label:
                    locale === "en"
                      ? "Use directly"
                      : locale === "zh-Hant"
                      ? "直接使用"
                      : "直接使用",
                },
                {
                  id: "revise_check_before_use",
                  label:
                    locale === "en"
                      ? "Revise/check before use"
                      : locale === "zh-Hant"
                      ? "修改或檢查後再用"
                      : "修改或检查后再用",
                },
                {
                  id: "do_not_use_directly",
                  label:
                    locale === "en"
                      ? "Do not use directly"
                      : locale === "zh-Hant"
                      ? "不能直接用"
                      : "不能直接用",
                },
              ].map((item) => (
                <TagButton
                  key={item.id}
                  active={w4UseChoice === item.id}
                  onClick={() =>
                    setW4UseChoice(
                      item.id as
                        | "use_directly"
                        | "revise_check_before_use"
                        | "do_not_use_directly"
                    )
                  }
                >
                  {item.label}
                </TagButton>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="mb-3 text-sm font-medium text-slate-700">
              {locale === "en"
  ? "What still needs people to check?"
  : locale === "zh-Hant"
  ? "哪些地方仍然需要人檢查？"
  : "哪些地方仍然需要人检查？"}
            </div>
            <p className="mb-3 text-xs leading-5 text-slate-500">
  {locale === "en"
    ? "Some choices may come from your earlier task board. You can keep them or change them."
    : locale === "zh-Hant"
    ? "有些選項可能來自你前面的分工板。你可以保留，也可以修改。"
    : "有些选项可能来自你前面的分工板。你可以保留，也可以修改。"}
</p>

            <div className="space-y-2">
              {w4HumanResponsibilityOptions.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3"
                >
                  <input
                    type="checkbox"
                    checked={w4HumanStillDo.includes(item.id)}
                    onChange={() =>
                      toggleValue(item.id, w4HumanStillDo, setW4HumanStillDo)
                    }
                    className="h-5 w-5"
                  />
                  <span className="text-sm leading-7 text-slate-700">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </Section>
)}
              {w4Step === 4 && (
                <Section
                  title={
  locale === "en"
    ? "Set group rules before sending"
    : locale === "zh-Hant"
    ? "發送前設定小組規則"
    : "发送前设定小组规则"
}
description={
  locale === "en"
    ? "Before sending the group plan, write one short reminder for your group."
    : locale === "zh-Hant"
    ? "發送小組計劃前，請給小組寫一句簡短提醒。"
    : "发送小组计划前，请给小组写一句简短提醒。"
}
                  >
                  <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <div className="mb-3 text-sm font-medium text-slate-700">
                        {locale === "en" ? "Tasks AI can help with" : locale === "zh-Hant" ? "AI 可以幫忙的工作" : "AI 可以帮忙的工作"}
                      </div>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        {w4AiTasks.length > 0 ? (
                          w4AiTasks.map((id) => {
                            const task = w4TaskOptions.find((item) => item.id === id);
                            return <div key={id}>{getW4TaskLabel(id)}</div>;
                          })
                        ) : (
                          <div>{locale === "en" ? "No AI task selected." : locale === "zh-Hant" ? "沒有選擇交給 AI 的任務。" : "没有选择交给 AI 的任务。"}</div>
                        )}
                      </div>

                      <div className="mt-5 mb-3 text-sm font-medium text-slate-700">
                        {locale === "en" ? "Tasks humans should still do" : locale === "zh-Hant" ? "人仍然要負責的工作" : "人仍然要负责的工作"}
                      </div>
                      <div className="space-y-2 text-sm leading-7 text-slate-600">
                        {w4HumanStillDo.length > 0 ? (
                          w4HumanStillDo.map((id) => {
                            const task = w4HumanResponsibilityOptions.find((item) => item.id === id);
                            return <div key={id}>{getW4TaskLabel(id)}</div>;
                          })
                        ) : (
                          <div>{locale === "en" ? "No human responsibility selected yet." : locale === "zh-Hant" ? "還沒有選擇人要負責的工作。" : "还没有选择人要负责的工作。"}</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <div className="mb-3 text-sm font-medium text-slate-700">
                          {locale === "en" ? "What AI-use rules should the group keep?" : locale === "zh-Hant" ? "小組要保留哪些 AI 使用規則？" : "小组要保留哪些 AI 使用规则？"}
                        </div>
                        <div className="space-y-2">
                          {w4RuleOptions.map((item) => (
                            <label key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                              <input
                                type="checkbox"
                                checked={w4Rules.includes(item.id)}
                                onChange={() => toggleValue(item.id, w4Rules, setW4Rules)}
                                className="h-5 w-5"
                              />
                              <span className="text-sm leading-7 text-slate-700">{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={w4Reminder}
                        onChange={(e) => setW4Reminder(e.target.value)}
                        className="min-h-[160px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
                        placeholder={
  locale === "en"
    ? "Write one reminder, at least 10 words. What should your group remember?"
    : locale === "zh-Hant"
    ? "請寫 1 句提醒，至少 10 個字：小組還要注意甚麼？"
    : "请写 1 句提醒，至少 10 个字：小组还要注意什么？"
}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => void finishWorld("w4")}>
  {locale === "en"
    ? "Submit workflow card"
    : locale === "zh-Hant"
    ? "提交分工與規則卡"
    : "提交分工与规则卡"}
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
                    w4Step === 0 ||
                    (w4Step === 1 &&
                      Object.keys(w4WorkflowAllocation).length >=
                        w4TaskOptions.length) ||
                    (w4Step === 2 && !!w4Role) ||
                    (w4Step === 3 &&
                      (w4Role === "no_ai_support"
                        ? w4NoAiReason.trim().length > 8
                        : !!w4UseChoice))
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
                subtitle={
  locale === "en"
    ? "The school recycling AI may have misread a crushed paper box. Check the clues, decide why it may be wrong, choose better examples, think about possible problems, and prepare a reminder card for students."
    : locale === "zh-Hant"
    ? "學校的垃圾分類 AI 可能認錯了一個被壓扁的紙盒。請先檢查線索，再判斷可能原因、選擇更好的例子、想想可能帶來的問題，最後整理一張給同學看的分類提醒卡。"
    : "学校的垃圾分类 AI 可能认错了一个被压扁的纸盒。请先检查线索，再判断可能原因、选择更好的例子、想想可能带来的问题，最后整理一张给同学看的分类提醒卡。"
}
                badge={tr(locale, "世界5")}
                color={worldMeta.w5.color}
                icon={worldMeta.w5.icon}
                progress={p5}
                steps={
  locale === "en"
    ? [
        "1. Find the mistake",
        "2. Guess why",
        "3. Choose next action",
        "4. Add better examples",
        "5. Possible problems",
        "6. Use reminders",
        "7. Check the reminder card",
      ]
    : locale === "zh-Hant"
    ? [
        "1. 找出錯誤",
        "2. 猜猜原因",
        "3. 下次怎麼辦",
        "4. 補充更好的例子",
        "5. 可能帶來的問題",
        "6. 使用提醒",
        "7. 檢查提醒卡",
      ]
    : [
        "1. 找出错误",
        "2. 猜猜原因",
        "3. 下次怎么办",
        "4. 补充更好的例子",
        "5. 可能带来的问题",
        "6. 使用提醒",
        "7. 检查提醒卡",
      ]
}
                activeStep={w5Step}
                onBack={() => setScreen("home")}
                locale={locale}
              />

              {w5Step === 0 && (
  <Section
    title={
      locale === "en"
        ? "Check the AI recycling result"
        : locale === "zh-Hant"
        ? "檢查 AI 的分類結果"
        : "检查 AI 的分类结果"
    }
    description={
      locale === "en"
        ? "The AI has already made a classification. Do not assume it is correct. Look for clues before deciding what went wrong."
        : locale === "zh-Hant"
        ? "AI 已經給出分類結果。不要先假設它一定對，請先找線索。"
        : "AI 已经给出分类结果。不要先假设它一定对，请先找线索。"
    }
  >
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-4xl">📦</div>
          <div>
            <div className="text-lg font-semibold text-slate-900">
              {locale === "en"
                ? "Case: crushed paper box"
                : locale === "zh-Hant"
                ? "案例：被壓扁的紙盒"
                : "案例：被压扁的纸盒"}
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {locale === "en"
                ? "A student put a flattened paper box into the smart recycling station."
                : locale === "zh-Hant"
                ? "一名學生把壓扁後的紙盒放進智能回收站。"
                : "一名学生把压扁后的纸盒放进智能回收站。"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <div className="mb-3 text-sm font-semibold text-slate-700">
            {locale === "en" ? "AI result" : locale === "zh-Hant" ? "AI 判斷結果" : "AI 判断结果"}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <div className="text-xs text-slate-500">
                {locale === "en" ? "AI category" : "AI 分类"}
              </div>
              <div className="mt-1 text-lg font-semibold text-rose-700">
                {locale === "en" ? "Other waste" : locale === "zh-Hant" ? "其他垃圾" : "其他垃圾"}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="text-xs text-slate-500">
                {locale === "en" ? "AI confidence" : locale === "zh-Hant" ? "AI 可信度" : "AI 可信度"}
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-900">82%</div>
            </div>

            <div className="rounded-2xl bg-white p-4">
  <div className="text-xs text-slate-500">
    {locale === "en"
      ? "What to check"
      : locale === "zh-Hant"
      ? "需要檢查甚麼"
      : "需要检查什么"}
  </div>
  <div className="mt-1 text-base font-semibold text-slate-900">
    {locale === "en"
      ? "Does the AI result match the item?"
      : locale === "zh-Hant"
      ? "AI 結果和物品是否一致？"
      : "AI 结果和物品是否一致？"}
  </div>
</div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "What clues show the AI result may be problematic?"
            : locale === "zh-Hant"
            ? "哪些線索說明 AI 結果可能有問題？"
            : "哪些线索说明 AI 结果可能有问题？"}
        </div>

        <div className="grid gap-3">
          {w5FailureCueOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleValue(item.id, w5FailureCueIds, setW5FailureCueIds)}
              className={cn(
                "rounded-2xl border p-4 text-left text-sm leading-7 transition",
                w5FailureCueIds.includes(item.id)
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </Section>
)}

              {w5Step === 1 && w5Problem && (
                <Section
                title={
  locale === "en"
    ? "Why might the AI misclassify the crushed box?"
    : locale === "zh-Hant"
    ? "AI 為甚麼可能認錯壓扁的紙盒？"
    : "AI 为什么可能认错压扁的纸盒？"
}
                description={
  locale === "en"
    ? "Use the clues from the previous step. Choose a likely cause and a useful improvement."
    : locale === "zh-Hant"
    ? "根據上一頁的線索，選一個可能原因和一個有用的改進方向。"
    : "根据上一页的线索，选一个可能原因和一个有用的改进方向。"
}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {w5CauseOptions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleW5Cause(item.id)}
                        className={cn("rounded-3xl border p-4 text-left text-sm transition", w5CauseIds.includes(item.id) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
                      >
                        <div className="font-semibold">{item.label}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 text-sm font-semibold text-slate-800">{locale === "en" ? "What should the system improve?" : "系统最应该改进什么？"}</div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {w5SystemImprovementOptions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setW5SystemImprovementChoice(item.id)}
                          className={cn("rounded-2xl border p-3 text-left text-sm transition", w5SystemImprovementChoice === item.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {w5Step === 2 && (
  <Section
    title={
      locale === "en"
        ? "What should happen next time?"
        : locale === "zh-Hant"
        ? "下次遇到類似照片，應該怎麼辦？"
        : "下次遇到类似照片，应该怎么办？"
    }
    description={
      locale === "en"
        ? "The AI may see another crushed or changed-shape paper box. Choose the method that would best reduce this kind of mistake."
        : locale === "zh-Hant"
        ? "AI 之後還可能看到壓扁或變形的紙盒。請選擇最能減少這類錯誤的處理方式。"
        : "AI 之后还可能看到压扁或变形的纸盒。请选择最能减少这类错误的处理方式。"
    }
  >
    <div className="grid gap-4 md:grid-cols-2">
      {w5HandlingStrategyOptions.map((item) => {
        const selected =
          w5SystemComparisonChoiceByCase.crushed_paper_box === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setW5SystemComparisonChoiceByCase({
                crushed_paper_box: item.id,
              });
              setW5SystemComparisonReasonTags([...item.reasonTags]);
            }}
            className={cn(
              "rounded-3xl border p-5 text-left transition",
              selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            <div className="text-base font-semibold">{item.title}</div>
            <p
              className={cn(
                "mt-2 text-sm leading-7",
                selected ? "text-white/80" : "text-slate-500"
              )}
            >
              {item.note}
            </p>
          </button>
        );
      })}
    </div>
  </Section>
)}

              {w5Step === 3 && w5Problem && (
  <Section
    title={
      locale === "en"
        ? "Pick examples that help fix the mistake"
        : locale === "zh-Hant"
        ? "找出能幫忙修正錯誤的例子"
        : "找出能帮忙修正错误的例子"
    }
    description={
      locale === "en"
        ? "The AI needs better examples of changed-shape paper boxes. Select the examples that should be added. The icons are placeholders for real pictures."
        : locale === "zh-Hant"
        ? "AI 需要看見更多形狀改變的紙盒例子。請選出應該加入的例子。下面先用圖標佔位，之後可以換成真圖片。"
        : "AI 需要看见更多形状改变的纸盒例子。请选出应该加入的例子。下面先用图标占位，之后可以换成真图片。"
    }
  >
    <div className="grid gap-4 md:grid-cols-4">
      {world5Images.map((img) => {
        const selected = w5Training.includes(img.id);

        return (
          <button
            key={img.id}
            type="button"
            onClick={() => toggleValue(img.id, w5Training, setW5Training)}
            className={cn(
              "rounded-3xl border p-4 text-center transition",
              selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            <div
              className={cn(
                "mb-3 flex h-28 items-center justify-center rounded-3xl text-5xl",
                selected ? "bg-white/10" : "bg-slate-50"
              )}
            >
              {getW5TrainingIcon(img.id)}
            </div>
            <div className="text-sm font-semibold">{img.title}</div>
          </button>
        );
      })}
    </div>
  </Section>
)}

              {w5Step === 4 && (
  <Section
    title={
      locale === "en"
        ? "If the system keeps making this mistake, what may happen?"
        : locale === "zh-Hant"
        ? "如果系統一直這樣錯，可能帶來甚麼問題？"
        : "如果系统一直这样错，可能带来什么问题？"
    }
    description={
      locale === "en"
        ? "If crushed paper boxes are often treated as other waste, some people may be misunderstood and some work may increase. Choose the likely problems and useful protections."
        : locale === "zh-Hant"
        ? "如果壓扁紙盒經常被判成其他垃圾，有些人可能會被誤會，也可能增加檢查工作。請選出可能問題和保護措施。"
        : "如果压扁纸盒经常被判成其他垃圾，有些人可能会被误会，也可能增加检查工作。请选出可能问题和保护措施。"
    }
  >
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "Possible problems"
            : locale === "zh-Hant"
            ? "可能問題"
            : "可能问题"}
        </div>

        <div className="space-y-2">
          {w5ImpactProblemOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const next = w5UnfairOutcomeIds.includes(item.id)
                  ? w5UnfairOutcomeIds.filter((x) => x !== item.id)
                  : w5UnfairOutcomeIds.length >= 3
? w5UnfairOutcomeIds
: [...w5UnfairOutcomeIds, item.id];

                setW5UnfairOutcomeIds(next);
                setW5AffectedStakeholders(deriveW5AffectedStakeholders(next));
              }}
              className={cn(
                "w-full rounded-2xl border p-3 text-left text-sm leading-7 transition",
                w5UnfairOutcomeIds.includes(item.id)
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "Protection measures"
            : locale === "zh-Hant"
            ? "保護措施"
            : "保护措施"}
        </div>

        <div className="space-y-2">
          {[
            {
              id: "human_check_uncertain_cases",
              label:
                locale === "en"
                  ? "Ask a person to check uncertain results."
                  : locale === "zh-Hant"
                  ? "不確定時請人確認。"
                  : "不确定时请人确认。",
            },
            {
              id: "allow_user_correction",
              label:
                locale === "en"
                  ? "Allow users to report or correct mistakes."
                  : locale === "zh-Hant"
                  ? "允許使用者回報或更正錯誤。"
                  : "允许使用者报告或更正错误。",
            },
            {
              id: "explain_system_limits",
              label:
                locale === "en"
                  ? "Tell users that the AI may still be wrong."
                  : locale === "zh-Hant"
                  ? "告訴使用者 AI 仍可能會錯。"
                  : "告诉使用者 AI 仍可能会错。",
            },
            {
              id: "look_nicer_only",
              label:
                locale === "en"
                  ? "Only make the page look nicer."
                  : locale === "zh-Hant"
                  ? "只讓頁面變得更好看。"
                  : "只让页面变得更好看。",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                toggleValue(
                  item.id,
                  w5BiasMitigationIds,
                  setW5BiasMitigationIds
                )
              }
              className={cn(
                "w-full rounded-2xl border p-3 text-left text-sm leading-7 transition",
                w5BiasMitigationIds.includes(item.id)
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </Section>
)}

              {w5Step === 5 && (
  <Section
    title={
      locale === "en"
        ? "Prepare reminders for students"
        : locale === "zh-Hant"
        ? "整理給同學看的使用提醒"
        : "整理给同学看的使用提醒"
    }
    description={
      locale === "en"
        ? "Before making the final reminder card, decide which situations can use AI, which are simple enough to check directly, and which need a person to confirm."
        : locale === "zh-Hant"
        ? "在整理最後的提醒卡前，先判斷哪些情況可以參考 AI，哪些情況簡單檢查就夠，哪些情況需要由人確認。"
        : "在整理最后的提醒卡前，先判断哪些情况可以参考 AI，哪些情况简单检查就够，哪些情况需要由人确认。"
    }
  >
    <div className="space-y-5">
      <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
        {locale === "en"
          ? "These choices will help build the final reminder card. The goal is not to use AI everywhere, but to know when to use it carefully."
          : locale === "zh-Hant"
          ? "這些選擇會用來整理最後的提醒卡。重點不是甚麼都用 AI，而是知道甚麼時候要小心使用。"
          : "这些选择会用来整理最后的提醒卡。重点不是什么都用 AI，而是知道什么时候要小心使用。"}
      </div>

      <DragBoard
        title={
          locale === "en"
            ? "Sort the situations"
            : locale === "zh-Hant"
            ? "把情況分一分"
            : "把情况分一分"
        }
        description={
          locale === "en"
            ? "Drag each situation into the most suitable place."
            : locale === "zh-Hant"
            ? "把每個情況拖到最合適的位置。"
            : "把每个情况拖到最合适的位置。"
        }
          allAssignedLabel={
    locale === "en"
      ? "All situations have been placed."
      : locale === "zh-Hant"
      ? "所有情況都已放入欄目。"
      : "所有情况都已放入栏目。"
  }
  selectedHintLabel={
    locale === "en"
      ? "One situation is selected. You can drag it, or click a target column."
      : locale === "zh-Hant"
      ? "已選中一個情況。你可以拖動它，或直接點擊目標欄。"
      : "已选中一个情况。你可以拖拽它，或直接点击目标栏目。"
  }
        unassignedLabel={
          locale === "en"
            ? "Situations to sort"
            : locale === "zh-Hant"
            ? "待分類情況"
            : "待分类情况"
        }
        emptyLabel={
          locale === "en"
            ? "Drag a card here."
            : locale === "zh-Hant"
            ? "把卡片拖到這裏。"
            : "把卡片拖到这里。"
        }
        cards={w5ResourceTriageCards}
        columns={[
          {
            id: "worth_using_ai",
            title:
              locale === "en"
                ? "AI can help"
                : locale === "zh-Hant"
                ? "可以參考 AI"
                : "可以参考 AI",
            note:
              locale === "en"
                ? "For many examples or repeated checking."
                : locale === "zh-Hant"
                ? "適合例子很多、需要反覆檢查的情況。"
                : "适合例子很多、需要反复检查的情况。",
          },
          {
            id: "simple_method_first",
            title:
              locale === "en"
                ? "Simple check is enough"
                : locale === "zh-Hant"
                ? "簡單檢查就夠"
                : "简单检查就够",
            note:
              locale === "en"
                ? "For clear and simple cases."
                : locale === "zh-Hant"
                ? "適合清楚、簡單的情況。"
                : "适合清楚、简单的情况。",
          },
          {
            id: "ai_assist_human_check",
            title:
              locale === "en"
                ? "AI helps, person confirms"
                : locale === "zh-Hant"
                ? "AI 幫忙，人來確認"
                : "AI 帮忙，人来确认",
            note:
              locale === "en"
                ? "For uncertain cases or results that may affect people."
                : locale === "zh-Hant"
                ? "適合不確定，或結果可能影響人的情況。"
                : "适合不确定，或结果可能影响人的情况。",
          },
        ]}
        allocation={w5ResourceTriageAllocation}
        onAssign={setW5ResourceTriage}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">
          {locale === "en"
            ? "Reminder to students"
            : locale === "zh-Hant"
            ? "給同學看的提醒"
            : "给同学看的提醒"}
        </div>

        <p className="mb-3 text-sm leading-6 text-slate-500">
          {locale === "en"
            ? "Choose reminders that should appear on the final reminder card."
            : locale === "zh-Hant"
            ? "選擇應該出現在最後提醒卡上的內容。"
            : "选择应该出现在最后提醒卡上的内容。"}
        </p>

        <div className="flex flex-wrap gap-2">
          {w5ReminderOptions.map((item) => (
            <TagButton
              key={item.id}
              active={w5Reminders.includes(item.id)}
              onClick={() => toggleValue(item.id, w5Reminders, setW5Reminders)}
            >
              {item.label}
            </TagButton>
          ))}
        </div>
      </div>
    </div>
  </Section>
)}

              {w5Step === 6 && (
                <Section
                title={
  locale === "en"
    ? "Check the reminder card"
    : locale === "zh-Hant"
    ? "檢查提醒卡"
    : "检查提醒卡"
}  
                description={
  locale === "en"
    ? "The card below is drafted from your previous choices. Read it, revise anything unclear, and then submit."
    : locale === "zh-Hant"
    ? "下面的提醒卡會根據你前面的選擇先整理成草稿。請讀一讀，修改不清楚的地方，再提交。"
    : "下面的提醒卡会根据你前面的选择先整理成草稿。请读一读，修改不清楚的地方，再提交。"
}
                >
                  <div className="mb-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div className="text-sm font-semibold text-emerald-900">
        {locale === "en"
          ? "Draft built from your choices"
          : locale === "zh-Hant"
          ? "根據你的選擇整理草稿"
          : "根据你的选择整理草稿"}
      </div>
      <p className="mt-1 text-xs leading-5 text-emerald-700">
        {locale === "en"
          ? "This draft is not a perfect answer. You can change it before submitting."
          : locale === "zh-Hant"
          ? "這份草稿不是標準答案。提交前你可以自己修改。"
          : "这份草稿不是标准答案。提交前你可以自己修改。"}
      </p>
    </div>

    <Button variant="secondary" onClick={() => fillW5CardDraft(true)}>
      {locale === "en"
        ? "Update draft"
        : locale === "zh-Hant"
        ? "更新草稿"
        : "更新草稿"}
    </Button>
  </div>
</div>
                  <div className="grid gap-4 md:grid-cols-2">
  <label className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>🎯</span>
      {locale === "en"
        ? "Purpose"
        : locale === "zh-Hant"
        ? "用途"
        : "用途"}
    </div>
    <textarea
      value={w5Card.purpose}
      onChange={(e) => {
        markW5CardEdited("purpose");
        setW5Card((prev) => ({ ...prev, purpose: e.target.value }));
      }}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400"
      placeholder={
        locale === "en"
          ? "Write one sentence, at least 8 words: What is this AI system for?"
          : locale === "zh-Hant"
          ? "請寫 1 句，至少 8 個字：這個 AI 系統是用來做甚麼的？"
          : "请写 1 句，至少 8 个字：这个 AI 系统是用来做什么的？"
      }
    />
  </label>

  <label className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>👥</span>
      {locale === "en"
        ? "Intended users"
        : locale === "zh-Hant"
        ? "使用對象"
        : "使用对象"}
    </div>
    <textarea
      value={w5Card.intendedUsers}
      onChange={(e) => {
        markW5CardEdited("intendedUsers");
        setW5Card((prev) => ({ ...prev, intendedUsers: e.target.value }));
      }}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400"
      placeholder={
        locale === "en"
          ? "Write one sentence, at least 8 words: Who will use this system?"
          : locale === "zh-Hant"
          ? "請寫 1 句，至少 8 個字：誰會使用這個系統？"
          : "请写 1 句，至少 8 个字：谁会使用这个系统？"
      }
    />
  </label>

  <label className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>🖼️</span>
      {locale === "en"
        ? "Training examples"
        : locale === "zh-Hant"
        ? "訓練例子"
        : "训练例子"}
    </div>
    <textarea
      value={w5Card.trainingData}
      onChange={(e) => {
        markW5CardEdited("trainingData");
        setW5Card((prev) => ({ ...prev, trainingData: e.target.value }));
      }}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400"
      placeholder={
        locale === "en"
          ? "Write one sentence, at least 8 words: What training examples does it need?"
          : locale === "zh-Hant"
          ? "請寫 1 句，至少 8 個字：它需要甚麼樣的訓練資料？"
          : "请写 1 句，至少 8 个字：它需要什么样的训练数据？"
      }
    />
  </label>

  <label className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>⚠️</span>
      {locale === "en"
        ? "Possible limits"
        : locale === "zh-Hant"
        ? "可能限制"
        : "可能限制"}
    </div>
    <textarea
      value={w5Card.limits}
      onChange={(e) => {
        markW5CardEdited("limits");
        setW5Card((prev) => ({ ...prev, limits: e.target.value }));
      }}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400"
      placeholder={
        locale === "en"
          ? "Write one sentence, at least 8 words: When might it still make mistakes?"
          : locale === "zh-Hant"
          ? "請寫 1 句，至少 8 個字：它在哪些情況下還可能會錯？"
          : "请写 1 句，至少 8 个字：它在哪些情况下还可能会错？"
      }
    />
  </label>

  <label className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>🧑‍🏫</span>
      {locale === "en"
        ? "Human checking"
        : locale === "zh-Hant"
        ? "人類檢查"
        : "人类检查"}
    </div>
    <textarea
      value={w5Card.humanCheck}
      onChange={(e) => {
        markW5CardEdited("humanCheck");
        setW5Card((prev) => ({ ...prev, humanCheck: e.target.value }));
      }}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400"
      placeholder={
        locale === "en"
          ? "Write one sentence, at least 8 words: When should a person check the result?"
          : locale === "zh-Hant"
          ? "請寫 1 句，至少 8 個字：甚麼時候需要人來檢查？"
          : "请写 1 句，至少 8 个字：什么时候需要人来检查？"
      }
    />
  </label>

  <label className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>💬</span>
      {locale === "en"
        ? "User reminder"
        : locale === "zh-Hant"
        ? "使用提醒"
        : "使用提醒"}
    </div>
    <textarea
      value={w5Card.reminder}
      onChange={(e) => {
        markW5CardEdited("reminder");
        setW5Card((prev) => ({ ...prev, reminder: e.target.value }));
      }}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400"
      placeholder={
        locale === "en"
          ? "Write one sentence, at least 8 words: What should students remember when using it?"
          : locale === "zh-Hant"
          ? "請寫 1 句，至少 8 個字：使用時要提醒同學注意甚麼？"
          : "请写 1 句，至少 8 个字：使用时要提醒同学注意什么？"
      }
    />
  </label>

  <label className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span>🛠️</span>
      {locale === "en"
        ? "Next improvement"
        : locale === "zh-Hant"
        ? "下一步改進"
        : "下一步改进"}
    </div>
    <textarea
      value={w5Card.improve}
      onChange={(e) => {
        markW5CardEdited("improve");
        setW5Card((prev) => ({ ...prev, improve: e.target.value }));
      }}
      className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400"
      placeholder={
        locale === "en"
          ? "Write one sentence, at least 8 words: What would you improve next?"
          : locale === "zh-Hant"
          ? "請寫 1 句，至少 8 個字：我還建議怎樣繼續改？"
          : "请写 1 句，至少 8 个字：我还建议怎么继续改？"
      }
    />
  </label>
</div>

<div className="mt-5 flex justify-end">
  <Button
    disabled={
      !(
        w5Card.purpose.trim().length > 5 &&
        w5Card.intendedUsers.trim().length > 5 &&
        w5Card.trainingData.trim().length > 5 &&
        w5Card.limits.trim().length > 5 &&
        w5Card.humanCheck.trim().length > 5 &&
        w5Card.improve.trim().length > 5
      )
    }
    onClick={() => void finishWorld("w5")}
  >
    {locale === "en"
      ? "Submit reminder card"
      : locale === "zh-Hant"
      ? "提交提醒卡"
      : "提交提醒卡"}
  </Button>
                  </div>
                </Section>
              )}

               
                <Nav
                  locale={locale}
                  step={w5Step}
                  setStep={setW5Step}
                  maxStep={6}
                  canNext={
                    (w5Step === 0 && w5FailureCueIds.length >= 2) ||
                    (w5Step === 1 && w5CauseIds.length > 0 && !!w5SystemImprovementChoice) ||
                    (w5Step === 2 &&
  !!w5SystemComparisonChoiceByCase.crushed_paper_box &&
  w5SystemComparisonReasonTags.length >= 1) ||
                    (w5Step === 3 && w5Training.length > 0) ||
                    (w5Step === 4 &&
  w5UnfairOutcomeIds.length > 0 &&
  w5BiasMitigationIds.length > 0) ||
                    (w5Step === 5 &&
  Object.keys(w5ResourceTriageAllocation).length >= 3 &&
  w5Reminders.length >= 1)
                  }
                />
            
            </motion.div>
          )}
        </AnimatePresence>

        {!sessionId && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 2147483647,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      backgroundColor: "rgba(15, 23, 42, 0.76)",
      backdropFilter: "blur(8px)",
      boxSizing: "border-box",
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      style={{
        width: "min(680px, calc(100vw - 48px))",
        maxHeight: "88vh",
        overflow: "hidden",
        borderRadius: "30px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 28px 90px rgba(15, 23, 42, 0.38)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxHeight: "88vh",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 22px",
            borderBottom: "1px solid #e5e7eb",
            background:
              "linear-gradient(135deg, #eef2ff 0%, #ffffff 52%, #ecfeff 100%)",
            boxSizing: "border-box",
          }}
        >
          {/* Top toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              padding: "8px 10px",
              marginBottom: "18px",
              borderRadius: "18px",
              backgroundColor: "rgba(255, 255, 255, 0.78)",
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#475569",
                whiteSpace: "nowrap",
              }}
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              {locale === "en"
                ? "Before you start"
                : locale === "zh-Hant"
                ? "開始前"
                : "开始前"}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              <LanguageSwitcher locale={locale} onChange={changeLocale} />

              <Link
                href="/teacher"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "9px 16px",
                  borderRadius: "999px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 3px 10px rgba(15, 23, 42, 0.10)",
                  color: "#334155",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {locale === "en"
                  ? "Teacher Portal"
                  : locale === "zh-Hant"
                  ? "進入教師端"
                  : "进入教师端"}
              </Link>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "18px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 8px 18px rgba(15, 23, 42, 0.18)",
              }}
            >
              <Map className="h-5 w-5" />
            </div>

            <div style={{ minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "28px",
                  lineHeight: 1.2,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {studentEntryText[locale].title}
              </h2>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#475569",
                  fontSize: "15px",
                  lineHeight: 1.8,
                }}
              >
                {studentEntryText[locale].note}
              </p>
            </div>
          </div>

          {/* Intro card */}
          <div
            style={{
              marginTop: "18px",
              padding: "16px 18px",
              borderRadius: "22px",
              border: "1px solid #e2e8f0",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {studentEntryText[locale].introTitle}
            </h3>

            <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
              {studentEntryText[locale].introPoints.map((point) => (
                <div
                  key={point}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "999px",
                      backgroundColor: "#d1fae5",
                      color: "#059669",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  >
                    ✓
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          style={{
            padding: "20px 28px 24px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "19px",
                lineHeight: 1.3,
                fontWeight: 700,
              }}
            >
              {locale === "en"
                ? "Your information"
                : locale === "zh-Hant"
                ? "你的資料"
                : "你的信息"}
            </h3>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {studentEntryText[locale].required}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              columnGap: "16px",
              rowGap: "14px",
              boxSizing: "border-box",
            }}
          >
            <label style={{ display: "block", minWidth: 0 }}>
              <div
                style={{
                  marginBottom: "6px",
                  color: "#334155",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {studentEntryText[locale].name}
              </div>
              <input
                value={identity.studentName}
                onChange={(e) =>
                  setIdentity((prev) => ({
                    ...prev,
                    studentName: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "16px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  padding: "0 14px",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label style={{ display: "block", minWidth: 0 }}>
              <div
                style={{
                  marginBottom: "6px",
                  color: "#334155",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {studentEntryText[locale].code}
              </div>
              <input
                value={identity.studentCode}
                onChange={(e) =>
                  setIdentity((prev) => ({
                    ...prev,
                    studentCode: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "16px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  padding: "0 14px",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label style={{ display: "block", minWidth: 0 }}>
              <div
                style={{
                  marginBottom: "6px",
                  color: "#334155",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {studentEntryText[locale].className}
              </div>
              <input
                value={identity.className}
                onChange={(e) =>
                  setIdentity((prev) => ({
                    ...prev,
                    className: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "16px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  padding: "0 14px",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label style={{ display: "block", minWidth: 0 }}>
              <div
                style={{
                  marginBottom: "6px",
                  color: "#334155",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {studentEntryText[locale].grade}
              </div>
              <input
                value={identity.gradeLevel}
                onChange={(e) =>
                  setIdentity((prev) => ({
                    ...prev,
                    gradeLevel: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "16px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  padding: "0 14px",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label
              style={{
                display: "block",
                minWidth: 0,
                gridColumn: "1 / -1",
              }}
            >
              <div
                style={{
                  marginBottom: "6px",
                  color: "#334155",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {studentEntryText[locale].school}
              </div>
              <input
                value={identity.schoolName}
                onChange={(e) =>
                  setIdentity((prev) => ({
                    ...prev,
                    schoolName: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "16px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#f8fafc",
                  padding: "0 14px",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          {identityError ? (
            <div
              style={{
                marginTop: "14px",
                borderRadius: "16px",
                border: "1px solid #fecdd3",
                backgroundColor: "#fff1f2",
                padding: "10px 14px",
                color: "#be123c",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              {identityError}
            </div>
          ) : null}

          <div
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              borderRadius: "22px",
              backgroundColor: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {locale === "en"
                ? "Fill in the required fields, then start the missions."
                : locale === "zh-Hant"
                ? "填好必要資料後，就可以開始任務。"
                : "填好必要信息后，就可以开始任务。"}
            </p>

            <button
              onClick={startStudentSession}
              disabled={startingSession}
              style={{
                minWidth: "128px",
                height: "44px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: startingSession ? "not-allowed" : "pointer",
                opacity: startingSession ? 0.6 : 1,
                boxShadow: "0 10px 22px rgba(15, 23, 42, 0.20)",
                flexShrink: 0,
              }}
            >
              {startingSession
                ? studentEntryText[locale].starting
                : studentEntryText[locale].start}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
