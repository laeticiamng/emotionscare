// @ts-nocheck
import { useState, type ChangeEvent } from 'react';

import {
  changeLanguage,
  getCurrentLocale,
  resolveLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
  useTranslation,
} from './config';

export interface LanguageSwitcherProps {
  className?: string;
  id?: string;
}

export function LanguageSwitcher({ className, id }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation('common');
  const [isLoading, setIsLoading] = useState(false);

  const currentLocale = resolveLocale(i18n.language ?? getCurrentLocale());

  const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as AppLocale;

    if (nextLocale === currentLocale) {
      return;
    }

    setIsLoading(true);

    try {
      await changeLanguage(nextLocale);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <label className={className} htmlFor={id ?? 'language-switcher'}>
      <span>{t('languageSwitch.label')}</span>
      <select
        id={id ?? 'language-switcher'}
        value={currentLocale}
        onChange={handleChange}
        disabled={isLoading}
        aria-busy={isLoading || undefined}
        aria-label={t('languageSwitch.label')}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {t(`languageNames.${locale}`)}
          </option>
        ))}
      </select>
      {isLoading ? <span>{t('languageSwitch.loading')}</span> : null}
    </label>
  );
}
