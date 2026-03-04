import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation('legal');

  return (
    <footer style={{ padding: "16px", opacity: 0.8 }}>
      <small>
        © {new Date().getFullYear()} EmotionsCare —
        {' '}
        <Link to="/legal/mentions">{t('termsOfService')}</Link>
        {' · '}
        <Link to="/legal/privacy">{t('privacyPolicy')}</Link>
        {' · '}
        <Link to="/legal/cookies">{t('cookiePolicy')}</Link>
      </small>
    </footer>
  );
}
