import { Link } from 'react-router-dom';
import { ThemeToggle } from "@/theme/ThemeProvider";
import { useTranslation } from 'react-i18next';

export function NavBar() {
  const { i18n } = useTranslation();
  const lang = i18n.language ?? "fr";

  const toggleLang = () => {
    const newLang = lang === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <header style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px" }}>
      <Link to="/" aria-label="Accueil">EmotionsCare</Link>
      <nav style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <Link to="/app/modules">Modules</Link>
        <Link to="/legal/mentions">Mentions légales</Link>
        <Link to="/legal/terms">Conditions d'utilisation</Link>
        <Link to="/legal/sales">CGV</Link>
        <Link to="/legal/privacy">Confidentialité</Link>
        <Link to="/legal/cookies">Cookies</Link>
        <button onClick={toggleLang} aria-label="Changer de langue">🌐</button>
        <ThemeToggle />
      </nav>
    </header>
  );
}