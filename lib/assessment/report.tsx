import type { ReactNode } from "react";
import { labelList, labelOf, type AssessmentLocale } from "./labels";

export type ProcessEvidenceItem = {
  competenceIds: string[];
  label: string;
  value: ReactNode;
};

type SessionDetailLike = {
  responses: any[];
  chats: any[];
  submissions: any[];
  scores?: any[];
  teacherRatings?: any[];
};

function safeJson(value: any) {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return typeof value === "object" && !Array.isArray(value) ? value : {};
}

function arr(value: any): any[] {
  return Array.isArray(value) ? value : [];
}

function str(value: any): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function getResponse(data: SessionDetailLike, stepId: string) {
  return safeJson(data.responses.find((r) => r.stepId === stepId)?.responseJson);
}

function noValue(locale: AssessmentLocale) {
  return locale === "en" ? "—" : "—";
}

function textOrDash(value: any, locale: AssessmentLocale) {
  const text = str(value).trim();
  return text ? text : noValue(locale);
}
function firstNonEmptyText(...values: any[]) {
  for (const value of values) {
    const text = str(value).trim();
    if (text) return text;
  }
  return "";
}

function LocalLabel(locale: AssessmentLocale, zhHans: string, zhHant: string, en: string) {
  return locale === "en" ? en : locale === "zh-Hant" ? zhHant : zhHans;
}

function MiniBlock({ children }: { children: ReactNode }) {
  return <div className="rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700">{children}</div>;
}

function MultiLineText({ value }: { value: any }) {
  const text = str(value).trim();
  if (!text) return <>—</>;
  return <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700">{text}</div>;
}

function ClaimReviewList({ items, locale }: { items: any[]; locale: AssessmentLocale }) {
  if (!items.length) return <>—</>;

  return (
    <div className="space-y-2">
      {items.map((item: any, index: number) => (
        <div key={item.id ?? index} className="rounded-xl bg-slate-50 p-3">
          <div className="text-sm leading-7 text-slate-800">
            {index + 1}. {textOrDash(item.text, locale)}
          </div>
          <div className="mt-1 text-xs font-medium text-slate-500">
            {LocalLabel(locale, "学生判断", "學生判斷", "Student judgement")}：
            {item.studentChoiceLabel || labelOf(str(item.studentChoice), locale)}
          </div>
        </div>
      ))}
    </div>
  );
}

function looksLikeInternalId(value: string) {
  return /^[a-z0-9_]+$/.test(value.trim());
}

function SnapshotItemList({
  items,
  locale,
}: {
  items: any[];
  locale: AssessmentLocale;
}) {
  if (!items.length) return <>—</>;

  return (
    <div className="space-y-2">
      {items.map((item: any, index: number) => {
        const rawTitle = String(item.title ?? item.label ?? item.id ?? "");
        const title =
          rawTitle && looksLikeInternalId(rawTitle)
            ? labelOf(rawTitle, locale)
            : rawTitle || "—";

        const rawNote = String(
          item.note ?? item.description ?? item.status ?? item.type ?? ""
        ).trim();

        const note =
          rawNote && looksLikeInternalId(rawNote)
            ? labelOf(rawNote, locale)
            : rawNote;

        return (
          <div key={item.id ?? index} className="rounded-xl bg-slate-50 p-3">
            <div className="font-medium text-slate-900">{title}</div>
            {note ? (
              <div className="mt-1 text-sm leading-6 text-slate-600">
                {note}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function buildProcessEvidence(
  data: SessionDetailLike,
  worldId: string,
  locale: AssessmentLocale
): ProcessEvidenceItem[] {
  if (worldId === "w1") {
    const s2 = getResponse(data, "w1_step2");
    const s3 = getResponse(data, "w1_step3");
    const rulesObj = safeJson(s3.rules);
    const rulesFromObject = Object.entries(rulesObj)
      .filter(([, v]) => v === true)
      .map(([k]) => k);
    const rules = Array.from(new Set([...rulesFromObject, ...arr(s3.selectedRuleIds), ...arr(s3.ruleIds), ...arr(s3.aiUseRuleIds)]));

    return [
      {
        competenceIds: ["E3"],
        label: LocalLabel(locale, "最有帮助的推荐方式", "最有幫助的推薦方式", "Most helpful recommendation mode"),
        value: labelOf(str(s2.helpfulModeId ?? s2.bestMode), locale),
      },
      {
        competenceIds: ["E3"],
        label: LocalLabel(locale, "可能越推越窄的推荐方式", "可能愈推愈窄的推薦方式", "Recommendation mode that may narrow learning choices"),
        value: labelOf(str(s2.narrowModeId ?? s2.narrowMode), locale),
      },
      {
        competenceIds: ["E3"],
        label: LocalLabel(locale, "学生选择的理由", "學生選擇的理由", "Reasons selected by the student"),
        value: labelList([...arr(s2.helpfulReasonTags), ...arr(s2.narrowReasonTags)], locale).join("；"),
      },
      {
        competenceIds: ["M5"],
        label: LocalLabel(locale, "系统使用规则", "系統使用規則", "System-use rules selected"),
        value: labelList(rules as string[], locale).join("；"),
      },
    ];
  }

  if (worldId === "w2") {
    const s1 = getResponse(data, "w2_step1");
    const s2 = getResponse(data, "w2_step2");
    const s3 = getResponse(data, "w2_step3");
    const s4 = getResponse(data, "w2_step4");
    const claimItems = arr(s3.claimReviewItems);

    return [
      {
        competenceIds: ["E1"],
        label: LocalLabel(locale, "AI 在任务中的角色", "AI 在任務中的角色", "AI role in the information task"),
        value: labelOf(str(s1.aiRoleChoiceId ?? s1.choice), locale),
      },
      {
        competenceIds: ["E1"],
        label: LocalLabel(locale, "最终发布决定", "最終發布決定", "Who made the final publication decision"),
        value: labelOf(str(s1.finalDecisionBy), locale),
      },
      {
        competenceIds: ["E2"],
        label: LocalLabel(locale, "选择的 AI 草稿及内容", "選擇的 AI 草稿及內容", "Chosen AI draft and content"),
        value: (
          <div className="space-y-2">
            <div className="font-medium">{textOrDash(s2.selectedDraftTitle ?? labelOf(str(s2.draftChoiceId ?? s2.choice), locale), locale)}</div>
            <MultiLineText value={s2.selectedDraftText} />
          </div>
        ),
      },
            {
        competenceIds: ["E2"],
        label: LocalLabel(
          locale,
          "可选：发布前确认方法",
          "可選：發布前確認方法",
          "Optional source-checking action"
        ),
        value:
          s3.sourceCheckViewed || s4.sourceCheckViewed || s3.sourceCheckChoice || s4.sourceCheckChoice ? (
            <MiniBlock>
              <div>
                {LocalLabel(locale, "是否查看确认方法", "是否查看確認方法", "Viewed checking choices")}：
                {s3.sourceCheckViewed || s4.sourceCheckViewed
                  ? LocalLabel(locale, "是", "是", "Yes")
                  : LocalLabel(locale, "否", "否", "No")}
              </div>
              <div>
                {LocalLabel(locale, "学生选择", "學生選擇", "Student choice")}：
                {labelOf(str(s3.sourceCheckChoice ?? s4.sourceCheckChoice), locale)}
              </div>
            </MiniBlock>
          ) : (
            noValue(locale)
          ),
      },
      {
        competenceIds: ["E2"],
        label: LocalLabel(locale, "逐句核查内容", "逐句核查內容", "Claim-by-claim checking"),
        value: <ClaimReviewList items={claimItems} locale={locale} />,
      },
      {
        competenceIds: ["E2"],
        label: LocalLabel(locale, "发布前理由", "發布前理由", "Reason before publication"),
        value: <MultiLineText value={s4.finalReason ?? s4.reason} />,
      },
    ];
  }

  if (worldId === "w3") {
    const s1 = getResponse(data, "w3_step1");
    const s2 = getResponse(data, "w3_step2");
    const s3 = getResponse(data, "w3_step3");
    const s4 = getResponse(data, "w3_step4");
    const s5 = getResponse(data, "w3_step5");
    const s7 = getResponse(data, "w3_step7");

    const chatTurns = (data.chats ?? []).filter((turn: any) => turn.worldId === "w3");
    const studentTurns = chatTurns.filter((turn: any) => turn.role === "user" || turn.role === "student");
    const aiTurns = chatTurns.filter((turn: any) => turn.role === "ai");
    const latestStudentPrompt = firstNonEmptyText(
  s3.visibleUserMessage,
  s3.promptText,
  s3.rawPromptText,
  s3.prompt,
  studentTurns[studentTurns.length - 1]?.content,
  studentTurns[studentTurns.length - 1]?.text,
  studentTurns[studentTurns.length - 1]?.message
);

const latestAiReply = firstNonEmptyText(
  s3.aiReply,
  s3.rewritten,
  s3.aiRewritten,
  s3.aiText,
  aiTurns[aiTurns.length - 1]?.content,
  aiTurns[aiTurns.length - 1]?.text,
  aiTurns[aiTurns.length - 1]?.message
);
    const formatAndElements = [
      labelOf(str(s4.selectedFormatId ?? s4.presentationFormat), locale),
      ...labelList(arr(s4.selectedDesignElementIds) as string[], locale),
    ].filter((x) => x && x !== "—").join("；");

    const materialNotes = [
      ...labelList(arr(s5.selectedAssetIds) as string[], locale),
      ...arr(s5.creditNotes),
      labelOf(str(s5.disclosureChoiceId), locale),
      labelOf(str(s5.attributionChoiceId), locale),
      s5.keptOwnSentence ? LocalLabel(locale, "保留了自己的原句/例子/判断", "保留了自己的原句／例子／判斷", "Kept own sentence/example/judgement") : "",
    ].filter((x) => x && x !== "—").join("；");

    return [
      {
        competenceIds: ["C4"],
        label: LocalLabel(locale, "选择的对象", "選擇的對象", "Recipient chosen"),
        value: labelOf(str(s1.recipientId ?? s1.recipient ?? s2.recipient), locale),
      },
      {
        competenceIds: ["C4"],
        label: LocalLabel(locale, "学生初稿", "學生初稿", "Student first draft"),
        value: <MultiLineText value={s2.firstDraftText ?? s2.draft} />,
      },
      {
        competenceIds: ["C3", "C4"],
        label: LocalLabel(locale, "学生给 AI 的修改要求", "學生給 AI 的修改要求", "Student request to AI"),
        value: <MultiLineText value={latestStudentPrompt} />,
      },
      {
        competenceIds: ["C3", "C4"],
        label: LocalLabel(locale, "AI 回复", "AI 回覆", "AI reply"),
        value: <MultiLineText value={latestAiReply} />,
      },
      {
        competenceIds: ["C2", "C4"],
        label: LocalLabel(locale, "卡片形式与保留元素", "卡片形式與保留元素", "Card format and selected elements"),
        value: formatAndElements || noValue(locale),
      },
      {
        competenceIds: ["C4"],
        label: LocalLabel(locale, "素材与 AI 辅助说明", "素材與 AI 輔助說明", "Material and AI-use notes"),
        value: materialNotes || noValue(locale),
      },
      {
        competenceIds: ["C4"],
        label: LocalLabel(locale, "学生最终卡片", "學生最終卡片", "Student final card"),
        value: <MultiLineText value={s7.finalText} />,
      },
    ];
  }

  if (worldId === "w4") {
  const s2 = getResponse(data, "w4_step2");
  const s3 = getResponse(data, "w4_step3");
  const s4 = getResponse(data, "w4_step4");

  const responsibilities = safeJson(s2.taskResponsibilityById);
  const workflowAllocation = safeJson(
    s2.workflowAllocation ?? s4.workflowAllocation
  );

  const aiTasks = Object.entries(responsibilities)
    .filter(([, v]) =>
      ["ai", "ai_auto", "ai_assist_human_check", "ai_assisted_human_check"].includes(
        String(v)
      )
    )
    .map(([k]) => k);

  const humanTasks = arr(s4.humanStillDoIds ?? s2.humanTasks);
  const rules = arr(s4.aiUseRuleIds ?? s4.rules);

  return [
    {
      competenceIds: ["M1"],
      label: LocalLabel(
        locale,
        "AI 可以先协助的任务",
        "AI 可以先協助的任務",
        "Tasks AI can support first"
      ),
      value: labelList(aiTasks, locale).join("；") || noValue(locale),
    },
    {
      competenceIds: ["M1"],
      label: LocalLabel(
        locale,
        "学生给 AI 选择的角色",
        "學生給 AI 選擇的角色",
        "Role selected for AI"
      ),
     value: labelOf(
  str(s3.aiRoleId ?? s3.aiRole ?? s3.selectedRoleId ?? s3.roleId),
  locale
),
    },
    {
      competenceIds: ["M2"],
      label: LocalLabel(
        locale,
        "人仍然负责的任务",
        "人仍然負責的任務",
        "Tasks kept under human responsibility"
      ),
      value: labelList(humanTasks, locale).join("；") || noValue(locale),
    },
    {
      competenceIds: ["M4"],
      label: LocalLabel(
        locale,
        "工作流程分配",
        "工作流程分配",
        "Workflow delegation"
      ),
      value: Object.entries(workflowAllocation).length
        ? Object.entries(workflowAllocation)
            .map(
              ([taskId, mode]) =>
                `${labelOf(String(taskId), locale)} → ${labelOf(
                  String(mode),
                  locale
                )}`
            )
            .join("；")
        : noValue(locale),
    },
    {
      competenceIds: ["M5"],
      label: LocalLabel(
        locale,
        "小组决定的 AI 使用规则",
        "小組決定的 AI 使用規則",
        "Group AI-use rules"
      ),
      value: labelList(rules, locale).join("；") || noValue(locale),
    },
  ];
}

  if (worldId === "w5") {
  const s1 = getResponse(data, "w5_step1");
  const s2 = getResponse(data, "w5_step2");
  const s3 = getResponse(data, "w5_step3");
  const s4 = getResponse(data, "w5_step4");
  const s5 = getResponse(data, "w5_step5");
  const s6 = getResponse(data, "w5_step6");
  const s7 = getResponse(data, "w5_step7");

  const resourceAllocation = safeJson(s6.resourceTriageAllocation);
  const comparisonChoices = safeJson(s3.systemComparisonChoiceByCase);
  const trainingItems = Array.isArray(s4.selectedTrainingImageItems)
    ? s4.selectedTrainingImageItems
    : [];

  return [
    {
      competenceIds: ["D1"],
      label: LocalLabel(
        locale,
        "学生发现的错误线索",
        "學生發現的錯誤線索",
        "Failure cues identified by the student"
      ),
      value: labelList(arr(s1.failureCueIds), locale).join("；") || noValue(locale),
    },
    {
      competenceIds: ["D1", "D3"],
      label: LocalLabel(
        locale,
        "错误原因与改进方向",
        "錯誤原因與改進方向",
        "Likely cause and improvement direction"
      ),
      value:
        [
          labelOf(str(s2.causeChoiceId ?? s2.choice), locale),
          labelOf(str(s2.systemImprovementChoice), locale),
        ]
          .filter((x) => x && x !== "—")
          .join("；") || noValue(locale),
    },
    {
      competenceIds: ["D2"],
      label: LocalLabel(
        locale,
        "两种分类助手比较",
        "兩種分類助手比較",
        "Comparison of two sorting helpers"
      ),
      value: Object.entries(comparisonChoices).length
        ? Object.entries(comparisonChoices)
            .map(
              ([caseId, choice]) =>
                `${labelOf(String(caseId), locale)} → ${labelOf(
                  String(choice),
                  locale
                )}`
            )
            .join("；")
        : noValue(locale),
    },
    {
      competenceIds: ["D2"],
      label: LocalLabel(
        locale,
        "比较理由",
        "比較理由",
        "Reasons for the comparison"
      ),
      value:
        labelList(arr(s3.systemComparisonReasonTags), locale).join("；") ||
        noValue(locale),
    },
    {
      competenceIds: ["D3"],
      label: LocalLabel(
        locale,
        "学生补充的训练例子",
        "學生補充的訓練例子",
        "Training examples selected by the student"
      ),
      value: trainingItems.length
        ? (
          <SnapshotItemList items={trainingItems} locale={locale} />
        )
        : labelList(
            arr(s4.selectedTrainingImageIds ?? s4.selectedTrainingImages),
            locale
          ).join("；") || noValue(locale),
    },
    {
      competenceIds: ["E4", "E7"],
      label: LocalLabel(
        locale,
        "长期出错可能带来的影响",
        "長期出錯可能帶來的影響",
        "Possible impact if the system keeps failing"
      ),
      value: (
        <MiniBlock>
          <div>
            {LocalLabel(locale, "可能受影响的人", "可能受影響的人", "Who may be affected")}：
            {labelList(arr(s5.affectedStakeholders), locale).join("；") ||
              noValue(locale)}
          </div>
          <div>
            {LocalLabel(locale, "可能发生的结果", "可能發生的結果", "Possible outcome")}：
            {labelList(arr(s5.unfairOutcomeIds), locale).join("；") ||
              noValue(locale)}
          </div>
          <div>
            {LocalLabel(locale, "可能原因", "可能原因", "Possible cause")}：
            {labelList(arr(s5.biasCauseLinkIds), locale).join("；") ||
              noValue(locale)}
          </div>
          <div>
            {LocalLabel(locale, "减少问题的方法", "減少問題的方法", "Mitigation")}：
            {labelList(arr(s5.biasMitigationIds), locale).join("；") ||
              noValue(locale)}
          </div>
        </MiniBlock>
      ),
    },
    {
      competenceIds: ["E5"],
      label: LocalLabel(
        locale,
        "什么时候不该直接依赖 AI",
        "甚麼時候不該直接依賴 AI",
        "When not to rely on AI directly"
      ),
      value:
        [
          labelOf(str(s6.aiResourceUseChoice), locale),
          ...labelList(arr(s6.resourceReasonTags), locale),
        ]
          .filter((x) => x && x !== "—")
          .join("；") || noValue(locale),
    },
    {
  competenceIds: ["D4", "E6"],
  label: LocalLabel(
    locale,
    "使用提醒与人类检查",
    "使用提醒與人類檢查",
    "Use reminders and human checking"
  ),
  value: (
    <MiniBlock>
      <div>
        {LocalLabel(
          locale,
          "学生选择的提醒",
          "學生選擇的提醒",
          "Selected reminders"
        )}
        ：
        {labelList(
          arr(
            s6.selectedReminderIds ??
              s6.selectedReminders ??
              s6.reminderIds ??
              s6.reminders
          ),
          locale
        ).join("；") || noValue(locale)}
      </div>

      <div>
        {LocalLabel(locale, "人类检查", "人類檢查", "Human checking")}：
        {textOrDash(s7.humanCheck, locale)}
      </div>

      <div>
        {LocalLabel(locale, "给同学的提醒", "給同學的提醒", "Reminder to students")}：
        {textOrDash(s7.reminder, locale)}
      </div>
    </MiniBlock>
  ),
},
    {
      competenceIds: ["D5"],
      label: LocalLabel(
        locale,
        "AI 分类提醒卡",
        "AI 分類提醒卡",
        "AI sorting reminder card"
      ),
      value: (
        <MiniBlock>
          <div>
            <strong>{LocalLabel(locale, "用途", "用途", "Purpose")}：</strong>
            {textOrDash(s7.purpose, locale)}
          </div>
          <div>
            <strong>{LocalLabel(locale, "使用对象", "使用對象", "Intended users")}：</strong>
            {textOrDash(s7.intendedUsers, locale)}
          </div>
          <div>
            <strong>{LocalLabel(locale, "训练例子", "訓練例子", "Training examples")}：</strong>
            {textOrDash(s7.trainingData, locale)}
          </div>
          <div>
            <strong>{LocalLabel(locale, "可能限制", "可能限制", "Possible limits")}：</strong>
            {textOrDash(s7.limits, locale)}
          </div>
          <div>
            <strong>{LocalLabel(locale, "人类检查", "人類檢查", "Human checking")}：</strong>
            {textOrDash(s7.humanCheck, locale)}
          </div>
          <div>
            <strong>{LocalLabel(locale, "使用提醒", "使用提醒", "User reminder")}：</strong>
            {textOrDash(s7.reminder, locale)}
          </div>
          <div>
            <strong>{LocalLabel(locale, "下一步改进", "下一步改進", "Next improvement")}：</strong>
            {textOrDash(s7.improve, locale)}
          </div>
        </MiniBlock>
      ),
    },
  ];
}
  return [];
}
