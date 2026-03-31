"use client";

import { teacherLocaleOptions } from "@/lib/teacher-i18n";
import { useTeacherLocale } from "./useTeacherLocale";

export default function TeacherLanguageSwitch() {
  const { locale, setLocale } = useTeacherLocale();

  return (
    <div className="flex gap-2">
      {teacherLocaleOptions.map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={
            locale === lang
              ? "rounded-full border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white"
              : "rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          }
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
