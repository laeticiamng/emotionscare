// @ts-nocheck
import { Link } from 'react-router-dom';
import { ThemeToggle } from "@/theme/ThemeProvider";
import { useTranslation } from 'react-i18next';

const LANG_CYCLE: Array<'fr' | 'en' | 'de'> = ['fr', 'en', 'de'];
const LANG_LABELS: Record<string, string> = { fr: 'FR', en: 'EN', de: 'DE' };

export function NavBar() {
  const { t, i18n } = useTranslation('navigation');
  const lang = (i18n.language?.slice(0, 2) ?? 'fr') as 'fr' | 'en' | 'de';

  const toggleLang = () => {
    const idx = LANG_CYCLE.indexOf(lang);
    const newLang = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <header style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px" }}>
      <Link to="/" aria-label={t('home')}>EmotionsCare</Link>
      <nav style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <Link to="/app/modules">{t('scan', { ns: 'navigation' })}</Link>
        <button onClick={toggleLang} aria-label={t('home', { ns: 'navigation' }) + ' language'}>
          🌐 {LANG_LABELS[lang] ?? 'FR'}
        </button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
