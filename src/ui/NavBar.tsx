"use client";
import { ThemeToggle } from "@/COMPONENTS.reg";
import { useI18n } from "@/COMPONENTS.reg";
import { usePrefetchOnHover } from "@/COMPONENTS.reg";

export function NavBar() {
  const preMods = usePrefetchOnHover?.("/modules") ?? {};
  const { lang, setLang } = useI18n ? useI18n() : { lang: "fr", setLang: () => {} };
  return (
    <header style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px" }}>
      <a href="/" aria-label="Accueil">EmotionsCare</a>
      <nav style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <a {...preMods} href="/modules">Modules</a>
        <a href="/legal/privacy">Confidentialité</a>
        <a href="/legal/terms">Conditions</a>
        <button onClick={() => setLang?.(lang === "fr" ? "en" : "fr")} aria-label="Changer de langue">🌐</button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
