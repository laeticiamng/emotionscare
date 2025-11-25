// @ts-nocheck
"use client";
import { ThemeToggle } from "@/theme/ThemeProvider";
import { useI18n } from "@/lib/i18n";
import { usePrefetchOnHover } from "@/hooks/usePrefetchOnHover";

export function NavBar() {
  const preMods = usePrefetchOnHover("/modules");
  const i18n = useI18n();
  const lang = i18n?.lang ?? "fr";
  const setLang = i18n?.setLang ?? (() => {});
  return (
    <header style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px" }}>
      <a href="/" aria-label="Accueil">EmotionsCare</a>
      <nav style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <a {...preMods} href="/modules">Modules</a>
        <a href="/legal/mentions">Mentions légales</a>
        <a href="/legal/terms">Conditions d'utilisation</a>
        <a href="/legal/sales">CGV</a>
        <a href="/legal/privacy">Confidentialité</a>
        <a href="/legal/cookies">Cookies</a>
        <button onClick={() => setLang?.(lang === "fr" ? "en" : "fr")} aria-label="Changer de langue">🌐</button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
