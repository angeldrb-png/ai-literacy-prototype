export type AssessmentLocale = "zh-Hans" | "zh-Hant" | "en";

type LocalizedLabel = Record<AssessmentLocale, string>;

export function normalizeOptionId(id: string) {
  const map: Record<string, string> = {
    onlyPopular: "only_popular",
    explainReason: "explain_reason",
    teacherReview: "teacher_review",
    tryNewThings: "try_new_things",
    sayWhatDataUsed: "say_what_data_used",
    handle_special_conditions: "handle_special_cases",
    similar_cause: "similar",
    draft: "organize_information_generate_draft",
    check: "claim_check",
    keep: "claim_keep",
    remove: "claim_remove",
  };

  return map[id] ?? id;
}

export const OPTION_LABELS: Record<string, LocalizedLabel> = {
  // World 1 recommendation modes and reasons
  personal: { "zh-Hans": "根据个人学习记录推荐", "zh-Hant": "根據個人學習記錄推薦", en: "Personal learning-record recommendation" },
  popular: { "zh-Hans": "热门内容推荐", "zh-Hant": "熱門內容推薦", en: "Popular-content recommendation" },
  class: { "zh-Hans": "根据班级共同兴趣推荐", "zh-Hant": "根據班級共同興趣推薦", en: "Class-interest recommendation" },
  explore: { "zh-Hans": "探索新内容推荐", "zh-Hant": "探索新內容推薦", en: "Explore-new-content recommendation" },
  uses_my_learning_record: { "zh-Hans": "会参考我的学习记录", "zh-Hant": "會參考我的學習記錄", en: "Uses my learning records" },
  matches_recent_learning: { "zh-Hans": "贴合最近学习内容", "zh-Hant": "貼合最近學習內容", en: "Matches recent learning" },
  shows_common_student_interest: { "zh-Hans": "反映同学们共同兴趣", "zh-Hant": "反映同學們共同興趣", en: "Shows common student interests" },
  helps_try_new_topics: { "zh-Hans": "帮助尝试新主题", "zh-Hant": "幫助嘗試新主題", en: "Helps try new topics" },
  overuses_past_record: { "zh-Hans": "可能太依赖过去记录", "zh-Hant": "可能太依賴過去記錄", en: "May rely too much on past records" },
  repeats_similar_content: { "zh-Hans": "可能重复相似内容", "zh-Hant": "可能重複相似內容", en: "May repeat similar content" },
  follows_the_crowd: { "zh-Hans": "可能只跟随热门选择", "zh-Hant": "可能只跟隨熱門選擇", en: "May only follow popular choices" },
  reduces_exploration: { "zh-Hans": "可能减少探索机会", "zh-Hant": "可能減少探索機會", en: "May reduce exploration" },
  only_popular: { "zh-Hans": "只推荐热门内容", "zh-Hant": "只推薦熱門內容", en: "Recommend only popular content" },
  explain_reason: { "zh-Hans": "说明推荐原因", "zh-Hant": "說明推薦原因", en: "Explain recommendation reasons" },
  teacher_review: { "zh-Hans": "教师可以复核", "zh-Hant": "教師可以覆核", en: "Teacher can review" },
  try_new_things: { "zh-Hans": "加入新内容探索", "zh-Hant": "加入新內容探索", en: "Include new content exploration" },
  say_what_data_used: { "zh-Hans": "说明使用了哪些学习记录", "zh-Hant": "說明使用了哪些學習記錄", en: "Explain what learning data is used" },

  // World 2
  organize_information_generate_draft: { "zh-Hans": "整理信息并生成草稿", "zh-Hant": "整理資訊並生成草稿", en: "Organise information and draft" },
  provide_reference: { "zh-Hans": "提供参考资料", "zh-Hant": "提供參考資料", en: "Provide references" },
  student_group: { "zh-Hans": "学生小组", "zh-Hant": "學生小組", en: "Student group" },
  teacher: { "zh-Hans": "老师", "zh-Hant": "老師", en: "Teacher" },
  ai: { "zh-Hans": "AI", "zh-Hant": "AI", en: "AI" },
  A: { "zh-Hans": "草稿 A", "zh-Hant": "草稿 A", en: "Draft A" },
  B: { "zh-Hans": "草稿 B", "zh-Hant": "草稿 B", en: "Draft B" },
  version_b: { "zh-Hans": "草稿 B", "zh-Hant": "草稿 B", en: "Draft B" },
  more_specific: { "zh-Hans": "内容更具体", "zh-Hant": "內容更具體", en: "More specific" },
  clearer_for_campus_card: { "zh-Hans": "更适合校园信息卡", "zh-Hant": "更適合校園資訊卡", en: "Clearer for a campus information card" },
  needs_further_checking: { "zh-Hans": "仍需要进一步核查", "zh-Hant": "仍需要進一步核查", en: "Still needs further checking" },
  too_general: { "zh-Hans": "太笼统", "zh-Hant": "太籠統", en: "Too general" },
  may_be_misleading: { "zh-Hans": "可能误导", "zh-Hant": "可能誤導", en: "May be misleading" },
  claim_keep: { "zh-Hans": "可以保留", "zh-Hant": "可以保留", en: "Keep" },
  claim_check: { "zh-Hans": "要再查一下", "zh-Hant": "要再查一下", en: "Check again" },
  claim_remove: { "zh-Hans": "不能直接发布", "zh-Hant": "不能直接發布", en: "Do not publish directly" },
    trusted_source: {
    "zh-Hans": "和可信来源对照",
    "zh-Hant": "和可信來源對照",
    en: "Compare with a trusted source",
  },
  ask_teacher: {
    "zh-Hans": "发布前问老师",
    "zh-Hant": "發布前問老師",
    en: "Ask a teacher before publishing",
  },
  ai_only: {
    "zh-Hans": "只相信 AI 文字",
    "zh-Hant": "只相信 AI 文字",
    en: "Only trust the AI text",
  },
  // World 3
  junior: { "zh-Hans": "刚升上中学的学弟妹", "zh-Hant": "剛升上中學的學弟妹", en: "New secondary student" },
  stress: { "zh-Hans": "最近压力很大的同学", "zh-Hant": "最近壓力很大的同學", en: "Stressed classmate" },
  new: { "zh-Hans": "新加入学校的同学", "zh-Hant": "新加入學校的同學", en: "New student at school" },
  elder: { "zh-Hans": "社区长者", "zh-Hant": "社區長者", en: "Community elder" },
  keep_voice: { "zh-Hans": "保留我的语气", "zh-Hant": "保留我的語氣", en: "Keep my tone" },
  keep_example: { "zh-Hans": "不要删掉我的例子", "zh-Hant": "不要刪掉我的例子", en: "Keep my example" },
  warmer: { "zh-Hans": "写得更温暖", "zh-Hant": "寫得更溫暖", en: "Make it warmer" },
  warmer_tone: { "zh-Hans": "语气更温暖", "zh-Hant": "語氣更溫暖", en: "Warmer tone" },
  fit_recipient: { "zh-Hans": "更适合这个对象", "zh-Hant": "更適合這個對象", en: "Fit the recipient" },
  less_formal: { "zh-Hans": "不要太正式", "zh-Hant": "不要太正式", en: "Less formal" },
  use_most: { "zh-Hans": "大部分直接使用", "zh-Hant": "大部分直接使用", en: "Used most of it directly" },
  use_part_and_revise: { "zh-Hans": "使用一部分并自己修改", "zh-Hant": "使用一部分並自己修改", en: "Used part and revised it" },
  use_idea_not_wording: { "zh-Hans": "只参考意思，不照搬句子", "zh-Hant": "只參考意思，不照搬句子", en: "Used the idea, not exact wording" },
  reject_and_write_myself: { "zh-Hans": "不用这次建议，自己重写", "zh-Hant": "不用這次建議，自己重寫", en: "Rejected and rewrote myself" },
  gave_new_expression_way: { "zh-Hans": "给了新的表达方式", "zh-Hant": "給了新的表達方式", en: "Gave a new expression" },
  helped_think_from_recipient_view: { "zh-Hans": "帮助我从对方角度思考", "zh-Hant": "幫助我從對方角度思考", en: "Helped me think from the recipient's view" },
  replaced_my_idea: { "zh-Hans": "好像替我决定了想法", "zh-Hant": "好像替我決定了想法", en: "Seemed to replace my idea" },
  only_made_sentence_longer: { "zh-Hans": "只是把句子变长", "zh-Hant": "只是把句子變長", en: "Only made the sentence longer" },
  short_message: { "zh-Hans": "短留言", "zh-Hant": "短留言", en: "Short message" },
  message_with_icon: { "zh-Hans": "图文卡片", "zh-Hant": "圖文卡片", en: "Message with icon/drawing" },
  poster_style_card: { "zh-Hans": "海报式卡片", "zh-Hant": "海報式卡片", en: "Poster-style card" },
  spoken_message_script: { "zh-Hans": "口头祝福稿", "zh-Hant": "口頭祝福稿", en: "Spoken message script" },
  fits_recipient: { "zh-Hans": "适合这个对象", "zh-Hant": "適合這個對象", en: "Fits the recipient" },
  clearer_expression: { "zh-Hans": "表达更清楚", "zh-Hant": "表達更清楚", en: "Clearer expression" },
  shows_care_better: { "zh-Hans": "更能表达关心", "zh-Hant": "更能表達關心", en: "Shows care better" },
  looks_nicer_only: { "zh-Hans": "只是看起来更好看", "zh-Hant": "只是看起來更好看", en: "Only looks nicer" },
  too_generic: { "zh-Hans": "有点太普通", "zh-Hant": "有點太普通", en: "A bit too generic" },
  too_formal: { "zh-Hans": "太正式", "zh-Hant": "太正式", en: "Too formal" },
  not_my_voice: { "zh-Hans": "不太像我的语气", "zh-Hant": "不太像我的語氣", en: "Not my voice" },
  not_fit_recipient: { "zh-Hans": "不够适合选择的对象", "zh-Hant": "不夠適合選擇的對象", en: "Does not fit the recipient enough" },
  did_not_keep_example: { "zh-Hans": "没有保留好例子或感受", "zh-Hant": "沒有保留好例子或感受", en: "Did not keep the example or feeling well" },
  no_obvious_problem: { "zh-Hans": "没有明显问题", "zh-Hant": "沒有明顯問題", en: "No obvious problem" },
  not_much_help: { "zh-Hans": "帮助不明显", "zh-Hant": "幫助不明顯", en: "Not much help" },
    prompt_pattern_generation: {
    "zh-Hans": "AI 根据提示和语言模式生成文字",
    "zh-Hant": "AI 根據提示和語言模式生成文字",
    en: "AI generates from prompts and language patterns",
  },
  human_like_not_understanding: {
    "zh-Hans": "AI 文字像人写，但不是真的理解感受",
    "zh-Hant": "AI 文字像人寫，但不是真的理解感受",
    en: "AI text can sound human-like without real understanding",
  },
  student_judgement_needed: {
    "zh-Hans": "学生仍需要判断 AI 版本是否合适",
    "zh-Hant": "學生仍需要判斷 AI 版本是否合適",
    en: "The student still needs to judge suitability",
  },
  warm_text_means_care: {
    "zh-Hans": "AI 写得温暖就代表真的关心对方",
    "zh-Hant": "AI 寫得溫暖就代表真的關心對方",
    en: "Warm AI text means AI truly cares",
  },
  ai_knows_my_intent_better: {
    "zh-Hans": "AI 比我更知道我想说什么",
    "zh-Hant": "AI 比我更知道我想說甚麼",
    en: "AI knows better than me what I want to say",
  },
  // World 4
  calculate_percentages: { "zh-Hans": "计算人数和比例", "zh-Hant": "計算人數和比例", en: "Calculate numbers and percentages" },
  organize_key_points: { "zh-Hans": "整理重点", "zh-Hant": "整理重點", en: "Organise key points" },
  explain_common_pattern: { "zh-Hans": "解释结果", "zh-Hant": "解釋結果", en: "Explain results" },
  decide_final_suggestions: { "zh-Hans": "决定最终建议", "zh-Hant": "決定最終建議", en: "Decide final suggestions" },
  check_fairness_feasibility: { "zh-Hans": "检查公平性和可行性", "zh-Hant": "檢查公平性和可行性", en: "Check fairness and feasibility" },
  disclose_ai_use: { "zh-Hans": "说明哪些地方用了 AI", "zh-Hant": "說明哪些地方用了 AI", en: "Disclose AI use" },
  do_not_copy_ai_directly: { "zh-Hans": "不直接复制 AI 内容", "zh-Hant": "不直接複製 AI 內容", en: "Do not copy AI directly" },
  human_final_decision: { "zh-Hans": "最终决定由人负责", "zh-Hant": "最終決定由人負責", en: "Humans make final decision" },
  check_ai_data: { "zh-Hans": "检查 AI 整理的数据", "zh-Hant": "檢查 AI 整理的數據", en: "Check AI-organised data" },
  use_directly: { "zh-Hans": "直接使用", "zh-Hant": "直接使用", en: "Use directly" },
  revise_check_before_use: { "zh-Hans": "修改或检查后再用", "zh-Hant": "修改或檢查後再用", en: "Revise/check before use" },
  do_not_use_directly: { "zh-Hans": "不能直接用", "zh-Hant": "不能直接用", en: "Do not use directly" },
  no_ai_support: { "zh-Hans": "不需要 AI 协助", "zh-Hant": "不需要 AI 協助", en: "No AI support needed" },
summary: {
  "zh-Hans": "整理重点",
  "zh-Hant": "整理重點",
  en: "Summarize key points",
},
explain_results: {
  "zh-Hans": "解释结果",
  "zh-Hant": "解釋結果",
  en: "Explain results",
},
explain_ai_use: {
  "zh-Hans": "说明 AI 使用",
  "zh-Hant": "說明 AI 使用",
  en: "Explain AI use",
},
calculate_ratio: {
  "zh-Hans": "计算人数和比例",
  "zh-Hant": "計算人數和比例",
  en: "Calculate numbers and ratios",
},
make_decision: {
  "zh-Hans": "决定最终建议",
  "zh-Hant": "決定最終建議",
  en: "Make the final decision",
},
  // World 5
    recycling_station: {
    "zh-Hans": "校园回收站连续误判事件",
    "zh-Hant": "校園回收站連續誤判事件",
    en: "Campus recycling-station repeated error incident",
  },
  dim_light_bottle: {
    "zh-Hans": "昏暗走廊中的塑料瓶",
    "zh-Hant": "昏暗走廊中的膠樽",
    en: "Plastic bottle in a dim hallway",
  },
  similar_cups: {
    "zh-Hans": "外形相似的杯子",
    "zh-Hant": "外形相似的杯子",
    en: "Similar-looking cups",
  },
  uncertain_cases_need_human_check: {
    "zh-Hans": "不确定情况需要人类复核",
    "zh-Hant": "不確定情況需要人類覆核",
    en: "Uncertain cases need human checking",
  },
  ui_color_only: {
    "zh-Hans": "只是页面颜色不够好看",
    "zh-Hant": "只是頁面顏色不夠好看",
    en: "Only the page colour is unattractive",
  },
  answer_faster_only: {
    "zh-Hans": "只是希望系统回答更快",
    "zh-Hant": "只是希望系統回答更快",
    en: "Only making the system answer faster",
  },
  lighting: { "zh-Hans": "光线太暗导致识别错误", "zh-Hant": "光線太暗導致識別錯誤", en: "Error under dim lighting" },
  students_who_follow_ai: { "zh-Hans": "依赖 AI 提示的同学", "zh-Hant": "依賴 AI 提示的同學", en: "Students who follow the AI suggestion" },
  cleaning_recycling_staff: { "zh-Hans": "清洁或回收人员", "zh-Hant": "清潔或回收人員", en: "Cleaning or recycling staff" },
  school_environmental_work: { "zh-Hans": "学校环保工作", "zh-Hant": "學校環保工作", en: "School environmental work" },
  no_one: { "zh-Hans": "没有人会受影响", "zh-Hant": "沒有人會受影響", en: "No one would be affected" },
  training_data_not_diverse: { "zh-Hans": "训练数据不够多样", "zh-Hant": "訓練資料不夠多樣", en: "Training data is not diverse enough" },
  human_check_needed: { "zh-Hans": "不确定时仍需要人检查", "zh-Hant": "不確定時仍需要人檢查", en: "People still need to check uncertain cases" },
  simple_task_no_ai_resource: { "zh-Hans": "简单任务不一定需要 AI，因为 AI 也消耗资源和能源", "zh-Hant": "簡單任務不一定需要 AI，因為 AI 也消耗資源和能源", en: "Simple tasks may not need AI because AI uses resources and energy" },
  always_use_ai: { "zh-Hans": "只要可以，每个任务都应该用 AI", "zh-Hant": "只要可以，每個任務都應該用 AI", en: "Every task should use AI if possible" },
  ai_no_resource: { "zh-Hans": "AI 运作时不会消耗资源", "zh-Hant": "AI 運作時不會消耗資源", en: "AI does not use resources" },
  not_sure: { "zh-Hans": "不确定", "zh-Hant": "不確定", en: "Not sure" },

  // World 3 v3 multimodal / authenticity / mechanism labels
  short_caption: { "zh-Hans": "简短说明", "zh-Hant": "簡短說明", en: "Short caption" },
  helps_visualise_idea: { "zh-Hans": "帮助把想法视觉化", "zh-Hant": "幫助把想法視覺化", en: "Helps visualise the idea" },
  clear_message: { "zh-Hans": "信息更清楚", "zh-Hant": "信息更清楚", en: "Clearer message" },
  clearer_message: { "zh-Hans": "信息更清楚", "zh-Hant": "信息更清楚", en: "Clearer message" },
  ai_generated_background: { "zh-Hans": "AI 生成背景图", "zh-Hant": "AI 生成背景圖", en: "AI-generated background" },
  free_icon: { "zh-Hans": "可免费使用并注明来源的图标", "zh-Hant": "可免費使用並註明來源的圖示", en: "Free icon with source" },
  school_owned_material: { "zh-Hans": "学校自有素材", "zh-Hant": "學校自有素材", en: "School-owned material" },
  simple_shape_or_emoji: { "zh-Hans": "简单图形或 emoji", "zh-Hant": "簡單圖形或 emoji", en: "Simple shape or emoji" },
  realistic_elder_photo: { "zh-Hans": "像真人的 AI 长者照片", "zh-Hant": "像真人的 AI 長者照片", en: "Realistic AI elder photo" },
  state_ai_assisted: { "zh-Hans": "说明 AI 辅助生成", "zh-Hant": "說明 AI 輔助生成", en: "State AI-assisted creation" },
  state_ai_generated_visual: { "zh-Hans": "说明图片由 AI 生成", "zh-Hant": "說明圖片由 AI 生成", en: "State AI-generated visual" },
  credit_free_icon: { "zh-Hans": "注明免费图标来源", "zh-Hant": "註明免費圖示來源", en: "Credit free icon source" },
  ask_permission_and_credit: { "zh-Hans": "先取得同意并注明来源", "zh-Hant": "先取得同意並註明來源", en: "Ask permission and credit source" },
  not_needed_all_own_or_ai: { "zh-Hans": "不需要额外来源说明", "zh-Hant": "不需要額外來源說明", en: "No additional attribution needed" },

  // World 4 v3 workflow delegation labels
  ai_auto: { "zh-Hans": "AI 自动完成", "zh-Hant": "AI 自動完成", en: "AI automates" },
  ai_assist_human_check: { "zh-Hans": "AI 辅助，人来检查", "zh-Hant": "AI 輔助，人來檢查", en: "AI assists, humans check" },
  human_only: { "zh-Hans": "必须由人完成", "zh-Hant": "必須由人完成", en: "Human only" },
  generate_chart_title: { "zh-Hans": "生成图表标题", "zh-Hant": "生成圖表標題", en: "Generate chart title" },
  decide_what_to_send_school: { "zh-Hans": "决定提交给学校的最终建议", "zh-Hant": "決定提交給學校的最終建議", en: "Decide final message to school" },
  check_ai_result: { "zh-Hans": "检查 AI 结果", "zh-Hant": "檢查 AI 結果", en: "Check AI result" },
  check_fairness: { "zh-Hans": "检查公平性", "zh-Hant": "檢查公平性", en: "Check fairness" },
  do_not_copy_directly: { "zh-Hans": "不直接照搬", "zh-Hant": "不直接照搬", en: "Do not copy directly" },
  
  uses_prompt: {
    "zh-Hans": "AI 会根据提示生成内容",
    "zh-Hant": "AI 會根據提示生成內容",
    en: "AI generates from prompts",
  },
  uses_patterns: {
    "zh-Hans": "AI 会利用数据中的模式",
    "zh-Hant": "AI 會利用數據中的模式",
    en: "AI uses data patterns",
  },
  looks_human_but_no_real_understanding: {
    "zh-Hans": "AI 文字像人写，但不是真的理解",
    "zh-Hant": "AI 文字像人寫，但不是真的理解",
    en: "AI text can sound human-like without real understanding",
  },
  student_must_judge: {
    "zh-Hans": "学生仍然需要自己判断是否合适",
    "zh-Hant": "學生仍然需要自己判斷是否合適",
    en: "The student still needs to judge the result",
  },
  ai_really_understands_feelings: {
    "zh-Hans": "AI 真的理解我的感受",
    "zh-Hant": "AI 真的理解我的感受",
    en: "AI really understands my feelings",
  },
  ai_cares_about_recipient: {
    "zh-Hans": "AI 像人一样关心对方",
    "zh-Hant": "AI 像人一樣關心對方",
    en: "AI cares about the recipient like a person",
  },
  ai_output_always_sincere: {
    "zh-Hans": "AI 生成的内容一定真诚",
    "zh-Hant": "AI 生成的內容一定真誠",
    en: "AI output is always sincere",
  },
  ai_knows_better_than_me: {
    "zh-Hans": "AI 比我更知道我想说什么",
    "zh-Hant": "AI 比我更知道我想說甚麼",
    en: "AI knows better than me what I want to say",
  },
  // World 3 current UI labels
text_card: {
  "zh-Hans": "文字心意卡",
  "zh-Hant": "文字心意卡",
  en: "Text card",
},
poster: {
  "zh-Hans": "图文海报",
  "zh-Hant": "圖文海報",
  en: "Text-image poster",
},
comic_sticker: {
  "zh-Hans": "小漫画/贴纸卡",
  "zh-Hant": "小漫畫/貼紙卡",
  en: "Comic / sticker card",
},
own_sentence: {
  "zh-Hans": "我的原句",
  "zh-Hant": "我的原句",
  en: "My own sentence",
},
ai_warm_title: {
  "zh-Hans": "AI 生成的温暖标题",
  "zh-Hant": "AI 生成的溫暖標題",
  en: "AI-generated warm title",
},
ai_layout: {
  "zh-Hans": "AI 排版",
  "zh-Hant": "AI 排版",
  en: "AI layout",
},
ai_image: {
  "zh-Hans": "AI 生成插图",
  "zh-Hant": "AI 生成插圖",
  en: "AI-generated image",
},
recipient_icon: {
  "zh-Hans": "对象小图标",
  "zh-Hant": "對象小圖標",
  en: "Recipient icon",
},
ai_background_image: {
  "zh-Hans": "AI 生成背景图",
  "zh-Hant": "AI 生成背景圖",
  en: "AI-generated background image",
},
free_source_icon: {
  "zh-Hans": "注明来源的免费图标",
  "zh-Hant": "註明來源的免費圖標",
  en: "Free-to-use icon with source noted",
},
ai_person_image: {
  "zh-Hans": "AI 生成人物图",
  "zh-Hant": "AI 生成人物圖",
  en: "AI-generated person image",
},
web_cartoon_unknown_source: {
  "zh-Hans": "来源不明的网络卡通图",
  "zh-Hant": "來源不明的網絡卡通圖",
  en: "Online cartoon with unclear source",
},
classmate_photo_without_permission: {
  "zh-Hans": "未经同意的同学照片",
  "zh-Hant": "未經同意的同學照片",
  en: "Classmate photo without permission",
},

// World 5 current UI labels
crushed: {
  "zh-Hans": "被压扁的纸盒",
  "zh-Hant": "被壓扁的紙盒",
  en: "Crushed paper box",
},
crushed_paper_box: {
  "zh-Hans": "被压扁的纸盒",
  "zh-Hant": "被壓扁的紙盒",
  en: "Crushed paper box",
},
data: {
  "zh-Hans": "训练例子不足",
  "zh-Hant": "訓練例子不足",
  en: "Not enough training examples",
},
similar: {
  "zh-Hans": "压扁后外形容易混淆",
  "zh-Hant": "壓扁後外形容易混淆",
  en: "Changed shape may be confusing",
},
rule: {
  "zh-Hans": "判断方式太死板",
  "zh-Hant": "判斷方式太死板",
  en: "Judgement rule is too rigid",
},
speed: {
  "zh-Hans": "只关注回答速度",
  "zh-Hant": "只關注回答速度",
  en: "Only focuses on speed",
},
handle_special_cases: {
  "zh-Hans": "更好处理形状改变的可回收物",
  "zh-Hant": "更好處理形狀改變的可回收物",
  en: "Handle changed-shape recyclables better",
},
answer_faster: {
  "zh-Hans": "让系统回答更快",
  "zh-Hant": "讓系統回答更快",
  en: "Make the system answer faster",
},
look_nicer: {
  "zh-Hans": "让页面更好看",
  "zh-Hant": "讓頁面更好看",
  en: "Make the page look nicer",
},
remove_human_check: {
  "zh-Hans": "取消人工检查",
  "zh-Hant": "取消人工檢查",
  en: "Remove human checking",
},

databot: {
  "zh-Hans": "补更多类似例子",
  "zh-Hant": "補更多類似例子",
  en: "Add more similar examples",
},
rulebot: {
  "zh-Hans": "继续按固定判断处理",
  "zh-Hant": "繼續按固定判斷處理",
  en: "Keep the fixed check",
},
both_need_human_check: {
  "zh-Hans": "不确定时请人确认",
  "zh-Hant": "不確定時請人確認",
  en: "Ask a person to check uncertain results",
},
speed_only: {
  "zh-Hans": "只让系统回答更快",
  "zh-Hant": "只讓系統回答更快",
  en: "Only make the system answer faster",
},

data_model_needs_representative_examples: {
  "zh-Hans": "需要更贴近真实情况的例子",
  "zh-Hant": "需要更貼近真實情況的例子",
  en: "Needs representative examples",
},
data_model_can_generalise_if_training_varied: {
  "zh-Hans": "例子更多样时，系统更可能处理变化",
  "zh-Hant": "例子更多樣時，系統更可能處理變化",
  en: "Varied examples help handle changes",
},
rule_is_clear_but_inflexible: {
  "zh-Hans": "固定判断清楚但不够灵活",
  "zh-Hant": "固定判斷清楚但不夠靈活",
  en: "Fixed checks are clear but not flexible",
},

wrong_bin_guidance: {
  "zh-Hans": "同学明明分类对了，却仍被提醒做错",
  "zh-Hant": "同學明明分類對了，卻仍被提醒做錯",
  en: "Student sorted correctly but still gets a wrong reminder",
},
extra_work_for_cleaning_staff: {
  "zh-Hans": "清洁人员可能要反复检查同类错误",
  "zh-Hant": "清潔人員可能要反覆檢查同類錯誤",
  en: "Cleaning staff may need to check repeated mistakes",
},
recycling_record_inaccurate: {
  "zh-Hans": "回收统计可能变得不准确",
  "zh-Hant": "回收統計可能變得不準確",
  en: "Recycling records may become inaccurate",
},
overtrust_ai: {
  "zh-Hans": "大家可能因为 AI 看起来自信而更相信它",
  "zh-Hant": "大家可能因為 AI 看起來自信而更相信它",
  en: "People may overtrust the AI because it looks confident",
},
check_uncertain_cases: {
  "zh-Hans": "不确定时要检查",
  "zh-Hant": "不確定時要檢查",
  en: "Check uncertain cases",
},
ask_human_when_unsure: {
  "zh-Hans": "不确定时请人确认",
  "zh-Hant": "不確定時請人確認",
  en: "Ask a person when unsure",
},
do_not_treat_ai_as_final_authority: {
  "zh-Hans": "不要把 AI 当成最后权威",
  "zh-Hant": "不要把 AI 當成最後權威",
  en: "Do not treat AI as final authority",
},
allow_user_correction: {
  "zh-Hans": "允许使用者更正错误",
  "zh-Hant": "允許使用者更正錯誤",
  en: "Allow users to correct mistakes",
},
explain_system_limits: {
  "zh-Hans": "向使用者说明系统限制",
  "zh-Hant": "向使用者說明系統限制",
  en: "Explain system limits to users",
},
look_nicer_only: {
  "zh-Hans": "只让页面变好看",
  "zh-Hant": "只讓頁面變好看",
  en: "Only make the page look nicer",
},

training_data_lacks_shape_variation: {
  "zh-Hans": "训练例子缺少形状变化",
  "zh-Hant": "訓練例子缺少形狀變化",
  en: "Training examples lack shape variation",
},
visual_features_too_similar: {
  "zh-Hans": "外形特征容易混淆",
  "zh-Hant": "外形特徵容易混淆",
  en: "Visual features are confusingly similar",
},
rule_boundary_unclear: {
  "zh-Hans": "分类边界不够清楚",
  "zh-Hant": "分類邊界不夠清楚",
  en: "Category boundary is unclear",
},

analyse_many_photos: {
  "zh-Hans": "分析大量压扁、折起和完整纸盒照片",
  "zh-Hant": "分析大量壓扁、折起和完整紙盒照片",
  en: "Analyse many photos of boxes",
},
clear_bottle_with_sign: {
  "zh-Hans": "分类一个完整清楚、旁边已有标志的纸盒",
  "zh-Hant": "分類一個完整清楚、旁邊已有標誌的紙盒",
  en: "Sort a clear complete box with a sign",
},
auto_penalty: {
  "zh-Hans": "只根据 AI 结果自动提醒或处罚学生",
  "zh-Hant": "只根據 AI 結果自動提醒或處罰學生",
  en: "Automatically remind or penalise students based only on AI",
},
worth_using_ai: {
  "zh-Hans": "可以参考 AI",
  "zh-Hant": "可以參考 AI",
  en: "AI can help",
},
simple_method_first: {
  "zh-Hans": "简单检查就够",
  "zh-Hant": "簡單檢查就夠",
  en: "Simple check is enough",
},

useful: {
  "zh-Hans": "适合作为训练例子",
  "zh-Hant": "適合作為訓練例子",
  en: "Useful training example",
},
narrow: {
  "zh-Hans": "例子太单一",
  "zh-Hant": "例子太單一",
  en: "Too narrow",
},
ai_may_be_wrong: {
  "zh-Hans": "AI 可能会判断错",
  "zh-Hant": "AI 可能會判斷錯",
  en: "AI may be wrong",
},
irrelevant: {
  "zh-Hans": "与任务无关",
  "zh-Hant": "與任務無關",
  en: "Irrelevant to the task",
},

  // World 5 v3 system comparison and unfair-impact labels
  faster_is_better: { "zh-Hans": "跑得更快的就更好", "zh-Hant": "跑得更快的就更好", en: "Faster is better" },
  cleaning_staff: { "zh-Hans": "清洁工", "zh-Hant": "清潔工", en: "Cleaning staff" },
  younger_students: { "zh-Hans": "低年级学生", "zh-Hant": "低年級學生", en: "Younger students" },
  students_in_dark_hallway: { "zh-Hans": "在光线暗的楼层投放垃圾的同学", "zh-Hant": "在光線暗的樓層投放垃圾的同學", en: "Students in dim hallways" },
  students_with_similar_items: { "zh-Hans": "使用相似杯子或饭盒的同学", "zh-Hant": "使用相似杯子或飯盒的同學", en: "Students with similar-looking items" },
  canteen_users: { "zh-Hans": "饭堂使用者", "zh-Hant": "飯堂使用者", en: "Canteen users" },
  some_students_more_likely_flagged: { "zh-Hans": "某些同学或地点更常被误判", "zh-Hant": "某些同學或地點更常被誤判", en: "Some students or locations are flagged more often" },
  wrong_feedback_or_penalty: { "zh-Hans": "同学可能收到错误提示或扣分", "zh-Hant": "同學可能收到錯誤提示或扣分", en: "Wrong feedback or penalty" },
  add_diverse_training_images: { "zh-Hans": "补充更多样的训练图片", "zh-Hant": "補充更多樣的訓練圖片", en: "Add diverse training images" },
    // World 5 v4.2 resource-use triage labels
  ai_uses_energy_resources: { "zh-Hans": "AI 会使用计算资源和能源", "zh-Hant": "AI 會使用計算資源和能源", en: "AI uses computing resources and energy" },
  use_ai_when_task_complex: { "zh-Hans": "任务复杂或资料量大时才较值得用 AI", "zh-Hant": "任務複雜或資料量大時才較值得用 AI", en: "Use AI when the task is complex or large-scale" },
  simple_task_no_ai_needed: { "zh-Hans": "简单任务可以不用 AI", "zh-Hant": "簡單任務可以不用 AI", en: "Simple tasks may not need AI" },
  high_impact_needs_human_check: { "zh-Hans": "高影响 AI 结果需要人类检查", "zh-Hant": "高影響 AI 結果需要人類檢查", en: "High-impact AI results need human checking" },
  accurate: { "zh-Hans": "比较准确", "zh-Hant": "比較準確", en: "More accurate" },
  inaccurate: { "zh-Hans": "不准确", "zh-Hant": "不準確", en: "Inaccurate" },
  use: { "zh-Hans": "可以使用", "zh-Hant": "可以使用", en: "Can use" },
  credit: { "zh-Hans": "可用，但要说明来源或 AI 辅助", "zh-Hant": "可用，但要說明來源或 AI 輔助", en: "Use with credit/disclosure" },
  avoid: { "zh-Hans": "不要使用", "zh-Hant": "不要使用", en: "Do not use" },
  purpose: { "zh-Hans": "用途", "zh-Hant": "用途", en: "Purpose" },
intendedUsers: { "zh-Hans": "使用对象", "zh-Hant": "使用對象", en: "Intended users" },
trainingData: { "zh-Hans": "训练例子", "zh-Hant": "訓練例子", en: "Training examples" },
limits: { "zh-Hans": "可能限制", "zh-Hant": "可能限制", en: "Possible limits" },
humanCheck: { "zh-Hans": "人类检查", "zh-Hant": "人類檢查", en: "Human checking" },
reminder: { "zh-Hans": "使用提醒", "zh-Hant": "使用提醒", en: "User reminder" },
improve: { "zh-Hans": "改进建议", "zh-Hant": "改進建議", en: "Improvement suggestion" },
};

export function humanizeUnknownId(id: string, locale: AssessmentLocale) {
  if (!id) return "—";

  const readable = String(id)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return locale === "en"
    ? `Unmapped option: ${readable}`
    : locale === "zh-Hant"
    ? `未配置標籤：${readable}`
    : `未配置标签：${readable}`;
}

export function labelOf(id: string, locale: AssessmentLocale) {
  const key = normalizeOptionId(String(id ?? ""));
  return OPTION_LABELS[key]?.[locale] ?? humanizeUnknownId(key, locale);
}

export function labelList(ids: string[], locale: AssessmentLocale) {
  const unique = Array.from(new Set((ids ?? []).map((id) => normalizeOptionId(String(id))))).filter(Boolean);
  return unique.length ? unique.map((id) => labelOf(id, locale)) : ["—"];
}
