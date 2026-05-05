"use client";

type PreviewLocale = "zh-Hans" | "zh-Hant" | "en";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getW3RecipientIcon(recipientId: string) {
  const key = String(recipientId || "");

  if (key.includes("teacher")) return "👩‍🏫";
  if (key.includes("elder") || key.includes("grand")) return "👵";
  if (key.includes("friend") || key.includes("classmate")) return "🧑‍🎓";
  if (key.includes("family") || key.includes("parent")) return "👨‍👩‍👧";

  return "😊";
}

function getW3FormatLabel(formatId: string, locale: PreviewLocale) {
  if (formatId === "poster") {
    return locale === "en"
      ? "Text-image poster"
      : locale === "zh-Hant"
      ? "圖文海報"
      : "图文海报";
  }

  if (formatId === "comic_sticker") {
    return locale === "en"
      ? "Comic / sticker card"
      : locale === "zh-Hant"
      ? "小漫畫／貼紙卡"
      : "小漫画/贴纸卡";
  }

  return locale === "en"
    ? "Text card"
    : locale === "zh-Hant"
    ? "文字心意卡"
    : "文字心意卡";
}

export default function W3CardPreviewShared({
  title,
  text,
  locale,
  formatId,
  selectedDesignElementIds,
  recipientId,
  creditNotes = [],
  forceShowText = false,
}: {
  title: string;
  text: string;
  locale: PreviewLocale;
  formatId: string;
  selectedDesignElementIds: string[];
  recipientId: string;
  creditNotes?: string[];
  forceShowText?: boolean;
}) {
  const normalizedFormatId = formatId || "text_card";

  const hasOwnSentence =
    forceShowText || selectedDesignElementIds.includes("own_sentence");
  const hasWarmTitle = selectedDesignElementIds.includes("ai_warm_title");
  const hasImage = selectedDesignElementIds.includes("ai_image");
  const hasLayout = selectedDesignElementIds.includes("ai_layout");
  const hasRecipientIcon = selectedDesignElementIds.includes("recipient_icon");

  const displayText =
    text ||
    (locale === "en"
      ? "Your card text will appear here."
      : locale === "zh-Hant"
      ? "你的卡片文字會出現在這裡。"
      : "你的卡片文字会出现在这里。");

  const warmTitle =
    locale === "en"
      ? "A little warmth for you"
      : locale === "zh-Hant"
      ? "給你的一點溫暖"
      : "给你的一点温暖";

  const recipientIcon = getW3RecipientIcon(recipientId);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {getW3FormatLabel(normalizedFormatId, locale)}
        </span>
      </div>

      {normalizedFormatId === "text_card" && (
        <div className="min-h-[360px] rounded-3xl bg-gradient-to-br from-amber-50 to-white p-8 shadow-inner">
          <div className="mx-auto max-w-[520px] rounded-[28px] border border-amber-100 bg-white/90 p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-4xl">
                {hasRecipientIcon ? recipientIcon : "💌"}
              </div>

              {hasWarmTitle && (
                <div className="text-xl font-semibold text-slate-900">
                  {warmTitle}
                </div>
              )}
            </div>

            <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">
              {hasOwnSentence
                ? displayText
                : locale === "en"
                ? "Your own words should be included."
                : locale === "zh-Hant"
                ? "這裡應該保留你的文字。"
                : "这里应该保留你的文字。"}
            </p>
          </div>
        </div>
      )}

      {normalizedFormatId === "poster" && (
        <div className="min-h-[360px] rounded-3xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-inner">
          <div
            className={cn(
              "grid gap-5",
              hasLayout ? "md:grid-cols-[1.1fr_0.9fr]" : ""
            )}
          >
            <div className="rounded-[28px] bg-white p-5 shadow-sm">
              <div className="flex min-h-[190px] items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-indigo-100 text-6xl">
                {hasImage ? "🖼️" : "▧"}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {hasImage
                  ? locale === "en"
                    ? "AI-generated visual area"
                    : locale === "zh-Hant"
                    ? "AI 生成插圖區域"
                    : "AI 生成插图区域"
                  : locale === "en"
                  ? "No visual selected"
                  : locale === "zh-Hant"
                  ? "未選擇視覺元素"
                  : "未选择视觉元素"}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-sm">
              {hasWarmTitle && (
                <div className="mb-4 text-2xl font-bold text-slate-900">
                  {warmTitle}
                </div>
              )}

              <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">
                {hasOwnSentence
                  ? displayText
                  : locale === "en"
                  ? "Your text should be included."
                  : locale === "zh-Hant"
                  ? "這裡應該放入你的文字。"
                  : "这里应该放入你的文字。"}
              </p>
            </div>
          </div>
        </div>
      )}

      {normalizedFormatId === "comic_sticker" && (
        <div className="min-h-[360px] rounded-3xl bg-gradient-to-br from-fuchsia-50 via-white to-rose-50 p-6 shadow-inner">
          <div className="grid gap-4 md:grid-cols-[0.35fr_1fr]">
            <div className="space-y-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-sm">
                {hasRecipientIcon ? recipientIcon : "😊"}
              </div>

              {hasImage && (
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm">
                  ✨
                </div>
              )}
            </div>

            <div className="space-y-4">
              {hasWarmTitle && (
                <div className="inline-flex rounded-full bg-white px-5 py-3 text-lg font-semibold text-slate-900 shadow-sm">
                  {warmTitle}
                </div>
              )}

              <div
                className={cn(
                  "rounded-[28px] bg-white p-5 text-base leading-8 text-slate-700 shadow-sm",
                  hasLayout ? "rounded-tl-md" : ""
                )}
              >
                <p className="whitespace-pre-wrap">
                  {hasOwnSentence
                    ? displayText
                    : locale === "en"
                    ? "Your message bubble will appear here."
                    : locale === "zh-Hant"
                    ? "你的心意氣泡會出現在這裡。"
                    : "你的心意气泡会出现在这里。"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {creditNotes.length > 0 && (
        <div className="mt-5 rounded-2xl bg-amber-50 p-3 text-xs leading-6 text-amber-900">
          <div className="mb-1 font-semibold">
            {locale === "en"
              ? "Material and credit note"
              : locale === "zh-Hant"
              ? "素材與署名說明"
              : "素材与署名说明"}
          </div>

          <ul className="list-disc space-y-1 pl-5">
            {creditNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
