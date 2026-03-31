"use client";

import { useEffect, useState } from "react";
import { TeacherLocale } from "@/lib/teacher-i18n";

const KEYS = ["teacher_lang", "site_lang", "locale", "lang"] as const;

function readStoredLocale(): TeacherLocale {
  if (typeof window === "undefined") return "zh-Hans";
  for (const key of KEYS) {
    const value = window.localStorage.getItem(key);
    if (value === "zh-Hans" || value === "zh-Hant" || value === "en") return value;
  }
  return "zh-Hans";
}

export function useTeacherLocale() {
  const [locale, setLocaleState] = useState<TeacherLocale>("zh-Hans");

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  function setLocale(next: TeacherLocale) {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("teacher_lang", next);
      window.localStorage.setItem("site_lang", next);
      document.cookie = `teacher_lang=${next}; path=/; max-age=31536000; samesite=lax`;
      document.cookie = `site_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    }
  }

  return { locale, setLocale };
}
