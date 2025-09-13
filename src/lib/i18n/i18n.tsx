"use client";
import React from "react";
import { dict, Lang } from "./dictionaries";

type Ctx = { lang: Lang; setLang: (l: Lang)=>void };
const I18nCtx = React.createContext<Ctx>({ lang: "fr", setLang: ()=>{} });

export function I18nProvider({ children, defaultLang="fr" as Lang }: { children: React.ReactNode; defaultLang?: Lang }) {
  const [lang, setLang] = React.useState<Lang>(defaultLang);
  React.useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored) setLang(stored);
  }, []);
  React.useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  return <I18nCtx.Provider value={{ lang, setLang }}>{children}</I18nCtx.Provider>;
}

export function useI18n() { return React.useContext(I18nCtx); }

export function t(key: string, ns: keyof typeof dict["fr"]="common") {
  return (dict as any)[(typeof window !== "undefined" ? (localStorage.getItem("lang") || "fr") : "fr")][ns]?.[key] ?? key;
}
