"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import translations from "@/content/translations.json";
import { uiCopy } from "@/content/ui-copy";
import type { Language } from "@/content/sample-trips";

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, updateLanguage] = useState<Language>("en");
  function setLang(value: Language) {
    updateLanguage(value);
    document.documentElement.lang = value;
  }
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage requires LanguageProvider");
  return { ...value, t: translations[value.lang], ui: uiCopy[value.lang] };
}
