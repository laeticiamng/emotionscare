/**
 * i18n Configuration for EmotionsCare
 * Complete FR/EN localization support
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// FR Translations
import { navigation } from './locales/fr/navigation';
import { common } from './locales/fr/common';
import { dashboard } from './locales/fr/dashboard';
import { settings } from './locales/fr/settings';
import { modules } from './locales/fr/modules';
import { auth } from './locales/fr/auth';
import { errors } from './locales/fr/errors';
import { legal } from './locales/fr/legal';

// EN Translations
import { navigation as navigationEN } from './locales/en/navigation';
import { common as commonEN } from './locales/en/common';
import { dashboard as dashboardEN } from './locales/en/dashboard';
import { settings as settingsEN } from './locales/en/settings';
import { modules as modulesEN } from './locales/en/modules';
import { auth as authEN } from './locales/en/auth';
import { errors as errorsEN } from './locales/en/errors';
import { legal as legalEN } from './locales/en/legal';

const resources = {
  fr: {
    navigation,
    common,
    dashboard,
    settings,
    modules,
    auth,
    errors,
    legal,
  },
  en: {
    navigation: navigationEN,
    common: commonEN,
    dashboard: dashboardEN,
    settings: settingsEN,
    modules: modulesEN,
    auth: authEN,
    errors: errorsEN,
    legal: legalEN,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    lng: 'fr', // Default to French
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false,
    },
  });

// Expose globally for profile settings
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n;
}

export default i18n;