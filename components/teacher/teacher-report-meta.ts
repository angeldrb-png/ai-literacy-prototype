export type TeacherLocale = "zh-Hans" | "zh-Hant" | "en";
export type DomainKey = "engaging_with_ai" | "creating_with_ai" | "managing_ai" | "designing_ai";

export const DOMAIN_ORDER: DomainKey[] = [
  "engaging_with_ai",
  "creating_with_ai",
  "managing_ai",
  "designing_ai",
];

export const DOMAIN_META: Record<DomainKey, {
  short: Record<TeacherLocale, string>;
  full: Record<TeacherLocale, string>;
  meaning: Record<TeacherLocale, string>;
  focus: Record<TeacherLocale, string>;
}> = {
  engaging_with_ai: {
    short: { "zh-Hans": "与 AI 互动", "zh-Hant": "與 AI 互動", en: "Engaging with AI" },
    full: { "zh-Hans": "与 AI 互动 Engaging with AI", "zh-Hant": "與 AI 互動 Engaging with AI", en: "Engaging with AI" },
    meaning: {
      "zh-Hans": "学生能否识别 AI 的作用，判断 AI 输出是否可靠，并理解 AI 推荐、偏差或限制可能带来的影响。",
      "zh-Hant": "學生能否識別 AI 的作用，判斷 AI 輸出是否可靠，並理解 AI 推薦、偏差或限制可能帶來的影響。",
      en: "Whether the student can identify AI's role, evaluate AI outputs, and understand how AI recommendations, biases, or limits may affect people.",
    },
    focus: {
      "zh-Hans": "建议关注：学生是否能说明为什么不能直接相信 AI 输出。",
      "zh-Hant": "建議關注：學生是否能說明為什麼不能直接相信 AI 輸出。",
      en: "Teaching focus: whether the student can explain why AI output should be checked before use.",
    },
  },
  creating_with_ai: {
    short: { "zh-Hans": "与 AI 共创", "zh-Hant": "與 AI 共創", en: "Creating with AI" },
    full: { "zh-Hans": "与 AI 共创 Creating with AI", "zh-Hant": "與 AI 共創 Creating with AI", en: "Creating with AI" },
    meaning: {
      "zh-Hans": "学生能否用 AI 支持表达、改写、可视化或创作，同时保留自己的想法、作者责任和判断。",
      "zh-Hant": "學生能否用 AI 支持表達、改寫、可視化或創作，同時保留自己的想法、作者責任和判斷。",
      en: "Whether the student can use AI to support expression, revision, visualisation, or creation while keeping their own ideas, authorship responsibility, and judgement.",
    },
    focus: {
      "zh-Hans": "建议关注：学生是否只是照搬 AI，还是能选择性使用和修改 AI 建议。",
      "zh-Hant": "建議關注：學生是否只是照搬 AI，還是能選擇性使用和修改 AI 建議。",
      en: "Teaching focus: whether the student copies AI output or selectively uses and revises it.",
    },
  },
  managing_ai: {
    short: { "zh-Hans": "管理 AI 使用", "zh-Hant": "管理 AI 使用", en: "Managing AI" },
    full: { "zh-Hans": "管理 AI 使用 Managing AI", "zh-Hant": "管理 AI 使用 Managing AI", en: "Managing AI" },
    meaning: {
      "zh-Hans": "学生能否决定什么时候使用 AI、让 AI 做什么，以及哪些判断仍然要由人负责。",
      "zh-Hant": "學生能否決定什麼時候使用 AI、讓 AI 做什麼，以及哪些判斷仍然要由人負責。",
      en: "Whether the student can decide when to use AI, what AI should do, and what should remain human responsibility.",
    },
    focus: {
      "zh-Hans": "建议关注：学生是否能清楚区分 AI 可以辅助的任务和人必须负责的任务。",
      "zh-Hant": "建議關注：學生是否能清楚區分 AI 可以輔助的任務和人必須負責的任務。",
      en: "Teaching focus: whether the student can separate AI-supportable tasks from human-responsible tasks.",
    },
  },
  designing_ai: {
    short: { "zh-Hans": "设计 AI 系统", "zh-Hant": "設計 AI 系統", en: "Designing AI" },
    full: { "zh-Hans": "设计 AI 系统 Designing AI", "zh-Hant": "設計 AI 系統 Designing AI", en: "Designing AI" },
    meaning: {
      "zh-Hans": "学生能否界定 AI 系统问题，比较设计选择，并提出数据、限制说明和使用规则上的改进。",
      "zh-Hant": "學生能否界定 AI 系統問題，比較設計選擇，並提出數據、限制說明和使用規則上的改進。",
      en: "Whether the student can define AI system problems, compare design choices, and suggest improvements in data, limitations communication, and use rules.",
    },
    focus: {
      "zh-Hans": "建议关注：学生是否能把系统错误和训练数据、规则或现实影响联系起来。",
      "zh-Hant": "建議關注：學生是否能把系統錯誤和訓練數據、規則或現實影響聯繫起來。",
      en: "Teaching focus: whether the student connects system errors with data, rules, or real-world impact.",
    },
  },
};

export function normalizeDomainId(value: any): DomainKey | "unknown" {
  const v = String(value ?? "").trim().toLowerCase().replace(/[\s_-]+/g, "_");
  if (["engaging", "engaging_with_ai", "engage", "e"].includes(v)) return "engaging_with_ai";
  if (["creating", "creating_with_ai", "create", "c"].includes(v)) return "creating_with_ai";
  if (["managing", "managing_ai", "managing_with_ai", "manage", "m"].includes(v)) return "managing_ai";
  if (["designing", "designing_ai", "designing_with_ai", "design", "d"].includes(v)) return "designing_ai";
  return "unknown";
}

export function domainLabel(key: DomainKey, locale: TeacherLocale) {
  return DOMAIN_META[key].full[locale];
}

export const COMPETENCE_ORDER: Record<DomainKey, string[]> = {
  engaging_with_ai: ["E1", "E2", "E3", "E4", "E5", "E6", "E7"],
  creating_with_ai: ["C1", "C2", "C3", "C4", "C5"],
  managing_ai: ["M1", "M2", "M3", "M4", "M5"],
  designing_ai: ["D1", "D2", "D3", "D4", "D5"],
};

export const COMPETENCE_META: Record<string, {
  domain: DomainKey;
  name: Record<TeacherLocale, string>;
  meaning: Record<TeacherLocale, string>;
}> = {
  E1: { domain: "engaging_with_ai", name: { "zh-Hans": "识别 AI 的作用", "zh-Hant": "識別 AI 的作用", en: "Recognise AI's role" }, meaning: { "zh-Hans": "学生能否看出 AI 在任务中是提供建议、整理信息还是生成草稿。", "zh-Hant": "學生能否看出 AI 在任務中是提供建議、整理資訊還是生成草稿。", en: "Whether the student recognises what role AI plays in the task." } },
  E2: { domain: "engaging_with_ai", name: { "zh-Hans": "判断 AI 输出是否可以使用", "zh-Hant": "判斷 AI 輸出是否可以使用", en: "Evaluate AI outputs before use" }, meaning: { "zh-Hans": "学生能否判断 AI 生成内容应该保留、修改、核查或删除。", "zh-Hant": "學生能否判斷 AI 生成內容應該保留、修改、核查或刪除。", en: "Whether the student can decide if AI output should be accepted, revised, checked, or rejected." } },
  E3: { domain: "engaging_with_ai", name: { "zh-Hans": "理解推荐系统的影响", "zh-Hant": "理解推薦系統的影響", en: "Understand recommendation effects" }, meaning: { "zh-Hans": "学生能否判断 AI 推荐怎样帮助学习，也可能怎样限制视野。", "zh-Hant": "學生能否判斷 AI 推薦怎樣幫助學習，也可能怎樣限制視野。", en: "Whether the student understands how AI recommendations can help and narrow learning opportunities." } },
  E4: { domain: "engaging_with_ai", name: { "zh-Hans": "识别 AI 偏差和不公平影响", "zh-Hant": "識別 AI 偏差和不公平影響", en: "Recognise AI bias and unfair impact" }, meaning: { "zh-Hans": "学生能否说明数据、规则或系统设计怎样让某些人或情境更容易受到不公平影响。", "zh-Hant": "學生能否說明數據、規則或系統設計怎樣讓某些人或情境更容易受到不公平影響。", en: "Whether the student explains how data, rules, or system design can unfairly affect some people or situations more than others." } },
  E5: { domain: "engaging_with_ai", name: { "zh-Hans": "权衡 AI 的资源和能源消耗", "zh-Hant": "權衡 AI 的資源和能源消耗", en: "Weigh AI resource use" }, meaning: { "zh-Hans": "学生能否意识到 AI 系统会消耗计算资源和能源，并判断什么时候值得使用 AI、什么时候应先用简单方法或保留人类检查。", "zh-Hant": "學生能否意識到 AI 系統會消耗計算資源和能源，並判斷什麼時候值得使用 AI、什麼時候應先用簡單方法或保留人類檢查。", en: "Whether the student can weigh AI's computing-resource and energy cost against task complexity, usefulness, and the need for human checking." } },
  E6: { domain: "engaging_with_ai", name: { "zh-Hans": "结合伦理和人类价值使用 AI", "zh-Hant": "結合倫理和人類價值使用 AI", en: "Use AI with values and ethics" }, meaning: { "zh-Hans": "学生能否在使用 AI 时考虑真实表达、责任、公平和人的判断。", "zh-Hant": "學生能否在使用 AI 時考慮真實表達、責任、公平和人的判斷。", en: "Whether the student considers responsibility, fairness, human judgement, and authentic expression when using AI." } },
  E7: { domain: "engaging_with_ai", name: { "zh-Hans": "连接技术限制与现实影响", "zh-Hant": "連接技術限制與現實影響", en: "Connect technical limits with real-world impact" }, meaning: { "zh-Hans": "学生能否说明 AI 技术错误可能影响哪些人或事情。", "zh-Hant": "學生能否說明 AI 技術錯誤可能影響哪些人或事情。", en: "Whether the student can connect AI technical limitations with possible impacts on people or situations." } },
  C1: { domain: "creating_with_ai", name: { "zh-Hans": "用 AI 拓展表达想法", "zh-Hant": "用 AI 拓展表達想法", en: "Use AI to expand ideas" }, meaning: { "zh-Hans": "学生能否用 AI 获得新的表达方式或从他人角度思考。", "zh-Hant": "學生能否用 AI 獲得新的表達方式或從他人角度思考。", en: "Whether the student uses AI to generate a new expression or perspective." } },
  C2: { domain: "creating_with_ai", name: { "zh-Hans": "用多种 AI 形式可视化和组合想法", "zh-Hant": "用多種 AI 形式可視化和組合想法", en: "Visualise and combine ideas with AI" }, meaning: { "zh-Hans": "学生能否比较不同 AI 生成形式，并组合适合对象和目的的表达方案。", "zh-Hant": "學生能否比較不同 AI 生成形式，並組合適合對象和目的的表達方案。", en: "Whether the student compares AI-generated formats and combines elements that fit the audience and purpose." } },
  C3: { domain: "creating_with_ai", name: { "zh-Hans": "与生成式 AI 协作修改", "zh-Hant": "與生成式 AI 協作修改", en: "Collaborate with generative AI" }, meaning: { "zh-Hans": "学生能否选择性使用、修改或拒绝 AI 的建议。", "zh-Hant": "學生能否選擇性使用、修改或拒絕 AI 的建議。", en: "Whether the student selectively uses, revises, or rejects AI suggestions." } },
  C4: { domain: "creating_with_ai", name: { "zh-Hans": "判断 AI 内容真实性、来源和归属", "zh-Hant": "判斷 AI 內容真實性、來源和歸屬", en: "Judge authenticity, source, and ownership" }, meaning: { "zh-Hans": "学生能否在 AI 辅助创作中保留作者责任，并注意素材授权、署名和 AI 辅助说明。", "zh-Hant": "學生能否在 AI 輔助創作中保留作者責任，並注意素材授權、署名和 AI 輔助說明。", en: "Whether the student keeps authorship responsibility and attends to permission, attribution, and AI-use disclosure in AI-supported creation." } },
  C5: { domain: "creating_with_ai", name: { "zh-Hans": "解释 AI 生成过程并避免拟人化", "zh-Hant": "解釋 AI 生成過程並避免擬人化", en: "Explain generation without anthropomorphism" }, meaning: { "zh-Hans": "学生能否说明 AI 根据提示和数据模式生成内容，而不是像人一样理解、关心或有意图。", "zh-Hant": "學生能否說明 AI 根據提示和數據模式生成內容，而不是像人一樣理解、關心或有意圖。", en: "Whether the student explains that AI generates from prompts and data patterns rather than human-like understanding, care, or intention." } },
  M1: { domain: "managing_ai", name: { "zh-Hans": "判断是否需要使用 AI", "zh-Hant": "判斷是否需要使用 AI", en: "Decide whether to use AI" }, meaning: { "zh-Hans": "学生能否判断某个任务是否适合使用 AI。", "zh-Hant": "學生能否判斷某個任務是否適合使用 AI。", en: "Whether the student can judge whether AI is appropriate for a task." } },
  M2: { domain: "managing_ai", name: { "zh-Hans": "区分 AI 和人的任务责任", "zh-Hant": "區分 AI 和人的任務責任", en: "Divide AI and human responsibilities" }, meaning: { "zh-Hans": "学生能否把结构化任务交给 AI，把判断、公平和最终决定留给人。", "zh-Hant": "學生能否把結構化任務交給 AI，把判斷、公平和最終決定留給人。", en: "Whether the student separates AI-supportable work from human-responsible judgement." } },
  M3: { domain: "managing_ai", name: { "zh-Hans": "给 AI 明确指令和限制", "zh-Hant": "給 AI 明確指令和限制", en: "Direct AI with constraints" }, meaning: { "zh-Hans": "学生能否给 AI 明确的对象、语气、保留内容或修改要求。", "zh-Hant": "學生能否給 AI 明確的對象、語氣、保留內容或修改要求。", en: "Whether the student gives AI clear context, tone, or constraint instructions." } },
  M4: { domain: "managing_ai", name: { "zh-Hans": "合理委派任务以增强工作流程", "zh-Hant": "合理委派任務以增強工作流程", en: "Delegate tasks to augment workflows" }, meaning: { "zh-Hans": "学生能否把结构化或重复性任务交给 AI，同时保留创造、伦理和最终判断给人。", "zh-Hant": "學生能否把結構化或重複性任務交給 AI，同時保留創造、倫理和最終判斷給人。", en: "Whether the student delegates structured or repetitive work to AI while keeping creative, ethical, and final judgement with humans." } },
  M5: { domain: "managing_ai", name: { "zh-Hans": "制定负责任的 AI 使用规则", "zh-Hant": "制定負責任的 AI 使用規則", en: "Set responsible AI-use rules" }, meaning: { "zh-Hans": "学生能否提出使用 AI 时需要说明、核查和保留人类最终判断的规则。", "zh-Hant": "學生能否提出使用 AI 時需要說明、核查和保留人類最終判斷的規則。", en: "Whether the student sets rules for disclosure, checking, and human final responsibility." } },
  D1: { domain: "designing_ai", name: { "zh-Hans": "界定 AI 可以解决的问题", "zh-Hant": "界定 AI 可以解決的問題", en: "Define problems for AI systems" }, meaning: { "zh-Hans": "学生能否识别 AI 系统正在处理什么问题，以及哪里出了错。", "zh-Hant": "學生能否識別 AI 系統正在處理什麼問題，以及哪裡出了錯。", en: "Whether the student identifies the problem an AI system is trying to solve and where it fails." } },
  D2: { domain: "designing_ai", name: { "zh-Hans": "比较规则系统和数据训练模型", "zh-Hant": "比較規則系統和數據訓練模型", en: "Compare rule-based and data-trained systems" }, meaning: { "zh-Hans": "学生能否比较固定规则系统与基于数据预测的 AI 系统各自的能力和限制。", "zh-Hant": "學生能否比較固定規則系統與基於數據預測的 AI 系統各自的能力和限制。", en: "Whether the student compares the capabilities and limitations of fixed-rule systems and data-trained predictive AI systems." } },
  D3: { domain: "designing_ai", name: { "zh-Hans": "选择更有代表性的数据", "zh-Hant": "選擇更有代表性的數據", en: "Improve data representation" }, meaning: { "zh-Hans": "学生能否选择更有代表性的训练图片，避免无关或单一数据。", "zh-Hant": "學生能否選擇更有代表性的訓練圖片，避免無關或單一數據。", en: "Whether the student selects more representative training examples and avoids irrelevant data." } },
  D4: { domain: "designing_ai", name: { "zh-Hans": "评价 AI 系统行为和限制", "zh-Hant": "評價 AI 系統行為和限制", en: "Evaluate AI system behaviour" }, meaning: { "zh-Hans": "学生能否提出使用提醒，让用户知道 AI 可能出错并需要人检查。", "zh-Hant": "學生能否提出使用提醒，讓用戶知道 AI 可能出錯並需要人檢查。", en: "Whether the student sets reminders that AI may be wrong and needs human checking." } },
  D5: { domain: "designing_ai", name: { "zh-Hans": "说明 AI 系统用途、用户、数据和限制", "zh-Hant": "說明 AI 系統用途、用戶、數據和限制", en: "Communicate purpose, users, data, and limits" }, meaning: { "zh-Hans": "学生能否用系统说明卡写清用途、使用对象、训练数据、限制、人类检查和改进方案。", "zh-Hant": "學生能否用系統說明卡寫清用途、使用對象、訓練數據、限制、人類檢查和改進方案。", en: "Whether the student explains the system purpose, intended users, training data, limitations, human checking, and improvement plan." } },
};

export const WORLD_META: Record<string, {
  title: Record<TeacherLocale, string>;
  role: Record<TeacherLocale, string>;
  goal: Record<TeacherLocale, string>;
  evidence: Record<TeacherLocale, string[]>;
}> = {
  w1: {
    title: { "zh-Hans": "World 1 · 学习推荐站", "zh-Hant": "World 1 · 學習推薦站", en: "World 1 · Learning Recommender" },
    role: { "zh-Hans": "学校学习平台的学生测试员", "zh-Hant": "學校學習平台的學生測試員", en: "Student tester of a school learning platform" },
    goal: { "zh-Hans": "试用 AI 推荐系统，判断它是否有帮助、是否可能限制学习视野，并提交反馈。", "zh-Hant": "試用 AI 推薦系統，判斷它是否有幫助、是否可能限制學習視野，並提交反饋。", en: "Test an AI recommender, judge its usefulness and possible narrowing effect, and submit feedback." },
    evidence: { "zh-Hans": ["判断哪种推荐方式最有帮助", "判断哪种推荐方式可能越推越窄", "选择负责任的系统使用规则", "提交推荐反馈卡"], "zh-Hant": ["判斷哪種推薦方式最有幫助", "判斷哪種推薦方式可能越推越窄", "選擇負責任的系統使用規則", "提交推薦反饋卡"], en: ["Judges the most helpful recommendation mode", "Judges which mode may narrow learning", "Selects responsible system rules", "Submits a recommendation feedback card"] },
  },
  w2: {
    title: { "zh-Hans": "World 2 · 信息核查工作台", "zh-Hant": "World 2 · 資訊核查工作台", en: "World 2 · Information Checking Desk" },
    role: { "zh-Hans": "校园信息发布小组成员", "zh-Hant": "校園資訊發佈小組成員", en: "Member of a campus information team" },
    goal: { "zh-Hans": "检查 AI 生成的信息卡内容，判断哪些可以保留、哪些需要核查或修改。", "zh-Hant": "檢查 AI 生成的資訊卡內容，判斷哪些可以保留、哪些需要核查或修改。", en: "Check AI-generated information and decide what to keep, verify, or revise." },
    evidence: { "zh-Hans": ["判断 AI 在任务中的角色", "比较两个 AI 草稿", "逐条核查 AI 生成内容", "写出发布理由"], "zh-Hant": ["判斷 AI 在任務中的角色", "比較兩個 AI 草稿", "逐條核查 AI 生成內容", "寫出發佈理由"], en: ["Identifies AI's role", "Compares AI drafts", "Checks AI-generated claims", "Justifies publication decisions"] },
  },
  w3: {
    title: { "zh-Hans": "World 3 · 创作表达工坊", "zh-Hant": "World 3 · 創作表達工坊", en: "World 3 · Creative Expression Studio" },
    role: { "zh-Hans": "使用 AI 辅助写卡片的学生作者", "zh-Hant": "使用 AI 輔助寫卡片的學生作者", en: "Student author using AI to revise a card" },
    goal: { "zh-Hans": "用 AI 改写表达，但保留自己的语气、例子和判断。", "zh-Hant": "用 AI 改寫表達，但保留自己的語氣、例子和判斷。", en: "Use AI to revise expression while keeping personal voice, examples, and judgement." },
    evidence: { "zh-Hans": ["写出自己的初稿", "给 AI 明确修改要求", "比较和组合 AI 生成的多种表达形式", "检查素材授权、署名和 AI 辅助说明", "区分准确的 AI 生成机制解释与拟人化说法", "提交最终卡片并复盘 AI 的帮助和限制"], "zh-Hant": ["寫出自己的初稿", "給 AI 明確修改要求", "比較和組合 AI 生成的多種表達形式", "檢查素材授權、署名和 AI 輔助說明", "區分準確的 AI 生成機制解釋與擬人化說法", "提交最終卡片並復盤 AI 的幫助和限制"], en: ["Writes an original first draft", "Gives AI revision constraints", "Compares and combines multiple AI-generated formats", "Checks asset permission, attribution, and AI-use disclosure", "Distinguishes accurate generation explanations from anthropomorphic claims", "Submits a final card and reviews AI support/limits"] },
  },
  w4: {
    title: { "zh-Hans": "World 4 · 任务决策站", "zh-Hant": "World 4 · 任務決策站", en: "World 4 · Task Decision Hub" },
    role: { "zh-Hans": "校园项目中的 AI 使用决策者", "zh-Hant": "校園項目中的 AI 使用決策者", en: "AI-use decision maker in a school project" },
    goal: { "zh-Hans": "决定哪些任务适合 AI，哪些任务必须由人负责，并制定使用规则。", "zh-Hant": "決定哪些任務適合 AI，哪些任務必須由人負責，並制定使用規則。", en: "Decide which tasks AI can support, which remain human responsibility, and set use rules." },
    evidence: { "zh-Hans": ["把任务放入 AI 自动完成、AI 辅助人检查或人类负责三个区域", "选择是否使用 AI 及 AI 角色", "判断 AI 输出如何使用", "提交分工与使用规则卡"], "zh-Hant": ["把任務放入 AI 自動完成、AI 輔助人檢查或人類負責三個區域", "選擇是否使用 AI 及 AI 角色", "判斷 AI 輸出如何使用", "提交分工與使用規則卡"], en: ["Sorts tasks into AI automation, AI-assisted human checking, or human-only responsibility", "Chooses whether/how to use AI", "Judges how AI output should be used", "Submits responsibility and use rules"] },
  },
    w5: {
    title: {
      "zh-Hans": "World 5 · 公平设计所",
      "zh-Hant": "World 5 · 公平設計所",
      en: "World 5 · Fair Design Lab",
    },
    role: {
      "zh-Hans": "改进校园 AI 分类系统的小设计师",
      "zh-Hant": "改進校園 AI 分類系統的小設計師",
      en: "Junior designer improving a school AI classification system",
    },
    goal: {
      "zh-Hans": "分析校园回收站 AI 为什么反复出错，选择更合适的数据、提醒和改进方案。",
      "zh-Hant": "分析校園回收站 AI 為甚麼反覆出錯，選擇更合適的數據、提醒和改進方案。",
      en: "Analyse why a school recycling AI repeatedly fails and choose better data, reminders, and improvements.",
    },
    evidence: {
      "zh-Hans": [
        "查看校园回收站事件并标出可疑问题",
        "判断错误原因和改进目标",
        "比较规则系统和数据训练模型",
        "选择更有代表性的训练图片",
        "连接不公平影响、原因和改进措施",
        "完成资源使用判断，检查系统说明卡草稿，并修改或确认用途、限制、人类检查和改进建议",
      ],
      "zh-Hant": [
        "查看校園回收站事件並標出可疑問題",
        "判斷錯誤原因和改進目標",
        "比較規則系統和數據訓練模型",
        "選擇更有代表性的訓練圖片",
        "連接不公平影響、原因和改進措施",
        "完成資源使用判斷，檢查系統說明卡草稿，並修改或確認用途、限制、人類檢查和改進建議",
      ],
      en: [
        "Reviews a shared recycling-station incident and marks suspicious problem points",
        "Diagnoses likely cause and improvement target",
        "Compares rule-based and data-trained systems",
        "Chooses better training images",
        "Links unfair impact, causes, and mitigation",
        "Completes resource-use judgement, checks the drafted system card, and edits or confirms purpose, limits, human checking, and improvement plans",
      ],
    },
  },
};

export function competenceTitle(code: string, locale: TeacherLocale) {
  const meta = COMPETENCE_META[code];
  if (!meta) return code;
  return `${code} · ${meta.name[locale]}`;
}
